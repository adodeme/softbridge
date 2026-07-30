<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api/axios';
import Swal from 'sweetalert2';

const projects = ref([]);

const loadProjects = async () => {
  try {
    const res = await api.get('/projects');
    projects.value = res.data;
  } catch (e) {
    console.error('Erreur chargement projets', e);
  }
};

const markAsCompleted = async (project) => {
  const result = await Swal.fire({
    title: 'Terminer ce projet ?',
    text: `Le projet "${project.nom}" sera marqué comme terminé.`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#1572E8',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Oui, terminer',
    cancelButtonText: 'Annuler'
  });
  if (!result.isConfirmed) return;

  try {
    await api.put(`/projects/${project.id}`, { statut: 'termine' });
    // Recharge toute la liste pour refléter le changement
    await loadProjects();
    Swal.fire({ icon: 'success', title: 'Projet terminé !', timer: 2000 });
  } catch (e) {
    Swal.fire('Erreur', "Impossible de terminer le projet.", 'error');
  }
};

onMounted(loadProjects);
</script>

<template>
  <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <div class="flex items-center gap-2 mb-6">
      <i class="fas fa-code-branch text-2xl text-primary-light"></i>
      <h3 class="text-2xl font-bold text-primary">Mes Projets</h3>
    </div>

    <div v-if="projects.length === 0" class="text-center py-12 text-gray-400">
      <i class="fas fa-folder-open text-5xl mb-3 block text-gray-300"></i>
      <p>Aucun projet pour le moment.</p>
    </div>

    <div class="space-y-4">
      <div v-for="project in projects" :key="project.id"
           class="bg-gray-50 rounded-lg p-5 border border-gray-200 hover:border-primary-light transition-colors duration-200">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <h4 class="text-lg font-bold text-gray-800">{{ project.nom }}</h4>
              <span class="px-3 py-1 text-xs font-bold rounded-full"
                    :class="{
                      'bg-blue-100 text-blue-700': project.statut === 'en_cours',
                      'bg-green-100 text-green-700': project.statut === 'termine'
                    }">
                {{ project.statut.toUpperCase() }}
              </span>
            </div>
            <div v-if="project.quote" class="text-sm text-gray-600 mt-1">
              <p><span class="font-semibold">Devis #{{ project.quote.id }}</span> – {{ project.quote.besoins }}</p>
              <p class="text-xs text-gray-500 mt-1">
                Montant : <span class="font-bold text-primary">{{ project.quote.montant.toLocaleString() }} FCFA</span>
              </p>
            </div>
            <p v-else class="text-sm text-gray-400 italic">Aucun devis associé.</p>
          </div>
          <div class="flex items-center gap-2 self-end sm:self-center">
            <router-link :to="'/dashboard/chef-projet/projects/' + project.id"
                         class="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-primary bg-primary/5 rounded-lg hover:bg-primary/10 transition">
              <i class="fas fa-eye"></i> Détail
            </router-link>
            <button v-if="project.statut === 'en_cours'"
                    @click="markAsCompleted(project)"
                    class="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition">
              <i class="fas fa-check-circle"></i> Terminer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>