<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/api/axios';
import Swal from 'sweetalert2';

const router = useRouter();

const form = ref({
  date: '',
  heure_debut: '',
  duree: 60,
  nom: '',
  prenom: '',
  email: '',
  telephone: ''
});

const isLoading = ref(false);

const submitAppointment = async () => {
  isLoading.value = true;

  try {
    const response = await api.post('/appointments', form.value);
    
    // SUCCÈS (Popup Verte)
    Swal.fire({
        icon: 'success',
        title: 'Rendez-vous pris avec succès !',
        text: `Confirmé pour le ${response.data.appointment.date} à ${response.data.appointment.heure_debut}.`,
        confirmButtonText: 'Voir mon rendez-vous',
        showDenyButton: true,
        denyButtonText: 'Ignorer',
        confirmButtonColor: '#1572E8',
        denyButtonColor: '#6b7280'
    }).then((result) => {
        if (result.isConfirmed) {
            router.push(`/appointments/${response.data.appointment.id}`);
        }
        form.value = { date: '', heure_debut: '', duree: 60, nom: '', prenom: '', email: '', telephone: '' };
    });

  } catch (error) {
    // GESTION ROBUSTE DES ERREURS
    if (error.response) {
        let errorMsg = error.response.data.error || error.response.data.message || 'Erreur serveur inconnue.';
        
        if (error.response.status === 422) {
            let errorTitle = 'Réservation impossible';
            if (errorMsg.includes('week-end')) {
                errorTitle = '⚠️ Jour non ouvrable';
            } else if (errorMsg.includes('déjà pris')) {
                errorTitle = '⏰ Créneau déjà occupé';
            } else if (errorMsg.includes('pause')) {
                errorTitle = '🍽️ Heure de pause';
            }
            Swal.fire({
                icon: 'error',
                title: errorTitle,
                text: errorMsg,
                confirmButtonColor: '#d33'
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oups ! Une erreur serveur est survenue',
                text: `Code ${error.response.status} : ${errorMsg}`,
                confirmButtonColor: '#d33'
            });
        }
    } else if (error.request) {
        Swal.fire({
            icon: 'error',
            title: 'Erreur de connexion',
            text: 'Le serveur Backend est inaccessible. Vérifiez que "php artisan serve" est bien lancé.',
            confirmButtonColor: '#d33'
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oups !',
            text: 'Une erreur inattendue est survenue.',
            confirmButtonColor: '#d33'
        });
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 py-12">
    <div class="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
      
      <h2 class="text-3xl font-bold text-center text-primary mb-2">Prendre un rendez-vous</h2>
      <p class="text-center text-gray-500 mb-8">Remplissez vos informations et choisissez un créneau.</p>

      <form @submit.prevent="submitAppointment" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="col-span-2">
           <h4 class="font-bold text-gray-700 text-sm mb-2 border-b pb-2">Vos informations</h4>
        </div>
        <div><input type="text" v-model="form.nom" placeholder="Nom" class="w-full border rounded-xl px-4 py-3" required></div>
        <div><input type="text" v-model="form.prenom" placeholder="Prénom" class="w-full border rounded-xl px-4 py-3" required></div>
        <div class="col-span-2"><input type="email" v-model="form.email" placeholder="Email" class="w-full border rounded-xl px-4 py-3" required></div>
        <div class="col-span-2"><input type="text" v-model="form.telephone" placeholder="Téléphone" class="w-full border rounded-xl px-4 py-3" required></div>
        <div class="col-span-2"><h4 class="font-bold text-gray-700 text-sm mb-2 border-b pb-2">Date et heure</h4></div>
        <div><label class="block text-sm font-semibold text-gray-700 mb-1">Date</label><input type="date" v-model="form.date" class="w-full border rounded-xl px-4 py-3" required></div>
        <div><label class="block text-sm font-semibold text-gray-700 mb-1">Heure de début</label><input type="time" v-model="form.heure_debut" class="w-full border rounded-xl px-4 py-3" required></div>
        <div class="col-span-2"><label class="block text-sm font-semibold text-gray-700 mb-1">Durée estimée</label><select v-model="form.duree" class="w-full border rounded-xl px-4 py-3 bg-white"><option :value="30">30 minutes</option><option :value="60">1 heure</option><option :value="90">1 heure 30</option><option :value="120">2 heures</option></select></div>
        <div class="col-span-2">
          <button type="submit" :disabled="isLoading" class="w-full py-4 text-white font-bold rounded-xl bg-primary-light hover:bg-primary transition shadow-lg">
            <span v-if="isLoading"><i class="fas fa-spinner fa-spin mr-2"></i> Vérification...</span>
            <span v-else><i class="fas fa-calendar-check mr-2"></i> Confirmer le rendez-vous</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>