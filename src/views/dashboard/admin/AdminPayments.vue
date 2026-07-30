<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '@/api/axios';

// Liste de toutes les factures récupérées depuis l'API
const invoices = ref([]);

// Chargement des factures au montage du composant
onMounted(async () => {
  try {
    const response = await api.get('/invoices');
    // Sécurité : on s'assure que la réponse est bien un tableau
    invoices.value = Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Erreur lors du chargement des paiements', error);
  }
});

// Filtrer uniquement les factures ayant le statut "paye"
const paidInvoices = computed(() => {
  return invoices.value.filter((inv) => inv.statut === 'paye');
});

// Calculer le chiffre d'affaires total
const totalRevenue = computed(() => {
  return paidInvoices.value.reduce((sum, inv) => sum + inv.montant, 0);
});
</script>

<template>
  <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    
    <!-- Titre de la section -->
    <h3 class="font-bold text-xl text-primary mb-4">
      Paiements et Chiffre d'affaires
    </h3>

    <!-- État vide (aucune facture payée) -->
    <div v-if="paidInvoices.length === 0" class="text-gray-400 text-center py-4">
      Aucune facture payée pour le moment.
    </div>

    <!-- Liste des factures payées -->
    <div v-else>
      <div 
        v-for="inv in paidInvoices" 
        :key="inv.id" 
        class="border-b border-gray-100 py-3 flex justify-between items-center"
      >
        <!-- Informations du client et numéro de facture -->
        <div>
          <p class="font-medium text-gray-800">
            {{ inv.client?.nom_entreprise || 'Client inconnu' }}
          </p>
          <p class="text-sm text-gray-500">
            {{ inv.numero }}
          </p>
        </div>
        
        <!-- Montant de la facture -->
        <p class="font-bold text-green-600">
          {{ inv.montant.toLocaleString() }} FCFA
        </p>
      </div>

      <!-- Chiffre d'affaires total -->
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