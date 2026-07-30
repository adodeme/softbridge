<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { Chart, registerables } from 'chart.js';
import api from '@/api/axios';

Chart.register(...registerables);

const stats = ref({});
const isLoading = ref(true);
let chartInstance = null;

const loadStats = async () => {
  try {
    const res = await api.get('/dashboard/stats');
    stats.value = res.data;
    isLoading.value = false;
    // Attendre la mise à jour du DOM avant de créer le graphique
    setTimeout(createChart, 200);
  } catch (error) {
    console.error('Erreur lors du chargement des statistiques', error);
    isLoading.value = false;
  }
};

const createChart = () => {
  const ctx = document.getElementById('projectsChart');
  if (!ctx) return;

  if (chartInstance) chartInstance.destroy();

  const rawData = stats.value.projects_by_client || [];
  if (rawData.length === 0) return;

  const labels = rawData.map(item => item.name);
  const data = rawData.map(item => item.count);

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Projets réalisés',
        data: data,
        backgroundColor: '#1572E8', // Bleu primaire de SoftBridge
        borderRadius: 6,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { 
          display: true,
          labels: {
            color: '#0C3A7A',
            font: { weight: 'bold' }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return context.parsed.y + ' projet(s)';
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize: 1 }
        }
      }
    }
  });
};

onMounted(loadStats);
onUnmounted(() => {
  if (chartInstance) chartInstance.destroy();
});
</script>

<template>
  <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    
    <h3 class="text-2xl font-bold text-primary mb-6">
      <i class="fas fa-chart-pie text-primary-light mr-2"></i>
      Statistiques
    </h3>

    <div v-if="isLoading" class="text-center py-10 text-gray-500">
      <i class="fas fa-spinner fa-spin text-3xl text-primary-light"></i>
      <p class="mt-2">Chargement des statistiques...</p>
    </div>

    <div v-else>
      
      <!-- Cartes de statistiques avec le même style que AdminOverview -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div class="w-12 h-12 bg-blue-50 text-primary-light rounded-full flex items-center justify-center text-xl">
            <i class="fas fa-users"></i>
          </div>
          <div>
            <p class="text-gray-500 text-sm">Total Utilisateurs</p>
            <p class="text-2xl font-bold text-gray-800">{{ stats.total_users || 0 }}</p>
          </div>
        </div>

        <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div class="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center text-xl">
            <i class="fas fa-building"></i>
          </div>
          <div>
            <p class="text-gray-500 text-sm">Total Clients</p>
            <p class="text-2xl font-bold text-gray-800">{{ stats.total_clients || 0 }}</p>
          </div>
        </div>

        <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div class="w-12 h-12 bg-blue-50 text-primary-light rounded-full flex items-center justify-center text-xl">
            <i class="fas fa-code-branch"></i>
          </div>
          <div>
            <p class="text-gray-500 text-sm">Total Projets</p>
            <p class="text-2xl font-bold text-blue-500">{{ stats.total_projects || 0 }}</p>
          </div>
        </div>

        <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div class="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center text-xl">
            <i class="fas fa-cubes"></i>
          </div>
          <div>
            <p class="text-gray-500 text-sm">Total Logiciels</p>
            <p class="text-2xl font-bold text-gray-800">{{ stats.total_softwares || 0 }}</p>
          </div>
        </div>

      </div>

      <!-- Graphique avec légende bleue -->
      <div class="bg-gray-50 p-4 rounded-lg border border-gray-100">
        <h4 class="font-bold text-gray-700 mb-3">Projets par client</h4>
        
        <div v-if="!stats.projects_by_client || stats.projects_by_client.length === 0" class="text-center py-8 text-gray-500">
          Aucun projet n'a encore été créé pour les clients.
        </div>

        <div v-else class="relative h-64 w-full">
          <canvas id="projectsChart"></canvas>
        </div>
      </div>

    </div>
  </div>
</template>