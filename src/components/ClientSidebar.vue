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
      <router-link to="/dashboard/client/accueil" active-class="bg-blue-50 text-primary-light" class="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
        <i class="fas fa-house w-5 text-center"></i> Vue d'ensemble
      </router-link>
      <router-link to="/dashboard/client/quotes" active-class="bg-blue-50 text-primary-light" class="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
        <i class="fas fa-file-invoice w-5 text-center"></i> Devis
      </router-link>
      <router-link to="/dashboard/client/projects" active-class="bg-blue-50 text-primary-light" class="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
        <i class="fas fa-code-branch w-5 text-center"></i> Mes Projets
      </router-link>
      <router-link to="/dashboard/client/appointments" active-class="bg-blue-50 text-primary-light" class="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
        <i class="fas fa-calendar-check w-5 text-center"></i> Mes Rendez-vous
      </router-link>
      <router-link to="/dashboard/client/invoices" active-class="bg-blue-50 text-primary-light" class="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
        <i class="fas fa-receipt w-5 text-center"></i> Mes Factures
      </router-link>
      <router-link to="/dashboard/client/notifications" active-class="bg-blue-50 text-primary-light" class="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
        <i class="fas fa-bell w-5 text-center"></i> Notifications
      </router-link>
      <router-link to="/dashboard/client/profile" active-class="bg-blue-50 text-primary-light" class="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
        <i class="fas fa-user-circle w-5 text-center"></i> Mon Profil
      </router-link>
    </nav>

    <!-- Profil utilisateur connecté -->
    <div class="border-t border-gray-200 pt-4 mb-2">
      <div class="flex items-center gap-3 px-2">
        <div class="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
          <img v-if="authStore.user?.photo" :src="authStore.user.photo" alt="Photo" class="w-full h-full object-cover" />
          <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
            <i class="fas fa-user"></i>
          </div>
        </div>
        <div class="min-w-0">
          <p class="text-sm font-semibold text-gray-800 truncate">
            {{ authStore.user?.prenom }} {{ authStore.user?.nom }}
          </p>
          <p class="text-xs text-gray-500 truncate">{{ authStore.user?.email }}</p>
        </div>
      </div>
    </div>

    <button @click="authStore.logout()" class="flex items-center gap-3 px-4 py-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors">
      <i class="fas fa-right-from-bracket w-5 text-center"></i> Déconnexion
    </button>
  </aside>
</template>