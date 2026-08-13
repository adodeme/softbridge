<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter, useRoute } from 'vue-router';
import api from '@/api/axios';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const isNavOpen = ref(false);
const notifications = ref([]);
const showNotifications = ref(false);

const fetchNotifications = async () => {
  if (authStore.token) {
    try {
      const res = await api.get('/notifications');
      notifications.value = res.data;
    } catch (e) {
      console.error('Erreur chargement notifications', e);
    }
  }
};

const unreadCount = computed(() => notifications.value.filter(n => !n.lu).length);
const isInDashboard = computed(() => route.path.startsWith('/dashboard/'));

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};

const markAllAsRead = async () => {
  try {
    await api.post('/notifications/mark-read');
    fetchNotifications();
  } catch (e) {
    console.error(e);
  }
};

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
  if (showNotifications.value) {
    markAllAsRead();
  }
};

const goToNotifications = () => {
  showNotifications.value = false;
  if (authStore.user?.role === 'client') {
    router.push('/dashboard/client/notifications');
  } else if (authStore.user?.role === 'chef_projet') {
    router.push('/dashboard/chef-projet/notifications');
  } else {
    router.push('/dashboard/admin/notifications');
  }
};

onMounted(() => {
  fetchNotifications();
});

const toggleNav = () => {
  isNavOpen.value = !isNavOpen.value;
};

const closeNav = () => {
  isNavOpen.value = false;
};
</script>

<template>
  <nav class="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
      <!-- Logo -->
      <router-link to="/" class="flex items-center gap-2">
        <img src="/logo-softbridge.png" class="h-10 sm:h-12 object-contain" alt="SoftBridge" />
      </router-link>

      <!-- Bouton hamburger (toujours visible sur mobile, masqué sur desktop) -->
      <button @click="toggleNav" class="md:hidden text-gray-700 focus:outline-none">
        <i class="fas fa-bars text-2xl"></i>
      </button>

      <!-- Navigation desktop -->
      <div class="hidden md:flex items-center gap-6">
        <template v-if="!authStore.token">
          <router-link to="/" class="text-gray-700 hover:text-primary-light">Accueil</router-link>
          <router-link to="/catalog" class="text-gray-700 hover:text-primary-light">Catalogue</router-link>
          <router-link to="/rdv" class="text-gray-700 hover:text-primary-light">Prendre RDV</router-link>
          <router-link to="/login" class="text-primary font-semibold hover:text-primary-light">Connexion</router-link>
        </template>

        <template v-else>
          <!-- Notifications avec dropdown (desktop) -->
          <div class="relative">
            <button @click="toggleNotifications" class="relative flex items-center text-gray-600 hover:text-primary-light">
              <i class="fas fa-bell text-xl"></i>
              <span v-if="unreadCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{{ unreadCount }}</span>
            </button>

            <transition name="fade">
              <div v-if="showNotifications" class="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                <div class="p-3 border-b border-gray-100 flex justify-between items-center">
                  <h4 class="font-semibold text-gray-800">Notifications</h4>
                  <button @click="goToNotifications" class="text-xs text-primary-light hover:underline">Tout voir</button>
                </div>
                <div class="max-h-64 overflow-y-auto">
                  <div v-for="notif in notifications.slice(0, 5)" :key="notif.id" class="p-3 border-b border-gray-50 flex items-start gap-2" :class="notif.lu ? 'bg-white' : 'bg-blue-50'">
                    <i class="fas fa-info-circle text-primary-light mt-0.5"></i>
                    <div>
                      <p class="text-sm text-gray-700">{{ notif.message }}</p>
                      <p class="text-xs text-gray-400 mt-1">{{ new Date(notif.date_envoi).toLocaleString() }}</p>
                    </div>
                  </div>
                  <div v-if="notifications.length === 0" class="p-4 text-center text-sm text-gray-400">Aucune notification</div>
                </div>
                <div class="p-2 border-t border-gray-100">
                  <button @click="markAllAsRead" class="w-full text-center text-xs text-primary-light hover:underline py-1">Marquer tout comme lu</button>
                </div>
              </div>
            </transition>
          </div>

          <template v-if="isInDashboard">
            <router-link to="/" class="text-gray-700 hover:text-primary-light">Accueil</router-link>
          </template>
          <template v-else>
            <router-link :to="authStore.user?.role === 'client' ? '/dashboard/client/accueil' : authStore.user?.role === 'chef_projet' ? '/dashboard/chef-projet/accueil' : '/dashboard/admin/accueil'" class="text-gray-700 hover:text-primary-light">Mon Dashboard</router-link>
          </template>

          <button @click="handleLogout" class="text-red-500 font-medium hover:text-red-700">Déconnexion</button>
        </template>
      </div>
    </div>

    <!-- Menu mobile déroulant -->
    <div v-if="isNavOpen" class="md:hidden bg-white border-t border-gray-200 px-4 py-3 shadow-lg">
      <div class="flex flex-col space-y-2">
        <template v-if="!authStore.token">
          <router-link to="/" @click="closeNav" class="py-2 text-gray-700 hover:text-primary-light">Accueil</router-link>
          <router-link to="/catalog" @click="closeNav" class="py-2 text-gray-700 hover:text-primary-light">Catalogue</router-link>
          <router-link to="/rdv" @click="closeNav" class="py-2 text-gray-700 hover:text-primary-light">Prendre RDV</router-link>
          <router-link to="/login" @click="closeNav" class="py-2 text-primary font-semibold">Connexion</router-link>
        </template>
        <template v-else>
          <button @click="goToNotifications" class="flex items-center gap-2 py-2 text-gray-700 hover:text-primary-light text-left">
            <i class="fas fa-bell"></i> Notifications
            <span v-if="unreadCount > 0" class="bg-red-500 text-white text-xs rounded-full px-2">{{ unreadCount }}</span>
          </button>
          <template v-if="isInDashboard">
            <router-link to="/" @click="closeNav" class="py-2 text-gray-700 hover:text-primary-light">Accueil</router-link>
          </template>
          <template v-else>
            <router-link :to="authStore.user?.role === 'client' ? '/dashboard/client/accueil' : authStore.user?.role === 'chef_projet' ? '/dashboard/chef-projet/accueil' : '/dashboard/admin/accueil'" @click="closeNav" class="py-2 text-gray-700 hover:text-primary-light">Mon Dashboard</router-link>
          </template>
          <button @click="handleLogout" class="py-2 text-red-500 font-medium text-left">Déconnexion</button>
        </template>
      </div>
    </div>
  </nav>
</template>