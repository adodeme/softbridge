<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import api from '@/api/axios';
import Swal from 'sweetalert2';

const router = useRouter();
const authStore = useAuthStore();
const form = ref({
  besoins: '',
  fonctionnalites: [],
  nouvelle: ''
});
const loading = ref(false);

const addFonctionnalite = () => {
  if (form.value.nouvelle.trim()) {
    form.value.fonctionnalites.push(form.value.nouvelle.trim());
    form.value.nouvelle = '';
  }
};

const soumettre = async () => {
  if (!authStore.token) {
    // Rediriger vers la connexion, puis revenir ici
    router.push(`/login?redirect=/demande-devis`);
    return;
  }
  loading.value = true;
  try {
    // Envoyer la demande au chef de projet (route existante /create-quote)
    await api.post('/create-quote', {
      besoins: form.value.besoins,
      fonctionnalites: form.value.fonctionnalites,
      montant: 0 // sera défini par le chef
    });
    Swal.fire('Succès', 'Votre demande a été envoyée au chef de projet.', 'success');
    router.push('/');
  } catch (e) {
    Swal.fire('Erreur', e.response?.data?.message || 'Erreur', 'error');
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="max-w-2xl mx-auto py-12 px-4">
    <h1 class="text-2xl font-bold text-primary mb-6">Demande de devis</h1>
    <p class="text-gray-600 mb-6">Décrivez votre projet. Le chef de projet vous contactera pour établir un devis.</p>
    <form @submit.prevent="soumettre" class="space-y-4">
      <div>
        <label class="block font-semibold text-gray-700 mb-1">Besoins</label>
        <textarea v-model="form.besoins" class="w-full border rounded-lg px-4 py-2" rows="4" required></textarea>
      </div>
      <div>
        <label class="block font-semibold text-gray-700 mb-1">Fonctionnalités souhaitées</label>
        <div class="flex gap-2">
          <input v-model="form.nouvelle" class="flex-1 border rounded-lg px-4 py-2" placeholder="Ajouter une fonctionnalité">
          <button type="button" @click="addFonctionnalite" class="bg-gray-100 px-4 rounded-lg hover:bg-gray-200">
            <i class="fas fa-plus"></i>
          </button>
        </div>
        <div class="flex flex-wrap gap-2 mt-2">
          <span v-for="(f, i) in form.fonctionnalites" :key="i" class="bg-blue-50 text-primary-light text-xs px-2 py-1 rounded-full flex items-center">
            {{ f }}
            <i @click="form.fonctionnalites.splice(i,1)" class="fas fa-times ml-2 cursor-pointer hover:text-red-500"></i>
          </span>
        </div>
      </div>
      <button type="submit" :disabled="loading" class="w-full py-3 bg-primary-light text-white font-bold rounded-xl hover:bg-primary transition">
        {{ loading ? 'Envoi...' : 'Envoyer ma demande' }}
      </button>
    </form>
    <p v-if="!authStore.token" class="mt-4 text-center text-sm text-gray-500">
      Déjà client ? <router-link to="/login" class="text-primary-light">Connectez-nous</router-link>.
    </p>
  </div>
</template>