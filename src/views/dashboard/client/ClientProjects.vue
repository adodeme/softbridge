<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api/axios';
import LoadingSpinner from '@/components/LoadingSpinner.vue';

const projects = ref([]);
const isLoading = ref(true);

onMounted(async () => {
  try {
    projects.value = (await api.get('/projects')).data;
  } catch (e) {
    console.error(e);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <h3 class="font-bold text-xl text-primary mb-6">Mes Projets</h3>

    <LoadingSpinner v-if="isLoading" />

    <div v-else-if="projects.length === 0" class="text-gray-400 text-center py-4">Aucun projet en cours.</div>

    <div v-else class="space-y-4">
      <div v-for="project in projects" :key="project.id" class="border-b border-gray-100 py-4 flex justify-between items-center">
        <div>
          <h4 class="font-bold text-gray-800">{{ project.nom }}</h4>
          <p class="text-sm text-gray-500">Devis : {{ project.quote?.id }}</p>
          <span class="px-2 py-1 text-xs font-bold rounded-full"
                :class="{'bg-blue-100 text-blue-700': project.statut === 'en_cours', 'bg-green-100 text-green-700': project.statut === 'termine'}">
            {{ project.statut.toUpperCase() }}
          </span>
        </div>
        <router-link :to="'/dashboard/client/projects/' + project.id" class="text-primary-light hover:text-primary text-sm font-semibold">
          <i class="fas fa-eye"></i> Détail
        </router-link>
      </div>
    </div>
  </div>
</template>