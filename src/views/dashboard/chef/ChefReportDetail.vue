<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api/axios';
import Swal from 'sweetalert2';

const route = useRoute();
const router = useRouter();
const report = ref(null);
const isLoading = ref(true);
const isEditing = ref(false);

// Formulaire d'édition
const editForm = ref({
  titre: '',
  contenu: ''
});

const loadReport = async () => {
  try {
    const res = await api.get(`/reports/${route.params.id}`);
    report.value = res.data;
    editForm.value.titre = report.value.titre;
    editForm.value.contenu = report.value.contenu;
  } catch (e) {
    console.error(e);
  } finally {
    isLoading.value = false;
  }
};

const startEditing = () => {
  editForm.value.titre = report.value.titre;
  editForm.value.contenu = report.value.contenu;
  isEditing.value = true;
};

const cancelEditing = () => {
  isEditing.value = false;
};

const saveReport = async () => {
  try {
    await api.put(`/reports/${report.value.id}`, {
      titre: editForm.value.titre,
      contenu: editForm.value.contenu
    });
    isEditing.value = false;
    await loadReport();
    Swal.fire({ icon: 'success', title: 'Rapport modifié !', timer: 2000 });
  } catch (e) {
    Swal.fire('Erreur', 'Impossible de modifier le rapport.', 'error');
  }
};

onMounted(loadReport);
</script>

<template>
  <div class="max-w-2xl mx-auto py-8 px-4">
    <div v-if="isLoading" class="text-center py-10 text-gray-500">Chargement...</div>
    <div v-else-if="report" class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 class="text-2xl font-bold text-primary mb-4">Détails du rapport</h2>
        
        <!-- Mode visualisation -->
        <div v-if="!isEditing" class="space-y-3 text-gray-700">
            <p><span class="font-bold">Projet :</span> {{ report.project?.nom }}</p>
            <p><span class="font-bold">Titre :</span> {{ report.titre }}</p>
            <p><span class="font-bold">Contenu :</span> {{ report.contenu }}</p>
            <p><span class="font-bold">Date :</span> {{ new Date(report.date_rapport).toLocaleDateString() }}</p>
        </div>

        <!-- Mode édition -->
        <div v-else class="space-y-4">
            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Titre</label>
                <input v-model="editForm.titre" type="text" class="w-full border rounded-lg px-3 py-2" required>
            </div>
            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Contenu</label>
                <textarea v-model="editForm.contenu" rows="5" class="w-full border rounded-lg px-3 py-2" required></textarea>
            </div>
        </div>

        <!-- Boutons d'action -->
        <div class="mt-6 flex flex-col sm:flex-row gap-3">
            <template v-if="!isEditing">
                <button @click="startEditing" class="flex-1 bg-yellow-500 text-white py-3 rounded-xl font-bold hover:bg-yellow-600 transition">
                    <i class="fas fa-pen mr-2"></i> Modifier
                </button>
                <button @click="router.push('/dashboard/chef-projet/reports')" class="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300 transition">
                    Retour
                </button>
            </template>
            <template v-else>
                <button @click="saveReport" class="flex-1 bg-green-500 text-white py-3 rounded-xl font-bold hover:bg-green-600 transition">
                    <i class="fas fa-save mr-2"></i> Enregistrer
                </button>
                <button @click="cancelEditing" class="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300 transition">
                    Annuler
                </button>
            </template>
        </div>
    </div>
  </div>
</template>