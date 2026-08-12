<script setup>
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();
</script>

<template>
  <aside class="w-64 bg-white border-r border-gray-200 flex-shrink-0 flex flex-col h-full p-4">
    <div class="mb-6">
      <img src="/logo-softbridge.png" class="h-10 object-contain" alt="SoftBridge" />
    </div>
    <nav class="flex-1 space-y-1 overflow-y-auto">
      <router-link to="/dashboard/chef-projet/accueil" active-class="bg-blue-50 text-primary-light" class="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
        <i class="fas fa-house w-5 text-center"></i> Vue d'ensemble
      </router-link>
      <router-link to="/dashboard/chef-projet/clients" active-class="bg-blue-50 text-primary-light" class="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
        <i class="fas fa-users w-5 text-center"></i> Clients
      </router-link>
      <router-link to="/dashboard/chef-projet/quotes" active-class="bg-blue-50 text-primary-light" class="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
        <i class="fas fa-file-invoice w-5 text-center"></i> Devis
      </router-link>
      <router-link to="/dashboard/chef-projet/projects" active-class="bg-blue-50 text-primary-light" class="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
        <i class="fas fa-code-branch w-5 text-center"></i> Projets
      </router-link>
      <router-link to="/dashboard/chef-projet/reports" active-class="bg-blue-50 text-primary-light" class="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
        <i class="fas fa-file-lines w-5 text-center"></i> Rapports
      </router-link>
      <router-link to="/dashboard/chef-projet/appointments" active-class="bg-blue-50 text-primary-light" class="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
        <i class="fas fa-calendar-check w-5 text-center"></i> Mes rendez-vous
      </router-link>
      <router-link to="/dashboard/chef-projet/notifications" active-class="bg-blue-50 text-primary-light" class="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
        <i class="fas fa-bell w-5 text-center"></i> Notifications
      </router-link>
      <router-link to="/dashboard/chef-projet/profile" active-class="bg-blue-50 text-primary-light" class="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
        <i class="fas fa-user-circle w-5 text-center"></i> Mon Profil
      </router-link>
    </nav>
    <button @click="authStore.logout()" class="mt-auto flex items-center gap-3 px-4 py-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors">
      <i class="fas fa-right-from-bracket w-5 text-center"></i> Déconnexion
    </button>
  </aside>
</template>