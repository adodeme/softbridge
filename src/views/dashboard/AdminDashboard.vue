<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api/axios';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const stats = ref({});
const isLoading = ref(true);

const loadStats = async () => {
    try {
        const res = await api.get('/admin/stats');
        stats.value = res.data;
    } catch (error) {
        console.error('Erreur lors du chargement des stats', error);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    loadStats();
});
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-primary mb-2">Tableau de bord Administrateur</h1>
    <p class="text-gray-500 mb-6">Bienvenue, {{ authStore.user?.prenom }} {{ authStore.user?.nom }} !</p>

    <!-- CARTES DE STATISTIQUES -->
    <div v-if="isLoading" class="text-center py-10 text-gray-500">
        <i class="fas fa-spinner fa-spin text-3xl text-primary-light"></i>
        <p class="mt-2">Chargement des statistiques...</p>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div class="w-12 h-12 bg-blue-50 text-primary-light rounded-full flex items-center justify-center text-xl">
                <i class="fas fa-users"></i>
            </div>
            <div>
                <p class="text-gray-500 text-sm">Total Utilisateurs</p>
                <p class="text-2xl font-bold text-gray-800">{{ stats.total_users }}</p>
            </div>
        </div>
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div class="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center text-xl">
                <i class="fas fa-building"></i>
            </div>
            <div>
                <p class="text-gray-500 text-sm">Total Clients</p>
                <p class="text-2xl font-bold text-gray-800">{{ stats.total_clients }}</p>
            </div>
        </div>
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div class="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center text-xl">
                <i class="fas fa-file-invoice"></i>
            </div>
            <div>
                <p class="text-gray-500 text-sm">Devis en attente</p>
                <p class="text-2xl font-bold text-gray-800">{{ stats.pending_quotes }}</p>
            </div>
        </div>
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div class="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center text-xl">
                <i class="fas fa-code-branch"></i>
            </div>
            <div>
                <p class="text-gray-500 text-sm">Projets en cours</p>
                <p class="text-2xl font-bold text-gray-800">{{ stats.projects_in_progress }}</p>
            </div>
        </div>
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div class="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center text-xl">
                <i class="fas fa-credit-card"></i>
            </div>
            <div>
                <p class="text-gray-500 text-sm">Revenus Totaux</p>
                <p class="text-2xl font-bold text-primary">{{ stats.total_revenue ? stats.total_revenue.toLocaleString() : 0 }} FCFA</p>
            </div>
        </div>
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div class="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-xl">
                <i class="fas fa-cubes"></i>
            </div>
            <div>
                <p class="text-gray-500 text-sm">Abonnements Actifs</p>
                <p class="text-2xl font-bold text-gray-800">{{ stats.active_subscriptions }}</p>
            </div>
        </div>
    </div>
  </div>
</template>