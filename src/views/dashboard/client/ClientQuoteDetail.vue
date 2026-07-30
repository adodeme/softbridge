<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api/axios';

const route = useRoute();
const router = useRouter();
const quote = ref(null);
const isLoading = ref(true);

onMounted(async () => {
  try {
    const res = await api.get(`/quotes/${route.params.id}`);
    quote.value = res.data;
  } catch (e) {
    console.error(e);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="max-w-2xl mx-auto py-8 px-4">
    <div v-if="isLoading" class="text-center py-10 text-gray-500">Chargement...</div>
    <div v-else-if="quote" class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 class="text-2xl font-bold text-primary mb-4">Devis #{{ quote.id }}</h2>
      <div class="space-y-3 text-gray-700">
        <p><span class="font-bold">Besoins :</span> {{ quote.besoins }}</p>
        <p><span class="font-bold">Fonctionnalités :</span></p>
        <ul class="list-disc pl-5">
          <li v-for="f in quote.fonctionnalites" :key="f">{{ f }}</li>
        </ul>
        <p><span class="font-bold">Montant :</span> {{ quote.montant.toLocaleString() }} FCFA</p>
        <p><span class="font-bold">Statut :</span>
          <span class="px-2 py-1 text-xs font-bold rounded-full"
                :class="{
                  'bg-yellow-100 text-yellow-700': quote.statut === 'envoye',
                  'bg-green-100 text-green-700': quote.statut === 'valide',
                  'bg-red-100 text-red-700': quote.statut === 'refuse',
                  'bg-gray-100 text-gray-600': quote.statut === 'en_attente'
                }">
            {{ quote.statut.toUpperCase() }}
          </span>
        </p>
      </div>
      <button @click="router.push('/dashboard/client/quotes')"
              class="mt-6 w-full bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300 transition">
        Retour
      </button>
    </div>
  </div>
</template>