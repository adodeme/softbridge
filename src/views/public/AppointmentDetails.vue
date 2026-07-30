<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api/axios';

const route = useRoute();
const router = useRouter();
const appointment = ref(null);
const isLoading = ref(true);
const error = ref('');

const loadAppointment = async () => {
    try {
        const res = await api.get(`/appointments/${route.params.id}`);
        appointment.value = res.data;
    } catch (e) {
        console.error('Erreur détaillée:', e); // Pour voir l'erreur dans la console F12
        if (e.response) {
            // Le serveur a répondu avec une erreur (500, 404, etc.)
            error.value = `Erreur serveur (${e.response.status}): ${e.response.data.message || 'Le rendez-vous est introuvable.'}`;
        } else if (e.request) {
            // Le serveur n'a pas répondu du tout
            error.value = 'Le serveur ne répond pas. Vérifiez que Laravel est bien lancé (php artisan serve).';
        } else {
            error.value = 'Une erreur inattendue est survenue.';
        }
    } finally {
        // Ce bloc est CRUCIAL : il arrête le chargement dans TOUS les cas
        isLoading.value = false;
    }
};

const downloadPdf = () => {
    window.open(`http://localhost:8000/api/appointments/${route.params.id}/download`, '_blank');
};

onMounted(loadAppointment);
</script>

<template>
  <div class="max-w-2xl mx-auto px-4 py-12">
    <!-- Spinner de chargement -->
    <div v-if="isLoading" class="text-center py-10 text-gray-500">
        <i class="fas fa-spinner fa-spin text-3xl text-primary-light"></i>
        <p class="mt-2">Chargement des détails du rendez-vous...</p>
    </div>

    <!-- Affichage de l'erreur (si le chargement échoue) -->
    <div v-else-if="error" class="bg-red-50 p-6 rounded-xl text-red-600 text-center border border-red-200">
        <i class="fas fa-exclamation-circle text-3xl mb-3"></i>
        <p class="font-bold">{{ error }}</p>
        <button @click="router.push('/rdv')" class="mt-4 bg-primary-light text-white px-4 py-2 rounded-lg">Retourner à la prise de RDV</button>
    </div>

    <!-- Affichage des détails (Succès) -->
    <div v-else class="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <h2 class="text-2xl font-bold text-primary mb-6 border-b pb-4">Détails du rendez-vous</h2>
        
        <div class="space-y-3 text-gray-700">
            <!-- Gestion du cas où l'utilisateur est invité (non connecté) ou connecté -->
            <p><span class="font-bold">Nom :</span> {{ appointment.user ? appointment.user.nom : appointment.guest_nom }}</p>
            <p><span class="font-bold">Prénom :</span> {{ appointment.user ? appointment.user.prenom : appointment.guest_prenom }}</p>
            <p><span class="font-bold">Email :</span> {{ appointment.user ? appointment.user.email : appointment.guest_email }}</p>
            <p><span class="font-bold">Téléphone :</span> {{ appointment.user ? appointment.user.telephone : appointment.guest_telephone }}</p>
            <p><span class="font-bold">Date :</span> {{ appointment.date }}</p>
            <p><span class="font-bold">Heure :</span> {{ appointment.heure_debut }}</p>
            <p><span class="font-bold">Durée :</span> {{ appointment.duree }} minutes</p>
            <p><span class="font-bold">Statut :</span> 
                <span class="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700 font-bold">{{ appointment.statut.toUpperCase() }}</span>
            </p>
        </div>

        <div class="mt-8 flex flex-col sm:flex-row gap-4">
            <button @click="downloadPdf" class="flex-1 bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary-light transition">
                <i class="fas fa-file-pdf mr-2"></i> Convertir en PDF
            </button>
            <button @click="router.push('/')" class="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300 transition">
                Ignorer
            </button>
        </div>
    </div>
  </div>
</template>