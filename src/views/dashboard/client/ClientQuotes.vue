<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/api/axios';
import Swal from 'sweetalert2';
import LoadingSpinner from '@/components/LoadingSpinner.vue';

const router = useRouter();
const quotes = ref([]);
const isLoading = ref(true);

const loadQuotes = async () => {
  try {
    const res = await api.get('/quotes');
    quotes.value = res.data;
  } catch (e) {
    console.error(e);
  } finally {
    isLoading.value = false;
  }
};

const validateQuote = async (id) => {
  const confirm = await Swal.fire({
    title: 'Valider ce devis ?',
    text: 'Le projet sera créé après validation.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Oui, valider',
    cancelButtonText: 'Annuler'
  });
  if (!confirm.isConfirmed) return;

  try {
    await api.post(`/quotes/${id}/validate`);
    Swal.fire({ icon: 'success', title: 'Devis validé !' });
    loadQuotes();
  } catch (e) {
    Swal.fire('Erreur', e.response?.data?.error || 'Impossible de valider.', 'error');
  }
};

const rejectQuote = async (id) => {
  const { value: reason } = await Swal.fire({
    title: 'Motif du refus (optionnel)',
    input: 'text',
    inputPlaceholder: 'Ex : Trop cher, ne correspond pas...',
    showCancelButton: true,
    confirmButtonText: 'Refuser',
    cancelButtonText: 'Annuler'
  });
  if (reason === undefined) return;

  try {
    await api.post(`/quotes/${id}/reject`, { motif: reason || '' });
    Swal.fire({ icon: 'info', title: 'Devis refusé' });
    loadQuotes();
  } catch (e) {
    Swal.fire('Erreur', e.response?.data?.error || 'Impossible de refuser.', 'error');
  }
};

onMounted(loadQuotes);
</script>

<template>
  <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <h3 class="font-bold text-xl text-primary mb-6">Mes Devis</h3>

    <LoadingSpinner v-if="isLoading" />

    <div v-else-if="quotes.length === 0" class="text-gray-400 text-center py-4">Aucun devis reçu.</div>

    <div v-else class="space-y-4">
      <div v-for="quote in quotes" :key="quote.id" class="border-b border-gray-100 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p class="font-medium text-gray-800">Devis #{{ quote.id }}</p>
          <p class="text-sm text-gray-500">Montant : {{ quote.montant.toLocaleString() }} FCFA</p>
          <span class="px-2 py-1 text-xs font-bold rounded-full"
                :class="{
                  'bg-yellow-100 text-yellow-700': quote.statut === 'envoye',
                  'bg-green-100 text-green-700': quote.statut === 'valide',
                  'bg-red-100 text-red-700': quote.statut === 'refuse',
                  'bg-gray-100 text-gray-600': quote.statut === 'en_attente'
                }">
            {{ quote.statut.toUpperCase() }}
          </span>
        </div>
        <div class="flex gap-2">
          <router-link :to="'/dashboard/client/quotes/' + quote.id" class="text-primary-light hover:text-primary text-sm font-semibold">
            <i class="fas fa-eye"></i> Détail
          </router-link>
          <button v-if="quote.statut === 'envoye'" @click="validateQuote(quote.id)" class="text-green-600 hover:text-green-800 text-sm font-semibold">
            <i class="fas fa-check-circle"></i> Valider
          </button>
          <button v-if="quote.statut === 'envoye'" @click="rejectQuote(quote.id)" class="text-red-500 hover:text-red-700 text-sm font-semibold">
            <i class="fas fa-times-circle"></i> Refuser
          </button>
        </div>
      </div>
    </div>
  </div>
</template>