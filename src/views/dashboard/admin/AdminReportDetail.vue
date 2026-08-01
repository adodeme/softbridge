<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api/axios';
import Swal from 'sweetalert2';

const route = useRoute();
const router = useRouter();
const report = ref(null);
const isLoading = ref(true);

const loadReport = async () => {
    try {
        const res = await api.get(`/reports/${route.params.id}`);
        report.value = res.data;
    } catch (e) {
        console.error(e);
    } finally {
        isLoading.value = false;
    }
};

const downloadPdf = async () => {
    try {
        const response = await api.get(`/reports/${report.value.id}/download`, {
            responseType: 'blob'
        });
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `rapport_${report.value.id}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        Swal.fire('Erreur', 'Impossible de télécharger le PDF.', 'error');
    }
};

const ignoreReport = async () => {
    const confirm = await Swal.fire({
        title: 'Ignorer ce rapport ?',
        text: 'Il ne sera plus visible dans la liste.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Oui, ignorer',
        cancelButtonText: 'Annuler'
    });
    if (!confirm.isConfirmed) return;

    try {
        await api.post(`/reports/${report.value.id}/ignore`);
        Swal.fire({ icon: 'success', title: 'Rapport ignoré', timer: 2000 });
        router.push('/dashboard/admin/reports');
    } catch (error) {
        Swal.fire('Erreur', 'Impossible d\'ignorer le rapport.', 'error');
    }
};

onMounted(loadReport);
</script>

<template>
  <div class="max-w-2xl mx-auto py-8 px-4">
    <div v-if="isLoading" class="text-center py-10 text-gray-500">
      <i class="fas fa-spinner fa-spin text-3xl text-primary-light"></i>
      <p class="mt-2">Chargement...</p>
    </div>
    <div v-else-if="report" class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 class="text-2xl font-bold text-primary mb-4">Détails du rapport</h2>
        
        <div class="space-y-3 text-gray-700">
            <p><span class="font-bold">Projet :</span> {{ report.project?.nom }}</p>
            <p><span class="font-bold">Titre :</span> {{ report.titre }}</p>
            <p><span class="font-bold">Contenu :</span> {{ report.contenu }}</p>
            <p><span class="font-bold">Date :</span> {{ new Date(report.date_rapport).toLocaleDateString() }}</p>
        </div>

        <div class="mt-6 flex flex-col sm:flex-row gap-3">
            <button @click="downloadPdf" class="flex-1 bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary-light transition">
                <i class="fas fa-file-pdf mr-2"></i> Convertir en PDF
            </button>
            <button @click="ignoreReport" class="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300 transition">
                <i class="fas fa-eye-slash mr-2"></i> Ignorer
            </button>
            <button @click="router.push('/dashboard/admin/reports')" class="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition">
                <i class="fas fa-arrow-left mr-2"></i> Retour
            </button>
        </div>
    </div>
  </div>
</template>