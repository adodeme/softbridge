<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api/axios';
import Swal from 'sweetalert2';

const reports = ref([]);
const projects = ref([]);
const showModal = ref(false);
const reportForm = ref({ project_id: '', titre: '', contenu: '' });

const loadData = async () => {
  try {
    reports.value = (await api.get('/reports')).data;
    projects.value = (await api.get('/projects')).data;
  } catch (e) {
    console.error('Erreur chargement rapports/projets', e);
  }
};

const createReport = async () => {
  try {
    await api.post('/reports', reportForm.value);
    showModal.value = false;
    reportForm.value = { project_id: '', titre: '', contenu: '' };
    await loadData();
    Swal.fire({ icon: 'success', title: 'Rapport envoyé !', timer: 2000 });
  } catch (e) {
    Swal.fire({ icon: 'error', title: 'Erreur', text: e.response?.data?.message || 'Erreur' });
  }
};

onMounted(loadData);
</script>

<template>
  <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <div class="flex justify-between items-center mb-4">
      <h3 class="font-bold text-xl text-primary">Mes Rapports</h3>
      <button @click="showModal = true" class="bg-primary-light text-white px-4 py-2 rounded hover:bg-primary transition">
        <i class="fas fa-plus mr-2"></i> Créer un rapport
      </button>
    </div>

    <div v-if="reports.length === 0" class="text-gray-400 text-center py-4">Aucun rapport envoyé.</div>
    <div v-for="r in reports" :key="r.id" class="border-b border-gray-100 py-3 flex justify-between items-center">
      <div>
        <h4 class="font-bold text-gray-800">{{ r.titre }}</h4>
        <p class="text-sm text-gray-600">{{ r.contenu }}</p>
        <p class="text-xs text-gray-400 mt-1">Projet : {{ r.project?.nom }} - {{ new Date(r.date_rapport).toLocaleDateString() }}</p>
      </div>
      <router-link :to="`/dashboard/chef-projet/reports/${r.id}`" class="text-primary-light hover:text-primary text-sm font-semibold">
        <i class="fas fa-eye"></i> Détail
      </router-link>
    </div>

    <!-- MODALE CRÉER RAPPORT -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="showModal = false">
      <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6">
        <h3 class="text-xl font-bold text-gray-800 mb-4">Envoyer un rapport</h3>
        <form @submit.prevent="createReport" class="space-y-3">
          <select v-model="reportForm.project_id" class="w-full border rounded-lg px-3 py-2" required>
            <option disabled value="">Sélectionner un projet</option>
            <option v-for="p in projects" :key="p.id" :value="p.id">{{ p.nom }}</option>
          </select>
          <input type="text" v-model="reportForm.titre" placeholder="Titre du rapport" class="w-full border rounded-lg px-3 py-2" required>
          <textarea v-model="reportForm.contenu" placeholder="Contenu du rapport" class="w-full border rounded-lg px-3 py-2" rows="4" required></textarea>
          <div class="flex gap-3 mt-4">
            <button type="button" @click="showModal = false" class="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg">Annuler</button>
            <button type="submit" class="flex-1 py-2 bg-primary-light text-white rounded-lg">Envoyer à l'Admin</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>