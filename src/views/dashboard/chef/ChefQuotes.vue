<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/api/axios';
import Swal from 'sweetalert2';

const router = useRouter();

const quotes = ref([]);
const clients = ref([]);
const showModal = ref(false);
const errorMessage = ref('');

const newQuote = ref({ client_id: '', besoins: '', fonctionnalites: [], montant: 0 });
const currentFonctionnalite = ref('');

const loadData = async () => {
    try {
        const quotesRes = await api.get('/quotes');
        quotes.value = quotesRes.data;

        const clientsRes = await api.get('/clients');
        if (Array.isArray(clientsRes.data)) {
            clients.value = clientsRes.data;
        } else {
            clients.value = [];
            errorMessage.value = 'Format de données invalide pour les clients.';
        }
    } catch (e) {
        errorMessage.value = 'Erreur de chargement des données.';
    }
};

const createQuote = async () => {
    try {
        await api.post('/create-quote', newQuote.value);
        showModal.value = false;
        newQuote.value = { client_id: '', besoins: '', fonctionnalites: [], montant: 0 };
        currentFonctionnalite.value = '';
        await loadData();
        Swal.fire({ icon: 'success', title: 'Devis créé !', timer: 2000 });
    } catch (e) {
        Swal.fire({ icon: 'error', title: 'Erreur', text: e.response?.data?.message || 'Erreur lors de la création' });
    }
};

const sendQuote = async (id) => {
    const result = await Swal.fire({
        title: 'Envoyer ce devis ?',
        text: 'Le client recevra une notification.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#1572E8',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Oui, envoyer',
        cancelButtonText: 'Annuler'
    });
    if (result.isConfirmed) {
        await api.post(`/quotes/${id}/send`);
        await loadData();
        Swal.fire({ icon: 'success', title: 'Devis envoyé !', timer: 2000 });
    }
};

const convertQuote = async (id) => {
    const result = await Swal.fire({
        title: 'Convertir ce devis en projet et facture ?',
        text: 'Cette action est irréversible.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#1572E8',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Oui, convertir',
        cancelButtonText: 'Annuler'
    });
    if (result.isConfirmed) {
        await api.post(`/quotes/${id}/convert`);
        await loadData();
        Swal.fire({ icon: 'success', title: 'Conversion réussie !', text: 'Le projet et la facture ont été créés.' });
    }
};

onMounted(loadData);
</script>

