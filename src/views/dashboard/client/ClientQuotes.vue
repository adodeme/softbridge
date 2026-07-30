<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/api/axios';
import Swal from 'sweetalert2';

const router = useRouter();
const quotes = ref([]);

const loadQuotes = async () => {
  try {
    const res = await api.get('/quotes');
    quotes.value = res.data;
  } catch (e) {
    console.error(e);
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
    <div class="flex items-center gap-2 mb-6">
      <i class="fas fa-file-invoice text-2xl text-primary-light"></i>
      <h3 class="text-2xl font-bold text-primary">Mes Devis</h3>
    </div>

    <!-- État vide -->
    <div v-if="quotes.length === 0" class="text-center py-12 text-gray-400">
      <i class="fas fa-file-circle-xmark text-5xl mb-3 block text-gray-300"></i>
      <p>Aucun devis reçu pour le moment.</p>
    </div>

    <!-- Liste des devis -->
    <div class="space-y-4">
      <div v-for="quote in quotes" :key="quote.id"
           class="bg-gray-50 rounded-lg p-5 border border-gray-200 hover:border-primary-light transition-colors duration-200">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <!-- Informations principales -->
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <span class="text-xs font-semibold text-gray-500 bg-white px-3 py-1 rounded-full border">
                #{{ quote.id }}
              </span>
              <span class="px-3 py-1 text-xs font-bold rounded-full"
                    :class="{
                      'bg-yellow-100 text-yellow-700': quote.statut === 'envoye',
                      'bg-green-100 text-green-700': quote.statut === 'valide',
                      'bg-red-100 text-red-700': quote.statut === 'refuse',
                      'bg-gray-100 text-gray-600': quote.statut === 'en_attente'
                    }">
                {{ quote.statut.toUpperCase() }}
              </span>
            </div>
            <h4 class="text-lg font-bold text-gray-800">
              {{ quote.montant.toLocaleString() }} FCFA
            </h4>
            <p class="text-sm text-gray-500 mt-1 line-clamp-2" v-if="quote.besoins">
              {{ quote.besoins }}
            </p>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2 self-end sm:self-center">
            <router-link :to="'/dashboard/client/quotes/' + quote.id"
                         class="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-primary bg-primary/5 rounded-lg hover:bg-primary/10 transition">
              <i class="fas fa-eye"></i> Détail
            </router-link>

            <button v-if="quote.statut === 'envoye'"
                    @click="validateQuote(quote.id)"
                    class="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition">
              <i class="fas fa-check-circle"></i> Valider
            </button>

            <button v-if="quote.statut === 'envoye'"
                    @click="rejectQuote(quote.id)"
                    class="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition">
              <i class="fas fa-times-circle"></i> Refuser
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>