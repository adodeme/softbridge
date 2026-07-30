<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api/axios';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

// Données réactives
const quotes = ref([]);
const projects = ref([]);
const invoices = ref([]);
const subscriptions = ref([]);
const notifications = ref([]);

// Charger toutes les données client
const loadData = async () => {
    try {
        const quotesRes = await api.get('/quotes');
        quotes.value = quotesRes.data;

        const projectsRes = await api.get('/projects');
        projects.value = projectsRes.data;

        const invoicesRes = await api.get('/invoices');
        invoices.value = invoicesRes.data;

        const subsRes = await api.get('/subscriptions');
        subscriptions.value = subsRes.data;

        const notifRes = await api.get('/notifications');
        notifications.value = notifRes.data;

    } catch (error) {
        console.error('Erreur de chargement du tableau de bord client', error);
    }
};

// Action : Le client valide un devis
const validateQuote = async (id) => {
    if(confirm('Confirmer la validation de ce devis ? Un projet sera généré automatiquement.')) {
        await api.post(`/quotes/${id}/validate`);
        await loadData(); // Recharge les données
    }
};

// Action : Initier le paiement Fedapay (simulé pour l'instant)
const initiatePayment = async (invoiceId) => {
    try {
        const response = await api.post('/payments/initiate', { invoice_id: invoiceId });
        // Rediriger le client vers le lien de paiement Fedapay renvoyé par l'API
        if(response.data.payment_url) {
            window.open(response.data.payment_url, '_blank');
        }
    } catch (error) {
        alert('Erreur lors de l\'initiation du paiement.');
    }
};

// Action : Télécharger la facture en PDF
const downloadPdf = async (id) => {
    // L'URL de l'API est sur le port 8000
    window.open(`http://localhost:8000/api/invoices/${id}/download`, '_blank');
};

