<script setup>
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();
</script>

<template>
  <aside class="w-64 bg-white border-r border-gray-200 flex-shrink-0 flex flex-col h-full p-4">
    <div class="mb-6">
      <img src="/logo-softbridge.png" class="h-10 object-contain" alt="SoftBridge" />
    </div>
    <nav class="flex-1 space-y-1">
      <router-link to="/dashboard/admin/accueil" active-class="bg-blue-50 text-primary-light" class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
        <i class="fas fa-house w-5 text-center"></i> Vue d'ensemble
      </router-link>
      <router-link to="/dashboard/[rôle]/profile" class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
        <i class="fas fa-user-circle w-5 text-center"></i> Mon Profil
      </router-link>
      <router-link to="/dashboard/admin/users" active-class="bg-blue-50 text-primary-light" class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
        <i class="fas fa-users-gear w-5 text-center"></i> Utilisateurs
      </router-link>
      <router-link to="/dashboard/admin/softwares" active-class="bg-blue-50 text-primary-light" class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
        <i class="fas fa-cubes w-5 text-center"></i> Catalogue
      </router-link>
      <router-link to="/dashboard/admin/projects" active-class="bg-blue-50 text-primary-light" class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
        <i class="fas fa-code-branch w-5 text-center"></i> Projets
      </router-link>
      <router-link to="/dashboard/admin/reports" active-class="bg-blue-50 text-primary-light" class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
        <i class="fas fa-file-lines w-5 text-center"></i> Rapports
      </router-link>
      <router-link to="/dashboard/admin/payments" active-class="bg-blue-50 text-primary-light" class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
        <i class="fas fa-money-bill-wave w-5 text-center"></i> Paiements
      </router-link>
      <router-link to="/dashboard/admin/statistics" active-class="bg-blue-50 text-primary-light" class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
        <i class="fas fa-chart-pie w-5 text-center"></i> Statistiques
      </router-link>
      <router-link to="/dashboard/admin/notifications" active-class="bg-blue-50 text-primary-light" class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
        <i class="fas fa-bell w-5 text-center"></i> Notifications
      </router-link>
    </nav>
    <button @click="authStore.logout()" class="mt-auto flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors">
      <i class="fas fa-right-from-bracket w-5 text-center"></i> Déconnexion
    </button>
  </aside>
</template>