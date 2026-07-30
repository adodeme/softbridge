<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api/axios';

const route = useRoute();
const router = useRouter();
const report = ref(null);
const isLoading = ref(true);
const error = ref(null);

const loadReport = async () => {
  try {
    console.log('🔍 Chargement du rapport ID:', route.params.id);
    const res = await api.get(`/reports/${route.params.id}`);
    console.log('✅ Réponse API:', res.data);
    report.value = res.data;
  } catch (e) {
    console.error('❌ Erreur API:', e);
    error.value = e.response?.data?.message || 'Impossible de charger le rapport.';
  } finally {
    isLoading.value = false;
  }
};

const downloadPdf = async () => {
  try {
    const response = await api.get(`/reports/${report.value.id}/download`, {
      responseType: 'blob'  // ← Indispensable pour recevoir le PDF en binaire
    });
    // Créer une URL blob à partir des données reçues
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    // Créer un lien temporaire et le cliquer
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `rapport_${report.value.id}.pdf`);
    document.body.appendChild(link);
    link.click();
    // Nettoyer
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Erreur téléchargement PDF', error);
    Swal.fire('Erreur', 'Impossible de télécharger le PDF.', 'error');
  }
};

const ignoreReport = async () => {
  await api.post(`/reports/${report.value.id}/ignore`);
  router.push('/dashboard/admin/reports');
};

onMounted(loadReport);
</script>

<template>
  <div class="max-w-2xl mx-auto py-8 px-4">
    <!-- Chargement -->
    <div v-if="isLoading" class="text-center py-10 text-gray-500">
      <i class="fas fa-spinner fa-spin text-3xl text-primary-light"></i>
      <p class="mt-2">Chargement...</p>
    </div>

    <!-- Erreur -->
    <div v-else-if="error" class="bg-red-50 p-6 rounded-xl text-red-600 text-center border border-red-200">
      <i class="fas fa-exclamation-circle text-3xl mb-3"></i>
      <p>{{ error }}</p>
      <button @click="router.push('/dashboard/admin/reports')" class="mt-4 bg-primary text-white px-4 py-2 rounded-lg">
        Retour aux rapports
      </button>
    </div>

    <!-- Détails du rapport -->
    <div v-else-if="report" class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 class="text-2xl font-bold text-primary mb-4">{{ report.titre }}</h2>

      <div class="space-y-3 text-gray-700">
        <p><span class="font-bold">Projet :</span>{{ report.chefProjet?.prenom }} {{ report.project?.nom || 'N/A' }}</p>
        <p><span class="font-bold">Date :</span> {{ new Date(report.date_rapport).toLocaleDateString() }}</p>
        <p class="mt-4 whitespace-pre-line">{{ report.contenu }}</p>
      </div>

      <div class="mt-6 flex flex-col sm:flex-row gap-3">
        <button @click="downloadPdf" class="flex-1 bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary-light transition">
          <i class="fas fa-file-pdf mr-2"></i> Convertir en PDF
        </button>
        <button @click="ignoreReport" class="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300 transition">
          <i class="fas fa-eye-slash mr-2"></i> Ignorer
        </button>
      </div>
    </div>

    <!-- Fallback si aucune donnée -->
    <div v-else class="text-center py-10 text-gray-500">
      Aucune donnée disponible.
    </div>
  </div>
</template>