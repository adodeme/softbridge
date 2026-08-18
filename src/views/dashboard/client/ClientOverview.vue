<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api/axios';
import { useAuthStore } from '@/stores/auth';
import Swal from 'sweetalert2';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const stats = ref({});
const isLoading = ref(true);

const loadStats = async () => {
  try {
    const response = await api.get('/dashboard/stats');
    stats.value = response.data;
  } catch (error) {
    console.error('Erreur chargement stats', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await loadStats();

  if (route.query.payment_status === 'processing' && route.query.reference) {
    try {
      await api.get(`/payments/verify?reference=${route.query.reference}`);
      Swal.fire('Succès', 'Paiement confirmé.', 'success');
    } catch (e) {
      Swal.fire('Erreur', e.response?.data?.message || 'Paiement non confirmé.', 'error');
    } finally {
      router.replace({ path: '/dashboard/client/accueil' });
    }
  }
});

const cards = [
  { title: 'Devis', icon: 'fa-file-invoice', value: () => stats.value.totalQuotes || 0, route: '/dashboard/client/quotes', bg: 'bg-blue-50', text: 'text-primary-light' },
  { title: 'Projets en cours', icon: 'fa-code-branch', value: () => stats.value.totalProjects || 0, route: '/dashboard/client/projects', bg: 'bg-orange-50', text: 'text-orange-500' },
  { title: 'Factures', icon: 'fa-receipt', value: () => stats.value.totalInvoices || 0, route: '/dashboard/client/invoices', bg: 'bg-green-50', text: 'text-green-600' },
  { title: 'Rendez-vous', icon: 'fa-calendar-check', value: () => stats.value.totalAppointments || 0, route: '/dashboard/client/appointments', bg: 'bg-purple-50', text: 'text-purple-600' },
  { title: 'Notifications non lues', icon: 'fa-bell', value: () => stats.value.unreadNotifications || 0, route: '/dashboard/client/notifications', bg: 'bg-red-50', text: 'text-red-500' },
];
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-bold text-primary">Vue d'ensemble</h2>
        <p class="text-gray-500">Bienvenue, {{ authStore.user?.prenom }} {{ authStore.user?.nom }} !</p>
      </div>
      <router-link to="/dashboard/client/profile" class="text-sm text-primary-light hover:text-primary">
        Mon profil <i class="fas fa-arrow-right ml-1"></i>
      </router-link>
    </div>

    <div v-if="isLoading" class="text-center py-10 text-gray-500">
      <i class="fas fa-spinner fa-spin text-3xl text-primary-light"></i>
      <p class="mt-2">Chargement...</p>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      <div
        v-for="card in cards"
        :key="card.title"
        @click="router.push(card.route)"
        class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all duration-200 flex items-start gap-4"
      >
        <div class="w-12 h-12 rounded-xl flex items-center justify-center text-xl" :class="[card.bg, card.text]">
          <i :class="'fas ' + card.icon"></i>
        </div>
        <div>
          <p class="text-sm text-gray-500">{{ card.title }}</p>
          <p class="text-2xl font-bold text-gray-800">{{ card.value() }}</p>
        </div>
      </div>
    </div>
  </div>
</template>