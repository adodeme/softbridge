<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api/axios';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

// Données
const clients = ref([]);
const quotes = ref([]);
const isLoading = ref(false);

// Modale Ajouter Client
const showClientModal = ref(false);
const newClient = ref({ nom: '', prenom: '', email: '', telephone: '', nom_entreprise: '', adresse: '' });

// Modale Créer Devis
const showQuoteModal = ref(false);
const newQuote = ref({ client_id: '', besoins: '', fonctionnalites: [], montant: 0 });
const currentFonctionnalite = ref('');

// Charger les données au démarrage
const loadData = async () => {
    try {
        const clientsRes = await api.get('/clients');
        clients.value = clientsRes.data;

        const quotesRes = await api.get('/quotes');
        quotes.value = quotesRes.data;
    } catch (error) {
        console.error('Erreur de chargement des données', error);
    }
};

// Créer un client
const createClient = async () => {
    try {
        await api.post('/clients', newClient.value);
        showClientModal.value = false;
        newClient.value = { nom: '', prenom: '', email: '', telephone: '', nom_entreprise: '', adresse: '' };
        await loadData(); // Recharger la liste
    } catch (error) {
        alert('Erreur lors de la création du client');
    }
};

// Créer un devis
const createQuote = async () => {
    try {
        await api.post('/quotes', newQuote.value);
        showQuoteModal.value = false;
        newQuote.value = { client_id: '', besoins: '', fonctionnalites: [], montant: 0 };
        await loadData(); // Recharger la liste
    } catch (error) {
        alert('Erreur lors de la création du devis');
    }
};

// Envoyer un devis au client
const sendQuote = async (id) => {
    if(confirm('Envoyer ce devis au client ?')) {
        await api.post(`/quotes/${id}/send`);
        await loadData();
    }
};

