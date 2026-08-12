<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/api/axios';
import Swal from 'sweetalert2';

const router = useRouter();

const step = ref(1);
const email = ref('');
const password = ref('');
const errorMessage = ref('');

const userId = ref(null);
const otpValues = ref(Array(6).fill(''));
const otpInputs = ref([]);
const timeLeft = ref(120);
let timerInterval = null;
const otpError = ref('');

const maskedEmail = computed(() => {
  const mail = email.value;
  if (!mail) return '';
  const [localPart, domain] = mail.split('@');
  if (!domain) return mail;
  const visible = localPart.slice(0, 2);
  const hidden = '•'.repeat(Math.max(localPart.length - 2, 0));
  return `${visible}${hidden}@${domain}`;
});

const isOtpComplete = computed(() => otpValues.value.every(v => v !== ''));
const isResendEnabled = computed(() => timeLeft.value === 0);

const formattedTime = computed(() => {
  const min = Math.floor(timeLeft.value / 60);
  const sec = timeLeft.value % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
});

const startCountdown = () => {
  clearInterval(timerInterval);
  timeLeft.value = 120;
  timerInterval = setInterval(() => {
    if (timeLeft.value > 0) timeLeft.value--;
    else clearInterval(timerInterval);
  }, 1000);
};

const handleStep1 = async () => {
  try {
    errorMessage.value = '';
    const res = await api.post('/login/step1', {
      email: email.value,
      password: password.value,
    });
    userId.value = res.data.user_id;
    step.value = 2;
    startCountdown();
    setTimeout(() => otpInputs.value[0]?.focus(), 100);
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Identifiants incorrects.';
  }
};

const handleOtpInput = (index, event) => {
  const val = event.target.value.replace(/\D/g, '');
  otpValues.value[index] = val;
  if (val && index < 5) otpInputs.value[index + 1]?.focus();
};

const handleKeydown = (index, event) => {
  if (event.key === 'Backspace' && !otpValues.value[index] && index > 0) {
    otpValues.value[index - 1] = '';
    otpInputs.value[index - 1]?.focus();
  }
};

const handlePaste = (event) => {
  event.preventDefault();
  const text = (event.clipboardData || window.clipboardData).getData('text');
  const digits = text.replace(/\D/g, '').slice(0, 6).split('');
  otpValues.value = Array(6).fill('').map((_, i) => digits[i] || '');
  if (digits.length === 6) otpInputs.value[5]?.focus();
};