onMounted(() => {
    loadData();
});
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-primary mb-2">Tableau de bord Client</h1>
    <p class="text-gray-500 mb-6">Bienvenue, {{ authStore.user?.prenom }} {{ authStore.user?.nom }} !</p>

    <!-- STATISTIQUES RAPIDES -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <p class="text-gray-500 text-sm">Devis en attente</p>
            <p class="text-2xl font-bold text-orange-500">{{ quotes.filter(q => q.statut === 'envoye').length }}</p>
        </div>
        <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <p class="text-gray-500 text-sm">Projets en cours</p>
            <p class="text-2xl font-bold text-primary-light">{{ projects.filter(p => p.statut !== 'termine').length }}</p>
        </div>
        <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <p class="text-gray-500 text-sm">Factures impayées</p>
            <p class="text-2xl font-bold text-red-500">{{ invoices.filter(i => i.statut === 'impaye').length }}</p>
        </div>
        <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <p class="text-gray-500 text-sm">Abonnements actifs</p>
            <p class="text-2xl font-bold text-green-500">{{ subscriptions.filter(s => s.statut === 'active').length }}</p>
        </div>
    </div>

    <!-- SECTION NOTIFICATIONS (Nouvelle section) -->
    <div v-if="notifications.length > 0" class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h3 class="font-bold text-gray-800 text-lg mb-4">
            <i class="fas fa-bell text-yellow-500 mr-2"></i> Mes Notifications
        </h3>
        <div class="space-y-3">
            <div v-for="notif in notifications" :key="notif.id" class="bg-yellow-50 border border-yellow-100 rounded-lg p-3 flex items-start gap-3">
                <div class="mt-1 text-yellow-600"><i class="fas fa-exclamation-circle"></i></div>
                <div>
                    <p class="text-sm text-gray-700">{{ notif.message }}</p>
                    <p class="text-xs text-gray-400 mt-1">{{ new Date(notif.date_envoi).toLocaleDateString() }}</p>
                </div>
            </div>
        </div>
    </div>

    <!-- SECTION 1 : DEVIS REÇUS -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h3 class="font-bold text-gray-800 text-lg mb-4"><i class="fas fa-file-invoice text-primary-light mr-2"></i> Mes Devis reçus</h3>
        <div v-if="quotes.length === 0" class="text-gray-400 text-center py-4">Aucun devis pour le moment.</div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="quote in quotes" :key="quote.id" class="border rounded-lg p-4 flex flex-col justify-between">
                <div>
                    <div class="flex justify-between items-start">
                        <h4 class="font-bold text-primary">Devis #{{ quote.id }}</h4>
                        <span class="px-2 py-1 text-xs font-bold rounded-full" 
                              :class="{'bg-gray-100 text-gray-600': quote.statut === 'brouillon', 'bg-yellow-100 text-yellow-700': quote.statut === 'envoye', 'bg-green-100 text-green-700': quote.statut === 'valide'}">
                            {{ quote.statut.toUpperCase() }}
                        </span>
                    </div>
                    <p class="text-sm text-gray-600 mt-2"><strong>Besoins :</strong> {{ quote.besoins }}</p>
                    <p class="text-sm font-bold text-primary-light mt-1">{{ quote.montant.toLocaleString() }} FCFA</p>
                </div>
                <button v-if="quote.statut === 'envoye'" @click="validateQuote(quote.id)" class="mt-3 w-full bg-primary-light text-white py-2 rounded-lg hover:bg-primary transition font-semibold text-sm">
                    Valider le devis
                </button>
                <span v-else-if="quote.statut === 'valide'" class="mt-3 text-center text-green-600 text-sm font-semibold">✓ Devis validé</span>
            </div>
        </div>
    </div>

    <!-- SECTION 2 : SUIVI DU PROJET -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h3 class="font-bold text-gray-800 text-lg mb-4"><i class="fas fa-code-branch text-blue-500 mr-2"></i> Suivi de mes projets</h3>
        <div v-if="projects.length === 0" class="text-gray-400 text-center py-4">Aucun projet en cours.</div>
        <div v-for="project in projects" :key="project.id" class="bg-gray-50 rounded-lg p-4 mb-3 border-l-4 border-primary-light">
            <div class="flex justify-between items-center">
                <h4 class="font-bold text-gray-800">{{ project.nom || 'Projet sans titre' }}</h4>
                <span class="px-3 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-700">{{ project.statut }}</span>
            </div>
            <p class="text-sm text-gray-600 mt-1">{{ project.description }}</p>
            <p class="text-xs text-gray-500 mt-2">Livraison prévue pour le : {{ project.date_livraison ? new Date(project.date_livraison).toLocaleDateString() : 'À définir' }}</p>
            
            <!-- Barre de progression (Mockée visuellement) -->
            <div class="mt-3">
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                    <div class="bg-primary-light h-2.5 rounded-full" style="width: 60%"></div>
                </div>
            </div>
        </div>
    </div>

    <!-- SECTION 3 : FACTURES & PAIEMENTS -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h3 class="font-bold text-gray-800 text-lg mb-4"><i class="fas fa-receipt text-green-600 mr-2"></i> Mes Factures</h3>
        <div class="overflow-x-auto">
            <table class="w-full text-sm text-left">
                <thead class="bg-gray-50 text-gray-600 font-medium">
                    <tr>
                        <th class="px-4 py-3">N° Facture</th>
                        <th class="px-4 py-3">Date</th>
                        <th class="px-4 py-3">Montant</th>
                        <th class="px-4 py-3">Statut</th>
                        <th class="px-4 py-3">Action</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    <tr v-for="invoice in invoices" :key="invoice.id">
                        <td class="px-4 py-3 font-medium">{{ invoice.numero }}</td>
                        <td class="px-4 py-3">{{ new Date(invoice.date_creation).toLocaleDateString() }}</td>
                        <td class="px-4 py-3 font-bold text-primary">{{ invoice.montant.toLocaleString() }} FCFA</td>
                        <td class="px-4 py-3">
                            <span class="px-2 py-1 text-xs rounded-full font-bold" 
                                  :class="{'bg-red-100 text-red-700': invoice.statut === 'impaye', 'bg-green-100 text-green-700': invoice.statut === 'paye'}">
                                {{ invoice.statut.toUpperCase() }}
                            </span>
                        </td>
                        <td class="px-4 py-3">
                            <!-- Si payée : Bouton PDF -->
                            <button v-if="invoice.statut === 'paye'" @click="downloadPdf(invoice.id)" class="bg-primary text-white text-xs px-3 py-1 rounded hover:bg-primary-light">
                                <i class="fas fa-file-pdf mr-1"></i> PDF
                            </button>
                            <!-- Si impayée : Bouton Payer -->
                            <button v-else @click="initiatePayment(invoice.id)" class="bg-red-500 text-white text-xs px-3 py-1 rounded hover:bg-red-700 shadow-sm">
                                <i class="fas fa-credit-card mr-1"></i> Payer
                            </button>
                        </td>
                    </tr>
                    <tr v-if="invoices.length === 0"><td colspan="5" class="px-4 py-6 text-center text-gray-500">Aucune facture.</td></tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- SECTION 4 : MES ABONNEMENTS -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 class="font-bold text-gray-800 text-lg mb-4"><i class="fas fa-cubes text-primary mr-2"></i> Mes Abonnements</h3>
        <div v-if="subscriptions.length === 0" class="text-gray-400 text-center py-4">Aucun abonnement actif.</div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="sub in subscriptions" :key="sub.id" class="border rounded-lg p-4 flex items-center justify-between bg-gray-50">
                <div>
                    <h5 class="font-bold text-gray-800">{{ sub.license?.software?.nom || 'Logiciel' }}</h5>
                    <p class="text-xs text-gray-500">Expire le : {{ new Date(sub.date_fin).toLocaleDateString() }}</p>
                </div>
                <span class="px-3 py-1 text-xs font-bold rounded-full" 
                      :class="{'bg-green-100 text-green-700': sub.statut === 'active', 'bg-red-100 text-red-700': sub.statut === 'expiree'}">
                    {{ sub.statut }}
                </span>
            </div>
        </div>
    </div>
  </div>
</template>