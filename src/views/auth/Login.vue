<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

const email = ref('');
const password = ref('');
const authStore = useAuthStore();
const errorMessage = ref('');

const handleLogin = async () => {
    const result = await authStore.login(email.value, password.value);
    if (!result.success) {
        errorMessage.value = result.message;
    }
    // Le store s'occupe de la redirection, on ne fait rien ici !
};
</script>

<template>
  <div class="max-w-md mx-auto mt-10 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
    <h2 class="text-2xl font-bold text-center text-primary mb-6">Connexion</h2>
    <div v-if="errorMessage" class="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm border border-red-100">{{ errorMessage }}</div>
    <form @submit.prevent="handleLogin" class="space-y-4">
      <div><label class="block text-sm font-semibold text-gray-700 mb-1">Adresse Email</label><input type="email" v-model="email" class="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-light outline-none" required></div>
      <div><label class="block text-sm font-semibold text-gray-700 mb-1">Mot de passe</label><input type="password" v-model="password" class="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-light outline-none" required></div>
      <button type="submit" class="w-full py-3 mt-2 bg-primary-light text-white font-bold rounded-xl hover:bg-primary transition shadow-md">Se connecter</button>
    </form>
    <p class="mt-4 text-center text-sm text-gray-500">Pas encore de compte ? <router-link to="/register" class="text-primary-light font-semibold hover:underline">S'inscrire</router-link></p>
    <p class="mt-4 text-center text-sm text-gray-500">
      <router-link to="/forgot-password" class="text-primary-light hover:underline">Mot de passe oublié ?</router-link>
    </p>
  </div>
</template>