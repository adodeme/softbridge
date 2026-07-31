<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '@/api/axios';

const invoices = ref([]);

onMounted(async () => {
  try {
    const response = await api.get('/invoices/all');
    invoices.value = Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Erreur lors du chargement des paiements', error);
  }
});

const paidInvoices = computed(() => {
  return invoices.value.filter((inv) => inv.statut === 'paye');
});

// CORRECTION : conversion en nombre avec Number()
const totalRevenue = computed(() => {
  return paidInvoices.value.reduce((sum, inv) => sum + Number(inv.montant), 0);
});
</script>

<template>
  <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <h3 class="font-bold text-xl text-primary mb-4">
      Paiements et Chiffre d'affaires
    </h3>

    <div v-if="paidInvoices.length === 0" class="text-gray-400 text-center py-4">
      Aucune facture payée pour le moment.
    </div>

    <div v-else>
      <div 
        v-for="inv in paidInvoices" 
        :key="inv.id" 
        class="border-b border-gray-100 py-3 flex justify-between items-center"
      >
        <div>
          <p class="font-medium text-gray-800">
            {{ inv.client?.nom_entreprise || 'Client inconnu' }}
          </p>
          <p class="text-sm text-gray-500">
            {{ inv.numero }}
          </p>
        </div>
        <p class="font-bold text-green-600">
          {{ inv.montant.toLocaleString() }} FCFA
        </p>
      </div>

      <div class="mt-4 p-4 bg-gray-50 rounded-lg text-right border border-gray-200">
        <p class="font-bold text-xl text-gray-800">
          Chiffre d'affaires total : 
          <span class="text-primary font-bold">
            {{ totalRevenue.toLocaleString() }} FCFA
          </span>
        </p>
      </div>
    </div>
  </div>
</template>