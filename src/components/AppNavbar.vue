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

const closeNotifications = () => {
  showNotifications.value = false;
};

const handleClickOutside = (event) => {
  if (!event.target.closest('#notification-dropdown')) {
    showNotifications.value = false;
  }
};

onMounted(() => {
  fetchNotifications();
  document.addEventListener('click', handleClickOutside);
});
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <nav class="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50 h-16 flex items-center px-4">
    <div class="max-w-7xl mx-auto w-full flex justify-between items-center">
      <router-link to="/" class="flex items-center gap-2">
        <img src="/logo-softbridge.png" class="h-10 sm:h-12 object-contain" alt="SoftBridge" />
      </router-link>

      <div class="hidden md:flex items-center gap-6">
        <template v-if="!authStore.token">
          <router-link to="/" class="text-gray-700 hover:text-primary-light">Accueil</router-link>
          <router-link to="/catalog" class="text-gray-700 hover:text-primary-light">Catalogue</router-link>
          <router-link to="/rdv" class="text-gray-700 hover:text-primary-light">Prendre RDV</router-link>
          <router-link to="/login" class="text-primary font-semibold hover:text-primary-light">Connexion</router-link>
        </template>

        <template v-else>
          <div id="notification-dropdown" class="relative">
            <button @click="toggleNotifications" class="relative flex items-center text-gray-600 hover:text-primary-light">
              <i class="fas fa-bell text-xl"></i>
              <span v-if="unreadCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{{ unreadCount }}</span>
            </button>

            <transition name="fade">
              <div v-if="showNotifications" class="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                <div class="p-3 border-b border-gray-100 flex justify-between items-center">
                  <h4 class="font-semibold text-gray-800">Notifications</h4>
                  <router-link to="/dashboard/client/notifications" @click="closeNotifications" class="text-xs text-primary-light hover:underline">Tout voir</router-link>
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

    <div v-if="isNavOpen" class="absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg md:hidden">
      <div class="flex flex-col p-4 gap-2">
        <template v-if="!authStore.token">
          <router-link to="/" @click="isNavOpen = false" class="py-2 text-gray-700">Accueil</router-link>
          <router-link to="/catalog" @click="isNavOpen = false" class="py-2 text-gray-700">Catalogue</router-link>
          <router-link to="/rdv" @click="isNavOpen = false" class="py-2 text-gray-700">Prendre RDV</router-link>
          <router-link to="/login" @click="isNavOpen = false" class="py-2 text-primary font-semibold">Connexion</router-link>
        </template>
        <template v-else>
          <router-link :to="authStore.user?.role === 'client' ? '/dashboard/client/notifications' : '/dashboard/admin/notifications'" @click="isNavOpen = false" class="py-2 text-gray-700 flex items-center gap-2">
            <i class="fas fa-bell"></i> Notifications
            <span v-if="unreadCount > 0" class="bg-red-500 text-white text-xs rounded-full px-2">{{ unreadCount }}</span>
          </router-link>
          <router-link to="/" @click="isNavOpen = false" class="py-2 text-gray-700">Accueil</router-link>
          <button @click="handleLogout" class="py-2 text-red-500 font-medium text-left">Déconnexion</button>
        </template>
      </div>
    </div>
  </nav>
</template>