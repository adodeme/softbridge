<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api/axios';
import Swal from 'sweetalert2';

const reports = ref([]);

const loadReports = async () => {
  try {
    // L'API renvoie maintenant uniquement les rapports non ignorés (filtrage backend)
    reports.value = (await api.get('/reports')).data;
  } catch (e) {
    console.error('Erreur chargement rapports', e);
  }
};

const ignoreReport = async (report) => {
  const confirm = await Swal.fire({
    title: 'Ignorer ce rapport ?',
    text: 'Il ne sera plus visible dans cette liste.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Oui, ignorer',
    cancelButtonText: 'Annuler'
  });
  if (!confirm.isConfirmed) return;

  try {
    await api.post(`/reports/${report.id}/ignore`);
    await loadReports();
    Swal.fire({ icon: 'success', title: 'Rapport ignoré', timer: 2000 });
  } catch (error) {
    Swal.fire('Erreur', 'Impossible d\'ignorer le rapport.', 'error');
  }
};

onMounted(loadReports);
</script>

<template>
  <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <div class="flex items-center gap-2 mb-6">
      <i class="fas fa-file-lines text-2xl text-primary-light"></i>
      <h3 class="text-2xl font-bold text-primary">Rapports du Chef de Projet</h3>
    </div>

    <!-- État vide -->
    <div v-if="reports.length === 0" class="text-center py-12 text-gray-400">
      <i class="fas fa-file-circle-xmark text-5xl mb-3 block text-gray-300"></i>
      <p>Aucun rapport pour le moment.</p>
    </div>

    <!-- Liste des rapports -->
    <div class="space-y-4">
      <div v-for="report in reports" :key="report.id"
           class="bg-gray-50 rounded-lg p-5 border border-gray-200 hover:border-primary-light transition-colors duration-200">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <h4 class="text-lg font-bold text-gray-800">{{ report.titre }}</h4>
              <span class="text-xs text-gray-500 bg-white px-3 py-1 rounded-full border">
                Projet : {{ report.project?.nom || 'N/A' }}
              </span>
            </div>
            <p class="text-sm text-gray-600 mb-2 line-clamp-2">{{ report.contenu }}</p>
            <p class="text-xs text-gray-400">
              Par <span class="font-medium">{{ report.chefProjet?.prenom }} {{ report.chefProjet?.nom }}</span>
              le {{ new Date(report.date_rapport).toLocaleDateString() }}
            </p>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2 self-end sm:self-center">
            <router-link :to="'/dashboard/admin/reports/' + report.id"
                         class="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-primary bg-primary/5 rounded-lg hover:bg-primary/10 transition">
              <i class="fas fa-eye"></i> Détail
            </router-link>
            <button @click="ignoreReport(report)"
                    class="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition">
              <i class="fas fa-eye-slash"></i> Ignorer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>