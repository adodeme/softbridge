<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api/axios';

// Liste des factures récupérées depuis l'API
const invoices = ref([]);

// Chargement des factures au montage du composant
onMounted(async () => {
  try {
    const response = await api.get('/invoices/all');  // ← au lieu de /invoices
    invoices.value = response.data;
  } catch (error) {
    console.error('Erreur lors du chargement des factures', error);
  }
});
</script>

<template>
  <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[400px]">
    
    <!-- Titre de la section -->
    <h3 class="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
      <i class="fas fa-receipt text-primary-light"></i>
      Toutes les factures
    </h3>

    <!-- État vide (aucune facture) -->
    <div v-if="invoices.length === 0" class="text-gray-400 text-center py-10 flex flex-col items-center gap-2">
      <i class="fas fa-inbox text-5xl text-gray-300"></i>
      <p>Aucune facture n'a été générée pour le moment.</p>
    </div>

    <!-- Tableau des factures -->
    <div v-else class="overflow-x-auto border border-gray-200 rounded-lg">
      <table class="w-full text-sm text-left">
        <thead class="bg-gray-50 text-gray-600 border-b border-gray-200">
          <tr>
            <th class="px-6 py-3">Numéro de facture</th>
            <th class="px-6 py-3">Client</th>
            <th class="px-6 py-3">Montant</th>
            <th class="px-6 py-3">Statut</th>
            <th class="px-6 py-3">Type</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="inv in invoices" :key="inv.id" class="hover:bg-gray-50 transition-colors">
            <!-- Numéro -->
            <td class="px-6 py-4 font-medium text-gray-800">
              {{ inv.numero }}
            </td>
            
            <!-- Client -->
            <td class="px-6 py-4 text-gray-600">
              {{ inv.client?.nom_entreprise || 'Client inconnu' }}
            </td>
            
            <!-- Montant -->
            <td class="px-6 py-4 font-bold text-primary">
              {{ inv.montant.toLocaleString() }} FCFA
            </td>
            
            <!-- Statut -->
            <td class="px-6 py-4">
              <span 
                class="px-3 py-1 text-xs font-bold rounded-full inline-block"
                :class="{
                  'bg-red-100 text-red-700': inv.statut === 'impaye',
                  'bg-green-100 text-green-700': inv.statut === 'paye'
                }"
              >
                {{ inv.statut.toUpperCase() }}
              </span>
            </td>
            
            <!-- Type -->
            <td class="px-6 py-4 text-gray-500">
              {{ inv.type === 'devis' ? 'Devis' : 'Abonnement' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>