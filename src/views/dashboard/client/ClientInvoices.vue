<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '@/api/axios';

const invoices = ref([]);
const activeTab = ref('devis');

onMounted(async () => {
  try {
    invoices.value = (await api.get('/invoices')).data;
  } catch (error) {
    console.error('Erreur lors du chargement des factures', error);
  }
});

// Filtrer les factures selon l'onglet actif
const filteredInvoices = computed(() => {
  return invoices.value.filter(inv => inv.type === activeTab.value);
});
</script>

<template>
  <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <div class="flex items-center gap-2 mb-6">
      <i class="fas fa-receipt text-2xl text-primary-light"></i>
      <h3 class="text-2xl font-bold text-primary">Mes Factures</h3>
    </div>
    
    <!-- Onglets Devis / Abonnement -->
    <div class="flex border-b border-gray-200 mb-6">
      <button 
        @click="activeTab = 'devis'" 
        :class="[
          'px-4 py-2 font-medium text-sm transition-colors border-b-2',
          activeTab === 'devis' 
            ? 'border-primary text-primary' 
            : 'border-transparent text-gray-500 hover:text-gray-700'
        ]"
      >
        <i class="fas fa-file-invoice mr-2"></i> Factures Devis
      </button>
      <button 
        @click="activeTab = 'abonnement'" 
        :class="[
          'px-4 py-2 font-medium text-sm transition-colors border-b-2',
          activeTab === 'abonnement' 
            ? 'border-primary text-primary' 
            : 'border-transparent text-gray-500 hover:text-gray-700'
        ]"
      >
        <i class="fas fa-cubes mr-2"></i> Factures Abonnements
      </button>
    </div>

    <!-- Liste filtrée -->
    <div v-if="filteredInvoices.length === 0" class="text-center py-12 text-gray-400">
      <i class="fas fa-file-circle-xmark text-5xl mb-3 block text-gray-300"></i>
      <p>Aucune facture dans cette catégorie.</p>
    </div>

    <div v-else class="space-y-4">
      <div v-for="inv in filteredInvoices" :key="inv.id"
           class="bg-gray-50 rounded-lg p-5 border border-gray-200 hover:border-primary-light transition-colors duration-200">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <!-- Informations principales -->
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <span class="text-xs font-semibold text-gray-500 bg-white px-3 py-1 rounded-full border">
                {{ inv.numero }}
              </span>
              <span class="px-3 py-1 text-xs font-bold rounded-full"
                    :class="{
                      'bg-red-100 text-red-700': inv.statut === 'impaye',
                      'bg-green-100 text-green-700': inv.statut === 'paye'
                    }">
                {{ inv.statut.toUpperCase() }}
              </span>
            </div>
            <h4 class="text-lg font-bold text-gray-800">
              {{ inv.montant.toLocaleString() }} FCFA
            </h4>
            <p class="text-sm text-gray-500 mt-1">
              {{ inv.type === 'devis' ? 'Projet sur mesure' : 'Abonnement logiciel' }}
            </p>
          </div>

          <!-- Clé d'accès pour les abonnements payés -->
          <div class="flex items-center gap-2">
            <span v-if="inv.type === 'abonnement' && inv.statut === 'paye'" 
                  class="text-primary font-mono text-sm bg-white px-3 py-1 rounded border">
              ******
            </span>
            <!-- Bouton Détail -->
            <router-link :to="`/dashboard/client/invoices/${inv.id}`" 
                         class="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-primary bg-primary/5 rounded-lg hover:bg-primary/10 transition">
              <i class="fas fa-eye"></i> Détail
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>