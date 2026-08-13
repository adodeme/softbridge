<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '@/api/axios';
import LoadingSpinner from '@/components/LoadingSpinner.vue';

const invoices = ref([]);
const activeTab = ref('devis');
const isLoading = ref(true);

onMounted(async () => {
  try {
    invoices.value = (await api.get('/invoices')).data;
  } catch (error) {
    console.error('Erreur lors du chargement des factures', error);
  } finally {
    isLoading.value = false;
  }
});

const filteredInvoices = computed(() => {
  return invoices.value.filter(inv => inv.type === activeTab.value);
});
</script>

<template>
  <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <h3 class="font-bold text-xl text-primary mb-4">Mes Factures</h3>

    <LoadingSpinner v-if="isLoading" />

    <template v-else>
      <div class="flex border-b border-gray-200 mb-6">
        <button @click="activeTab = 'devis'" :class="['px-4 py-2 font-medium text-sm transition-colors', activeTab === 'devis' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700']">
          Factures Devis
        </button>
        <button @click="activeTab = 'abonnement'" :class="['px-4 py-2 font-medium text-sm transition-colors', activeTab === 'abonnement' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700']">
          Factures Abonnements
        </button>
      </div>

      <div v-if="filteredInvoices.length === 0" class="text-gray-400 text-center py-4">Aucune facture dans cette catégorie.</div>

      <div v-else class="space-y-4">
        <div v-for="inv in filteredInvoices" :key="inv.id" class="border-b border-gray-100 py-4 flex justify-between items-center">
          <div>
            <p class="font-medium text-gray-800">{{ inv.numero }}</p>
            <p class="text-sm text-gray-500">{{ inv.montant.toLocaleString() }} FCFA</p>
            <div class="mt-1 text-xs text-gray-400 flex gap-3">
              <span>Type : {{ inv.type === 'devis' ? 'Devis' : 'Abonnement' }}</span>
              <span>Statut : 
                <span :class="{'text-red-600 font-bold': inv.statut === 'impaye', 'text-green-600 font-bold': inv.statut === 'paye'}">
                  {{ inv.statut.toUpperCase() }}
                </span>
              </span>
            </div>
          </div>
          <div class="flex gap-2">
            <span v-if="inv.type === 'abonnement' && inv.statut === 'paye'" class="text-primary font-mono text-sm cursor-pointer" title="Cliquez pour voir la clé">
              ****** <i class="fas fa-eye ml-1 text-gray-400 text-xs"></i>
            </span>
            <router-link :to="`/dashboard/client/invoices/${inv.id}`" class="text-primary-light hover:text-primary text-sm font-semibold">Détails</router-link>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>