onMounted(() => {
    loadData();
});
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-primary mb-2">Tableau de bord Chef Projet</h1>
    <p class="text-gray-500 mb-6">Bienvenue, {{ authStore.user?.prenom }} {{ authStore.user?.nom }} !</p>

    <!-- Statistiques -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div class="flex items-center gap-3 text-primary-light text-2xl mb-2"><i class="fas fa-users"></i></div>
            <p class="text-gray-500 text-sm">Total Clients</p>
            <p class="text-2xl font-bold text-gray-800">{{ clients.length }}</p>
        </div>
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div class="flex items-center gap-3 text-orange-500 text-2xl mb-2"><i class="fas fa-file-invoice"></i></div>
            <p class="text-gray-500 text-sm">Devis en attente</p>
            <p class="text-2xl font-bold text-gray-800">{{ quotes.filter(q => q.statut === 'brouillon' || q.statut === 'envoye').length }}</p>
        </div>
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div class="flex items-center gap-3 text-green-500 text-2xl mb-2"><i class="fas fa-check-circle"></i></div>
            <p class="text-gray-500 text-sm">Devis validés</p>
            <p class="text-2xl font-bold text-gray-800">{{ quotes.filter(q => q.statut === 'valide').length }}</p>
        </div>
    </div>

    <!-- Actions Rapides -->
    <div class="flex flex-wrap gap-3 mb-6">
        <button @click="showClientModal = true" class="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-light transition shadow-sm">
            <i class="fas fa-user-plus mr-2"></i> Ajouter un client
        </button>
        <button @click="showQuoteModal = true" class="bg-primary-light text-white px-6 py-2 rounded-lg font-medium hover:bg-primary transition shadow-sm">
            <i class="fas fa-file-invoice mr-2"></i> Créer un devis
        </button>
    </div>

    <!-- Liste des Devis -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-6 border-b border-gray-100">
            <h3 class="font-bold text-gray-800">Gestion des Devis</h3>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full text-sm text-left">
                <thead class="bg-gray-50 text-gray-600 font-medium">
                    <tr>
                        <th class="px-6 py-3">Client</th>
                        <th class="px-6 py-3">Besoins</th>
                        <th class="px-6 py-3">Montant</th>
                        <th class="px-6 py-3">Statut</th>
                        <th class="px-6 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    <tr v-for="quote in quotes" :key="quote.id" class="hover:bg-gray-50 transition">
                        <td class="px-6 py-4 font-medium text-gray-800">{{ quote.client?.nom_entreprise || 'Inconnu' }}</td>
                        <td class="px-6 py-4 text-gray-600 max-w-xs truncate">{{ quote.besoins }}</td>
                        <td class="px-6 py-4 font-bold text-primary">{{ quote.montant.toLocaleString() }} FCFA</td>
                        <td class="px-6 py-4">
                            <span class="px-3 py-1 text-xs font-semibold rounded-full" 
                                  :class="{'bg-gray-100 text-gray-600': quote.statut === 'brouillon', 
                                           'bg-yellow-100 text-yellow-700': quote.statut === 'envoye', 
                                           'bg-green-100 text-green-700': quote.statut === 'valide'}">
                                {{ quote.statut.toUpperCase() }}
                            </span>
                        </td>
                        <td class="px-6 py-4">
                            <button v-if="quote.statut === 'brouillon'" @click="sendQuote(quote.id)" class="text-primary-light hover:text-primary font-medium text-sm">
                                Envoyer
                            </button>
                            <span v-else class="text-gray-400 text-sm italic">En attente</span>
                        </td>
                    </tr>
                    <tr v-if="quotes.length === 0"><td colspan="5" class="px-6 py-8 text-center text-gray-500">Aucun devis créé pour le moment.</td></tr>
                </tbody>
            </table>
        </div>
    </div>


    <!-- MODALE AJOUTER CLIENT -->
    <div v-if="showClientModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="showClientModal = false">
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 class="text-xl font-bold text-gray-800 mb-4">Ajouter un nouveau client</h3>
            <form @submit.prevent="createClient" class="space-y-3">
                <div class="grid grid-cols-2 gap-3">
                    <div><input type="text" v-model="newClient.nom" placeholder="Nom" class="w-full border rounded-lg px-3 py-2" required></div>
                    <div><input type="text" v-model="newClient.prenom" placeholder="Prénom" class="w-full border rounded-lg px-3 py-2" required></div>
                </div>
                <div><input type="email" v-model="newClient.email" placeholder="Email" class="w-full border rounded-lg px-3 py-2" required></div>
                <div><input type="text" v-model="newClient.telephone" placeholder="Téléphone" class="w-full border rounded-lg px-3 py-2" required></div>
                <div><input type="text" v-model="newClient.nom_entreprise" placeholder="Nom de l'entreprise" class="w-full border rounded-lg px-3 py-2"></div>
                <div><input type="text" v-model="newClient.adresse" placeholder="Adresse" class="w-full border rounded-lg px-3 py-2"></div>
                <div class="flex gap-3 mt-4">
                    <button type="button" @click="showClientModal = false" class="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg">Annuler</button>
                    <button type="submit" class="flex-1 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-light">Enregistrer</button>
                </div>
            </form>
        </div>
    </div>

    <!-- MODALE CRÉER DEVIS -->
    <div v-if="showQuoteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="showQuoteModal = false">
        <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 class="text-xl font-bold text-gray-800 mb-4">Créer un devis</h3>
            <form @submit.prevent="createQuote" class="space-y-3">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Client</label>
                    <select v-model="newQuote.client_id" class="w-full border rounded-lg px-3 py-2" required>
                        <option disabled value="">Sélectionner un client</option>
                        <option v-for="client in clients" :key="client.id" :value="client.id">{{ client.nom_entreprise }} ({{ client.user.nom }} {{ client.user.prenom }})</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Besoins du projet</label>
                    <textarea v-model="newQuote.besoins" class="w-full border rounded-lg px-3 py-2" rows="3" required></textarea>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Fonctionnalités</label>
                    <div class="flex gap-2">
                        <input type="text" v-model="currentFonctionnalite" placeholder="Ex: Panier client" class="flex-1 border rounded-lg px-3 py-2">
                        <button type="button" @click="newQuote.fonctionnalites.push(currentFonctionnalite); currentFonctionnalite = ''" class="bg-gray-100 px-4 rounded-lg"><i class="fas fa-plus"></i></button>
                    </div>
                    <div class="flex flex-wrap gap-2 mt-2">
                        <span v-for="(item, index) in newQuote.fonctionnalites" :key="index" class="bg-blue-50 text-primary-light text-xs px-2 py-1 rounded-full flex items-center">
                            {{ item }} <i @click="newQuote.fonctionnalites.splice(index, 1)" class="fas fa-times ml-2 cursor-pointer hover:text-red-500"></i>
                        </span>
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Montant estimé (FCFA)</label>
                    <input type="number" v-model="newQuote.montant" class="w-full border rounded-lg px-3 py-2" required>
                </div>
                <div class="flex gap-3 mt-4">
                    <button type="button" @click="showQuoteModal = false" class="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg">Annuler</button>
                    <button type="submit" class="flex-1 py-2 bg-primary-light text-white rounded-lg font-semibold hover:bg-primary">Enregistrer le devis</button>
                </div>
            </form>
        </div>
    </div>
  </div>
</template>