const handleStep2 = async () => {
  if (!isOtpComplete.value) return;
  otpError.value = '';
  const code = otpValues.value.join('');
  try {
    const res = await api.post('/login/step2', {
      user_id: userId.value,
      code: code,
    });
    localStorage.setItem('token', res.data.access_token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    const role = res.data.user.role;
    if (role === 'client') router.push('/dashboard/client/accueil');
    else if (role === 'chef_projet') router.push('/dashboard/chef-projet/accueil');
    else router.push('/dashboard/admin/accueil');
  } catch (error) {
    const msg = error.response?.data?.message || 'Erreur';
    if (msg.includes('expiré')) {
      otpError.value = 'Votre code a expiré. Veuillez demander un nouveau code.';
      timeLeft.value = 0;
    } else if (msg.includes('incorrect') || msg.includes('trouvé')) {
      otpError.value = 'Code incorrect. Veuillez vérifier le code saisi.';
    } else {
      otpError.value = msg;
    }
  }
};

const resendOtp = async () => {
  try {
    await api.post('/otp/resend', { user_id: userId.value });
    otpValues.value = Array(6).fill('');
    otpInputs.value[0]?.focus();
    otpError.value = '';
    Swal.fire('Succès', 'Nouveau code envoyé.', 'success');
    startCountdown();
  } catch (error) {
    Swal.fire('Erreur', error.response?.data?.message || 'Erreur', 'error');
  }
};

onMounted(() => {
  step.value = 1;
  email.value = '';
  password.value = '';
  otpValues.value = Array(6).fill('');
  otpError.value = '';
  clearInterval(timerInterval);
  timeLeft.value = 120;
});

onUnmounted(() => clearInterval(timerInterval));
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
      <!-- Logo -->
      <img src="/logo-softbridge.png" alt="SoftBridge" class="h-16 mx-auto mb-4" />

      <h2 class="text-2xl font-bold text-center text-primary mb-6">
        {{ step === 1 ? 'Connexion' : 'Vérification en deux étapes' }}
      </h2>

      <!-- Étape 1 : email / mot de passe -->
      <form v-if="step === 1" @submit.prevent="handleStep1" class="space-y-4">
        <div v-if="errorMessage" class="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
          {{ errorMessage }}
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Adresse email</label>
          <input
            type="email"
            v-model="email"
            class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-light outline-none"
            required
            autofocus
          />
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Mot de passe</label>
          <input
            type="password"
            v-model="password"
            class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-light outline-none"
            required
          />
        </div>
        <button
          type="submit"
          class="w-full py-3 bg-primary-light text-white font-bold rounded-xl hover:bg-primary transition shadow-md"
        >
          Se connecter
        </button>

        <!-- Liens bas de formulaire -->
        <div class="flex justify-between text-sm mt-4">
          <router-link to="/forgot-password" class="text-primary-light hover:underline">
            Mot de passe oublié ?
          </router-link>
          <router-link to="/register" class="text-primary-light hover:underline">
            Pas encore de compte ? S’inscrire
          </router-link>
        </div>
      </form>

      <!-- Étape 2 : OTP -->
      <div v-else class="space-y-6">
        <div class="text-center">
          <h3 class="text-xl font-bold text-gray-800">
            Saisissez le code que nous vous avons envoyé par email
          </h3>
          <p class="text-gray-500 mt-2">{{ maskedEmail }}</p>
        </div>

        <!-- Cases OTP -->
        <div class="flex justify-center gap-2 sm:gap-3">
          <input
            v-for="(_, index) in 6"
            :key="index"
            :ref="(el) => otpInputs[index] = el"
            type="text"
            inputmode="numeric"
            maxlength="1"
            :value="otpValues[index]"
            @input="handleOtpInput(index, $event)"
            @keydown="handleKeydown(index, $event)"
            @paste="handlePaste"
            class="w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl outline-none transition-all duration-200"
            :class="{
              'border-primary-light ring-2 ring-primary-light': otpInputs[index] === document.activeElement,
              'border-gray-300 bg-gray-50': otpInputs[index] !== document.activeElement && !otpError,
              'border-red-500 bg-red-50': otpError && otpInputs[index] !== document.activeElement,
            }"
          />
        </div>

        <!-- Message d'erreur OTP -->
        <div v-if="otpError" class="text-center text-sm text-red-600">
          {{ otpError }}
        </div>

        <!-- Compte à rebours -->
        <p class="text-center text-sm text-gray-500">
          Code valable pendant <span class="font-mono font-bold">{{ formattedTime }}</span>
        </p>

        <!-- Bouton Envoyer -->
        <button
          @click="handleStep2"
          :disabled="!isOtpComplete"
          class="w-full py-3 rounded-xl font-bold transition shadow-md"
          :class="isOtpComplete ? 'bg-primary-light text-white hover:bg-primary' : 'bg-gray-200 text-gray-400 cursor-not-allowed'"
        >
          Envoyer
        </button>

        <!-- Lien Renvoyer (actif seulement après expiration) -->
        <div class="text-center">
          <button
            @click="resendOtp"
            :disabled="!isResendEnabled"
            class="text-sm font-semibold transition"
            :class="isResendEnabled ? 'text-primary-light hover:text-primary cursor-pointer' : 'text-gray-400 cursor-not-allowed'"
          >
            Renvoyer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>