<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api/axios';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const stats = ref({});

onMounted(async () => {
  try {
    const response = await api.get('/dashboard/stats');
    stats.value = response.data;
  } catch (error) {
    console.error('Erreur lors du chargement des statistiques', error);
  }
});
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold text-primary mb-6">Vue d'ensemble</h2>
    <p class="text-gray-500 mb-6">Bienvenue, {{ authStore.user?.prenom }} {{ authStore.user?.nom }} !</p>

    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <!-- Carte Devis -->
      <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <p class="text-gray-500 text-sm">Devis</p>
        <p class="text-2xl font-bold text-primary-light">{{ stats.totalQuotes || 0 }}</p>
      </div>
      <!-- Carte Projets -->
      <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <p class="text-gray-500 text-sm">Projets</p>
        <p class="text-2xl font-bold text-blue-500">{{ stats.totalProjects || 0 }}</p>
      </div>
      <!-- Carte Factures -->
      <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <p class="text-gray-500 text-sm">Factures</p>
        <p class="text-2xl font-bold text-green-500">{{ stats.totalInvoices || 0 }}</p>
      </div>
      <!-- Carte Notifications -->
      <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <p class="text-gray-500 text-sm">Notifications</p>
        <p class="text-2xl font-bold text-red-500">{{ stats.unreadNotifications || 0 }}</p>
      </div>
    </div>
  </div>
</template>