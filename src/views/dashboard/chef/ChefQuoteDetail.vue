<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api/axios';
import Swal from 'sweetalert2';

const route = useRoute();
const router = useRouter();
const quote = ref(null);
const isLoading = ref(true);

const loadQuote = async () => {
    try {
        const res = await api.get(`/quotes/${route.params.id}`);
        quote.value = res.data;
    } catch (e) {
        console.error(e);
    } finally {
        isLoading.value = false;
    }
};

// Envoyer le devis
const sendQuote = async () => {
    if (confirm('Envoyer ce devis au client ?')) {
        await api.post(`/quotes/${quote.value.id}/send`);
        await loadQuote();
        Swal.fire({ icon: 'success', title: 'Devis envoyé !' });
    }
};

// Convertir le devis en projet et facture
const convertQuote = async () => {
    if (confirm('Convertir ce devis valide en projet et facture ?')) {
        await api.post(`/quotes/${quote.value.id}/convert`);
        await loadQuote();
        Swal.fire({ icon: 'success', title: 'Conversion réussie !', text: 'Le projet et la facture ont été créés.' });
    }
};

onMounted(loadQuote);
</script>

<template>
  <div class="max-w-2xl mx-auto py-8 px-4">
    <div v-if="isLoading" class="text-center py-10 text-gray-500">Chargement...</div>
    <div v-else-if="quote" class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 class="text-2xl font-bold text-primary mb-4">Détails du devis #{{ quote.id }}</h2>
        
        <div class="space-y-3 text-gray-700">
            <p><span class="font-bold">Client :</span> {{ quote.client?.nom_entreprise }}</p>
            <p><span class="font-bold">Besoins :</span> {{ quote.besoins }}</p>
            <p><span class="font-bold">Fonctionnalités :</span> 
                <span v-for="f in quote.fonctionnalites" :key="f" class="inline-block bg-blue-50 text-primary-light text-xs px-2 py-1 rounded-full mr-1">{{ f }}</span>
            </p>
            <p><span class="font-bold">Montant :</span> {{ quote.montant.toLocaleString() }} FCFA</p>
            <p><span class="font-bold">Statut :</span> 
                <span class="px-2 py-1 text-xs font-bold rounded-full" 
                      :class="{'bg-gray-100 text-gray-600': quote.statut === 'en_attente', 'bg-yellow-100 text-yellow-700': quote.statut === 'envoye', 'bg-green-100 text-green-700': quote.statut === 'valide'}">
                    {{ quote.statut.toUpperCase() }}
                </span>
            </p>
        </div>

        <div class="mt-6 flex flex-col sm:flex-row gap-3">
            <button v-if="quote.statut === 'en_attente'" @click="sendQuote" class="flex-1 bg-primary-light text-white py-3 rounded-xl font-bold hover:bg-primary transition">
                <i class="fas fa-paper-plane mr-2"></i> Envoyer au client
            </button>
            <button v-else-if="quote.statut === 'valide'" @click="convertQuote" class="flex-1 bg-green-500 text-white py-3 rounded-xl font-bold hover:bg-green-600 transition">
                <i class="fas fa-code-branch mr-2"></i> Convertir en projet
            </button>
            <button @click="router.push('/dashboard/chef-projet/quotes')" class="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300 transition">
                Retour
            </button>
        </div>
    </div>
  </div>
</template>