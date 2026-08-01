<script setup>
import { useAuthStore } from '@/stores/auth';
import { useRouter, useRoute } from 'vue-router';
import { ref, computed, onMounted, onUnmounted } from 'vue';
import api from '@/api/axios';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const isNavOpen = ref(false);
const notifications = ref([]);

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

const reloadListener = () => fetchNotifications();

onMounted(() => {
  fetchNotifications();
  window.addEventListener('reloadNotifications', reloadListener);
});
onUnmounted(() => {
  window.removeEventListener('reloadNotifications', reloadListener);
});
</script>

<template>
  <nav class="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50 h-16 flex items-center px-4">
    <div class="max-w-7xl mx-auto w-full flex justify-between items-center">
      <router-link to="/" class="flex items-center gap-2">
        <img src="/logo-softbridge.png" class="h-10 sm:h-12 object-contain" alt="SoftBridge" />
      </router-link>

      <!-- Bouton hamburger mobile -->
      <div class="md:hidden">
        <button @click="isNavOpen = !isNavOpen" class="text-gray-700 focus:outline-none">
          <i class="fas fa-bars text-xl"></i>
        </button>
      </div>

      <!-- Navigation desktop -->
      <div class="hidden md:flex items-center gap-6">
        <template v-if="!authStore.token">
          <router-link to="/" class="text-gray-700 hover:text-primary-light">Accueil</router-link>
          <router-link to="/catalog" class="text-gray-700 hover:text-primary-light">Catalogue</router-link>
          <router-link to="/rdv" class="text-gray-700 hover:text-primary-light">Prendre RDV</router-link>
          <router-link to="/login" class="text-primary font-semibold hover:text-primary-light">Connexion</router-link>
        </template>

        <template v-else>
          <div class="relative cursor-pointer"
               @click="router.push(authStore.user?.role === 'client' ? '/dashboard/client/notifications' :
                                     authStore.user?.role === 'chef_projet' ? '/dashboard/chef-projet/notifications' :
                                     '/dashboard/admin/notifications')">
            <i class="fas fa-bell text-xl text-gray-600"></i>
            <span v-if="unreadCount > 0"
                  class="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {{ unreadCount }}
            </span>
          </div>

          <template v-if="isInDashboard">
            <router-link to="/" class="text-gray-700 hover:text-primary-light">Accueil</router-link>
          </template>
          <template v-else>
            <router-link :to="authStore.user?.role === 'client' ? '/dashboard/client/accueil' :
                                authStore.user?.role === 'chef_projet' ? '/dashboard/chef-projet/accueil' :
                                '/dashboard/admin/accueil'"
                         class="text-gray-700 hover:text-primary-light">
              Mon Dashboard
            </router-link>
          </template>

          <button @click="handleLogout" class="text-red-500 font-medium hover:text-red-700">Déconnexion</button>
        </template>
      </div>
    </div>

    <!-- Menu mobile déroulant -->
    <div v-if="isNavOpen" class="absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg md:hidden">
      <div class="flex flex-col p-4 gap-2">
        <template v-if="!authStore.token">
          <router-link to="/" @click="isNavOpen = false" class="py-2 text-gray-700">Accueil</router-link>
          <router-link to="/catalog" @click="isNavOpen = false" class="py-2 text-gray-700">Catalogue</router-link>
          <router-link to="/rdv" @click="isNavOpen = false" class="py-2 text-gray-700">Prendre RDV</router-link>
          <router-link to="/login" @click="isNavOpen = false" class="py-2 text-primary font-semibold">Connexion</router-link>
        </template>
        <template v-else>
          <router-link :to="authStore.user?.role === 'client' ? '/dashboard/client/notifications' : '/dashboard/admin/notifications'"
                       @click="isNavOpen = false" class="py-2 text-gray-700 flex items-center gap-2">
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