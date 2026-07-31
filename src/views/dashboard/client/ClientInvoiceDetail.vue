<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api/axios';
import Swal from 'sweetalert2';

const route = useRoute();
const router = useRouter();
const invoice = ref(null);
const isLoading = ref(true);
const showKey = ref(false);

const loadInvoice = async () => {
    try {
        const res = await api.get(`/invoices/${route.params.id}`);
        invoice.value = res.data;
    } catch (e) {
        console.error(e);
    } finally {
        isLoading.value = false;
    }
};

// Simulation du paiement via FedaPay (pour le test)
const simulatePayment = async () => {
  try {
    const res = await api.post('/payments/simulate', { invoice_id: invoice.value.id });
    Swal.fire('Succès', res.data.message, 'success');
    await loadInvoice(); // Recharge la facture pour voir le statut payé
  } catch (error) {
    Swal.fire('Erreur', error.response?.data?.error || 'Échec de la simulation.', 'error');
  }
};

// Télécharger le PDF de la facture
const downloadPdf = async () => {
  try {
    const response = await api.get(`/invoices/${invoice.value.id}/download`, {
      responseType: 'blob' // ← indispensable pour recevoir le PDF en binaire
    });
    // Créer une URL blob à partir des données reçues
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    // Créer un lien temporaire et le cliquer
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `facture_${invoice.value.numero}.pdf`);
    document.body.appendChild(link);
    link.click();
    // Nettoyer
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Erreur téléchargement PDF', error);
    Swal.fire('Erreur', 'Impossible de télécharger la facture.', 'error');
  }
};
const accessSoftware = async () => {
  const { value: key } = await Swal.fire({
    title: 'Entrez votre clé d\'accès',
    input: 'text',
    inputPlaceholder: 'Collez la clé affichée dans la facture',
    showCancelButton: true,
    confirmButtonText: 'Accéder',
    cancelButtonText: 'Annuler',
    inputValidator: (value) => {
      if (!value) {
        return 'Vous devez entrer une clé!';
      }
    }
  });

  if (!key) return;

  try {
    const res = await api.post('/software/verify-key', { key: key });
    if (res.data.url) {
      window.open(res.data.url, '_blank');
    }
  } catch (error) {
    Swal.fire('Erreur', error.response?.data?.message || 'Clé invalide ou expirée.', 'error');
  }
};

onMounted(loadInvoice);
</script>

<template>
  <div class="max-w-2xl mx-auto py-8 px-4">
    <div v-if="isLoading" class="text-center py-10 text-gray-500">Chargement...</div>
    <div v-else-if="invoice" class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 class="text-2xl font-bold text-primary mb-4">Détails de la facture</h2>
        
        <div class="space-y-3 text-gray-700">
            <p><span class="font-bold">Numéro :</span> {{ invoice.numero }}</p>
            <p><span class="font-bold">Client :</span> {{ invoice.client?.nom_entreprise }}</p>
            <p><span class="font-bold">Montant :</span> {{ invoice.montant.toLocaleString() }} FCFA</p>
            <p><span class="font-bold">Type :</span> {{ invoice.type === 'devis' ? 'Devis' : 'Abonnement' }}</p>
            <p><span class="font-bold">Statut :</span> 
                <span class="px-2 py-1 text-xs font-bold rounded-full" 
                      :class="{'bg-red-100 text-red-700': invoice.statut === 'impaye', 'bg-green-100 text-green-700': invoice.statut === 'paye'}">
                    {{ invoice.statut.toUpperCase() }}
                </span>
            </p>
            <p v-if="invoice.project"><span class="font-bold">Projet lié :</span> {{ invoice.project.nom }}</p>
            
            <!-- Affichage de la clé d'accès pour les abonnements payés -->
            <div v-if="invoice.type === 'abonnement' && invoice.statut === 'paye'">
                <p><span class="font-bold">Clé d'accès :</span></p>
                <div class="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <span v-if="showKey" class="font-mono text-primary font-bold">{{ invoice.cle_acces }}</span>
                    <span v-else class="font-mono text-gray-400 font-bold">••••••••••••••••</span>
                    <button @click="showKey = !showKey" class="text-primary-light hover:text-primary text-sm font-bold">
                        <i :class="showKey ? 'fas fa-eye-slash' : 'fas fa-eye'"></i> {{ showKey ? 'Masquer' : 'Afficher' }}
                    </button>
                </div>
            </div>
        </div>

        <div class="mt-6 flex flex-col sm:flex-row gap-3">
            <button v-if="invoice.statut !== 'paye'" @click="simulatePayment" class="flex-1 bg-green-500 text-white py-3 rounded-xl font-bold hover:bg-green-600 transition">
                <i class="fas fa-flask mr-2"></i> Simuler le paiement
            </button>
            <button v-else @click="downloadPdf" class="flex-1 bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary-light transition">
                <i class="fas fa-file-pdf mr-2"></i> Télécharger le PDF
            </button>
            <button v-if="invoice.type === 'abonnement' && invoice.statut === 'paye'"
                    @click="accessSoftware"
                    class="flex-1 bg-primary-light text-white py-3 rounded-xl font-bold hover:bg-primary transition">
                <i class="fas fa-external-link-alt mr-2"></i> Accéder au logiciel
            </button>
            <button @click="router.push('/dashboard/client/invoices')" class="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300 transition">
                Ignorer
            </button>

        </div>
    </div>
  </div>
</template>