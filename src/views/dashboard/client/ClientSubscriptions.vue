<script setup>
import { ref, onMounted } from 'vue'; import api from '@/api/axios';
const subscriptions = ref([]);
onMounted(async () => { subscriptions.value = (await api.get('/subscriptions')).data; });
</script>
<template>
  <div class="bg-white p-6 rounded-xl shadow-sm">
    <h2 class="font-bold text-xl mb-4 text-primary">Mes Abonnements</h2>
    <div v-for="sub in subscriptions" :key="sub.id" class="border rounded-lg p-4 mb-3 flex justify-between items-center bg-gray-50">
      <div><h5 class="font-bold">{{ sub.license?.software?.nom }}</h5><p class="text-xs">Expire le : {{ new Date(sub.date_fin).toLocaleDateString() }}</p></div>
      <span class="px-2 py-1 text-xs font-bold rounded-full bg-green-100 text-green-700">{{ sub.statut.toUpperCase() }}</span>
    </div>
  </div>
</template>