<template>
  <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div class="flex items-center gap-2">
        <i class="fas fa-file-invoice text-2xl text-primary-light"></i>
        <h2 class="text-2xl font-bold text-primary">Gestion des Devis</h2>
      </div>
      <button @click="showModal = true" 
              class="bg-primary text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-light transition shadow-sm flex items-center gap-2">
        <i class="fas fa-plus"></i> Créer un devis
      </button>
    </div>

    <div v-if="errorMessage" class="bg-red-50 text-red-600 p-4 rounded-lg mb-4 border border-red-200">
      <i class="fas fa-exclamation-circle mr-2"></i> {{ errorMessage }}
    </div>

    <div v-if="quotes.length === 0" class="text-center py-12 text-gray-400">
      <i class="fas fa-file-circle-xmark text-5xl mb-3 block text-gray-300"></i>
      <p>Aucun devis pour le moment.</p>
    </div>

    <div class="space-y-4">
      <div v-for="quote in quotes" :key="quote.id"
           class="bg-gray-50 rounded-lg p-5 border border-gray-200 hover:border-primary-light transition-colors duration-200">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <span class="text-xs font-semibold text-gray-500 bg-white px-3 py-1 rounded-full border">
                #{{ quote.id }}
              </span>
              <span class="px-3 py-1 text-xs font-bold rounded-full"
                    :class="{
                      'bg-gray-100 text-gray-600': quote.statut === 'en_attente',
                      'bg-yellow-100 text-yellow-700': quote.statut === 'envoye',
                      'bg-green-100 text-green-700': quote.statut === 'valide',
                      'bg-red-100 text-red-700': quote.statut === 'refuse',
                      'bg-purple-100 text-purple-700': quote.statut === 'termine'
                    }">
                {{ quote.statut.toUpperCase() }}
              </span>
              <span class="text-sm text-gray-500 ml-auto">
                {{ quote.client?.nom_entreprise || 'Client inconnu' }}
              </span>
            </div>
            <h4 class="text-xl font-bold text-gray-800">
              {{ quote.montant ? quote.montant.toLocaleString() : 0 }} FCFA
            </h4>
            <p class="text-sm text-gray-500 mt-1 line-clamp-2">{{ quote.besoins }}</p>
            <div class="flex flex-wrap gap-1 mt-3">
              <span v-for="f in quote.fonctionnalites" :key="f"
                    class="inline-block bg-blue-50 text-primary-light text-xs px-2 py-1 rounded-full">
                {{ f }}
              </span>
            </div>
          </div>
          <div class="flex items-center gap-2 self-end lg:self-center">
            <router-link :to="`/dashboard/chef-projet/quotes/${quote.id}`"
                         class="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-primary bg-primary/5 rounded-lg hover:bg-primary/10 transition">
              <i class="fas fa-eye"></i> Détails
            </router-link>
            <button v-if="quote.statut === 'en_attente'"
                    @click="sendQuote(quote.id)"
                    class="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-primary-light bg-blue-50 rounded-lg hover:bg-blue-100 transition">
              <i class="fas fa-paper-plane"></i> Envoyer
            </button>
            <button v-else-if="quote.statut === 'valide'"
                    @click="convertQuote(quote.id)"
                    class="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition">
              <i class="fas fa-code-branch"></i> Convertir
            </button>
            <span v-else class="text-gray-400 text-sm italic px-3 py-2">Terminé</span>
          </div>
        </div>
      </div>
    </div>

    <!-- MODALE CRÉER DEVIS (inchangée) -->
    <div v-if="showModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="showModal = false">
      <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6">
        <h3 class="text-xl font-bold text-gray-800 mb-4">Créer un nouveau devis</h3>
        <div v-if="clients.length === 0" class="bg-yellow-50 text-yellow-700 p-3 rounded-lg mb-4 border border-yellow-200">
          <i class="fas fa-exclamation-triangle mr-2"></i> Aucun client disponible.
        </div>
        <form @submit.prevent="createQuote" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Client</label>
            <select v-model="newQuote.client_id" class="w-full border rounded-lg px-3 py-2" required :disabled="clients.length === 0">
              <option disabled value="">Sélectionner un client</option>
              <option v-for="client in clients" :key="client.id" :value="client.id">
                {{ client.nom_entreprise }} ({{ client.user?.prenom }} {{ client.user?.nom }})
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Besoins</label>
            <textarea v-model="newQuote.besoins" class="w-full border rounded-lg px-3 py-2" rows="2" required></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Fonctionnalités</label>
            <div class="flex gap-2">
              <input type="text" v-model="currentFonctionnalite" class="flex-1 border rounded-lg px-3 py-2" placeholder="Ex: Panier...">
              <button type="button" @click="newQuote.fonctionnalites.push(currentFonctionnalite); currentFonctionnalite = ''" 
                      class="bg-gray-100 px-4 rounded-lg hover:bg-gray-200 transition">
                <i class="fas fa-plus"></i>
              </button>
            </div>
            <div class="flex flex-wrap gap-2 mt-2">
              <span v-for="(item, index) in newQuote.fonctionnalites" :key="index" 
                    class="bg-blue-50 text-primary-light text-xs px-2 py-1 rounded-full flex items-center">
                {{ item }}
                <i @click="newQuote.fonctionnalites.splice(index, 1)" 
                   class="fas fa-times ml-2 cursor-pointer hover:text-red-500"></i>
              </span>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Montant (FCFA)</label>
            <input type="number" v-model="newQuote.montant" class="w-full border rounded-lg px-3 py-2" min="0" step="1000" required>
          </div>
          <div class="flex gap-3 mt-6 pt-4 border-t border-gray-100">
            <button type="button" @click="showModal = false" class="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg">Annuler</button>
            <button type="submit" class="flex-1 py-2 bg-primary-light text-white rounded-lg" :disabled="clients.length === 0">Enregistrer</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>