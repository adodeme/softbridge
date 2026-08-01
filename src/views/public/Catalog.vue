<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api/axios';

const softwares = ref([]);

onMounted(async () => {
  try {
    const response = await api.get('/catalog');
    softwares.value = response.data;
  } catch (error) {
    console.error('Erreur lors du chargement du catalogue', error);
  }
});
</script>

<template>
  <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <h2 class="text-3xl font-bold text-center text-primary mb-10">
      Catalogue des logiciels SoftBridge
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="sw in softwares" 
        :key="sw.id" 
        class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300 flex flex-col"
      >
        <div v-if="sw.capture" class="mb-4">
          <img 
            :src="'http://localhost:8000/storage/' + sw.capture" 
            :alt="sw.nom" 
            class="w-full h-48 object-cover rounded-lg shadow-sm"
          />
        </div>
        <div v-else class="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-4 text-gray-400">
          <i class="fas fa-image text-4xl"></i>
        </div>

        <h3 class="font-bold text-xl text-gray-800 mb-2">{{ sw.nom }}</h3>
        <p class="text-sm text-gray-500 mb-4 grow">{{ sw.description }}</p>
        
        <router-link 
          :to="'/catalog/' + sw.id" 
          class="block text-center bg-primary-light text-white py-2 rounded-lg font-semibold hover:bg-primary transition-colors"
        >
          Voir les abonnements
        </router-link>
      </div>
    </div>
  </div>
</template>