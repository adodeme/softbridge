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

// Chargement des notifications pour tous les utilisateurs connectés
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

// Rechargement des notifications quand un autre composant le demande
const reloadListener = () => {
  fetchNotifications();
};

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
        <img src="/logo-softbridge.png" class="h-12 object-contain" alt="SoftBridge" />
      </router-link>
      <div class="hidden md:flex items-center gap-6">
        <!-- Visiteur -->
        <template v-if="!authStore.token">
          <router-link to="/" class="text-gray-700 hover:text-primary-light">Accueil</router-link>
          <router-link to="/catalog" class="text-gray-700 hover:text-primary-light">Catalogue</router-link>
          <router-link to="/rdv" class="text-gray-700 hover:text-primary-light">Prendre RDV</router-link>
          <router-link to="/login" class="text-primary font-semibold hover:text-primary-light">Connexion</router-link>
        </template>

        <!-- Utilisateur connecté -->
        <template v-else>
          <!-- Badge de notifications (pour tous les rôles) -->
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

          <!-- Lien Accueil / Dashboard -->
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

          <!-- Déconnexion -->
          <button @click="handleLogout" class="text-red-500 font-medium hover:text-red-700">Déconnexion</button>
        </template>
      </div>
    </div>
  </nav>
</template>