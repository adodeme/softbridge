<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/api/axios';
import Swal from 'sweetalert2';

const router = useRouter();
const step = ref(1);
const email = ref('');
const password = ref('');
const otp = ref('');
const userId = ref(null);
const errorMessage = ref('');
const timeLeft = ref(120);
let timerInterval;

// Réinitialisation à chaque montage
onMounted(() => {
  step.value = 1;
  email.value = '';
  password.value = '';
  otp.value = '';
  userId.value = null;
  errorMessage.value = '';
  clearInterval(timerInterval);
  timeLeft.value = 120;
});

const startCountdown = () => {
  clearInterval(timerInterval);
  timeLeft.value = 120;
  timerInterval = setInterval(() => {
    if (timeLeft.value > 0) timeLeft.value--;
    else clearInterval(timerInterval);
  }, 1000);
};

const formatTime = (seconds) => {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
};

const handleStep1 = async () => {
  try {
    const res = await api.post('/login/step1', { email: email.value, password: password.value });
    userId.value = res.data.user_id;
    step.value = 2;
    startCountdown();
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Identifiants incorrects.';
  }
};

const handleStep2 = async () => {
  try {
    const res = await api.post('/login/step2', { user_id: userId.value, code: otp.value });
    localStorage.setItem('token', res.data.access_token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    const role = res.data.user.role;
    if (role === 'client') router.push('/dashboard/client/accueil');
    else if (role === 'chef_projet') router.push('/dashboard/chef-projet/accueil');
    else router.push('/dashboard/admin/accueil');
  } catch (error) {
    Swal.fire('Erreur', error.response?.data?.message || 'Code invalide', 'error');
  }
};

const resendOtp = async () => {
  try {
    await api.post('/otp/resend', { user_id: userId.value });
    startCountdown();
    Swal.fire('Succès', 'Nouveau code envoyé.', 'success');
  } catch (error) {
    Swal.fire('Erreur', error.response?.data?.message || 'Erreur', 'error');
  }
};

// Revenir à l'étape 1
const backToStep1 = () => {
  step.value = 1;
  errorMessage.value = '';
  clearInterval(timerInterval);
};

onUnmounted(() => clearInterval(timerInterval));
</script>

<template>
  <div class="max-w-md mx-auto mt-10 bg-white p-8 rounded-2xl shadow-lg border">
    <h2 class="text-2xl font-bold text-center text-primary mb-6">Connexion</h2>
    <div v-if="errorMessage" class="bg-red-50 text-red-600 p-3 rounded-lg mb-4">{{ errorMessage }}</div>

    <!-- Étape 1 -->
    <form v-if="step === 1" @submit.prevent="handleStep1" class="space-y-4">
      <div><label class="block text-sm font-semibold text-gray-700 mb-1">Email</label><input type="email" v-model="email" class="w-full border rounded-xl px-4 py-2" required></div>
      <div><label class="block text-sm font-semibold text-gray-700 mb-1">Mot de passe</label><input type="password" v-model="password" class="w-full border rounded-xl px-4 py-2" required></div>
      <button type="submit" class="w-full py-3 bg-primary-light text-white font-bold rounded-xl hover:bg-primary transition">Se connecter</button>
    </form>

    <!-- Étape 2 -->
    <div v-else>
      <p class="text-center text-gray-600 mb-4">Un code à 6 chiffres a été envoyé à votre adresse email.</p>
      <form @submit.prevent="handleStep2" class="space-y-4">
        <div><input type="text" v-model="otp" maxlength="6" class="w-full border rounded-xl px-4 py-2 text-center text-2xl tracking-widest" placeholder="000000" required></div>
        <p class="text-center text-sm text-gray-500" v-if="timeLeft > 0">Temps restant : {{ formatTime(timeLeft) }}</p>
        <p v-else class="text-center text-sm text-red-500">Le code a expiré.</p>
        <button type="submit" :disabled="timeLeft === 0" class="w-full py-3 bg-primary-light text-white font-bold rounded-xl hover:bg-primary transition">Vérifier</button>
      </form>
      <div class="flex justify-between mt-2">
        <button @click="backToStep1" class="text-sm text-gray-600 hover:text-primary-light">← Retour</button>
        <button @click="resendOtp" class="text-sm text-primary-light hover:underline">Renvoyer un code</button>
      </div>
    </div>
  </div>
</template>