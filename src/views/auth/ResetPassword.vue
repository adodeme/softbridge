<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api/axios';
import Swal from 'sweetalert2';

const route = useRoute();
const router = useRouter();
const token = ref('');
const email = ref('');
const password = ref('');
const password_confirmation = ref('');

onMounted(() => {
  token.value = route.query.token || '';
  email.value = route.query.email || '';
});

const resetPassword = async () => {
  try {
    await api.post('/reset-password', {
      token: token.value,
      email: email.value,
      password: password.value,
      password_confirmation: password_confirmation.value
    });
    Swal.fire('Succès', 'Votre mot de passe a été réinitialisé. Vous pouvez maintenant vous connecter.', 'success');
    router.push('/login');
  } catch (error) {
    Swal.fire('Erreur', error.response?.data?.message || 'Une erreur est survenue.', 'error');
  }
};
</script>

<template>
  <div class="max-w-md mx-auto mt-10 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
    <h2 class="text-2xl font-bold text-center text-primary mb-6">Réinitialiser le mot de passe</h2>
    <form @submit.prevent="resetPassword" class="space-y-4">
      <input type="password" v-model="password" placeholder="Nouveau mot de passe" class="w-full border rounded-xl px-4 py-2" required>
      <input type="password" v-model="password_confirmation" placeholder="Confirmer le mot de passe" class="w-full border rounded-xl px-4 py-2" required>
      <button type="submit" class="w-full py-3 bg-primary-light text-white font-bold rounded-xl hover:bg-primary transition">Réinitialiser</button>
    </form>
  </div>
</template>