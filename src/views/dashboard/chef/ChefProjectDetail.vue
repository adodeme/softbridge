<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api/axios';
import Swal from 'sweetalert2';

const route = useRoute();
const router = useRouter();
const project = ref(null);
const isLoading = ref(true);

const loadProject = async () => {
  try {
    const res = await api.get(`/projects/${route.params.id}`);
    project.value = res.data;
  } catch (e) {
    console.error(e);
  } finally {
    isLoading.value = false;
  }
};

const markAsCompleted = async () => {
  const result = await Swal.fire({
    title: 'Terminer ce projet ?',
    text: 'Le client sera notifié.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#1572E8',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Oui, terminer',
    cancelButtonText: 'Annuler'
  });
  if (!result.isConfirmed) return;

  try {
    await api.put(`/projects/${project.value.id}`, { statut: 'termine' });
    await loadProject(); // Recharge le projet pour mettre à jour le statut local
    Swal.fire({ icon: 'success', title: 'Projet terminé !', timer: 2000 });
  } catch (e) {
    Swal.fire('Erreur', "Impossible de terminer le projet.", 'error');
  }
};

onMounted(loadProject);
</script>

<template>
  <div class="max-w-2xl mx-auto py-8 px-4">
    <div v-if="isLoading" class="text-center py-10 text-gray-500">Chargement...</div>
    <div v-else-if="project" class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 class="text-2xl font-bold text-primary mb-4">Détails du projet</h2>
        
        <div class="space-y-3 text-gray-700">
            <p><span class="font-bold">Nom :</span> {{ project.nom }}</p>
            <p><span class="font-bold">Description :</span> {{ project.description }}</p>
            <p><span class="font-bold">Client :</span> {{ project.client?.nom_entreprise }}</p>
            <p><span class="font-bold">Devis associé :</span> {{ project.quote?.id }} - {{ project.quote?.besoins }}</p>
            <p><span class="font-bold">Statut :</span> 
                <span class="px-2 py-1 text-xs font-bold rounded-full" 
                      :class="{'bg-blue-100 text-blue-700': project.statut === 'en_cours', 'bg-green-100 text-green-700': project.statut === 'termine'}">
                    {{ project.statut.toUpperCase() }}
                </span>
            </p>
        </div>

        <div class="mt-6 flex flex-col sm:flex-row gap-3">
            <button v-if="project.statut === 'en_cours'"
                    @click="markAsCompleted"
                    class="flex-1 bg-green-500 text-white py-3 rounded-xl font-bold hover:bg-green-600 transition">
                <i class="fas fa-check-circle mr-2"></i> Terminer le projet
            </button>
            <button @click="router.push('/dashboard/chef-projet/projects')"
                    class="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300 transition">
                Retour
            </button>
        </div>
    </div>
  </div>
</template>