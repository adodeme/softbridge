<script setup>
import { ref } from 'vue';
import api from '@/api/axios';
import Swal from 'sweetalert2';

const email = ref('');
const isLoading = ref(false);

const sendResetLink = async () => {
  isLoading.value = true;
  try {
    await api.post('/forgot-password', { email: email.value });
    Swal.fire('Succès', 'Un lien de réinitialisation a été envoyé à votre adresse email.', 'success');
    email.value = '';
  } catch (error) {
    Swal.fire('Erreur', error.response?.data?.message || 'Une erreur est survenue.', 'error');
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="max-w-md mx-auto mt-10 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
    <h2 class="text-2xl font-bold text-center text-primary mb-6">Mot de passe oublié</h2>
    <p class="text-sm text-gray-500 mb-4 text-center">Entrez votre adresse email pour recevoir un lien de réinitialisation.</p>
    <form @submit.prevent="sendResetLink" class="space-y-4">
      <input type="email" v-model="email" placeholder="Votre email" class="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-light" required>
      <button type="submit" :disabled="isLoading" class="w-full py-3 bg-primary-light text-white font-bold rounded-xl hover:bg-primary transition">
        {{ isLoading ? 'Envoi...' : 'Envoyer le lien' }}
      </button>
    </form>
    <p class="mt-4 text-center text-sm text-gray-500">
      <router-link to="/login" class="text-primary-light hover:underline">Retour à la connexion</router-link>
    </p>
  </div>
</template>