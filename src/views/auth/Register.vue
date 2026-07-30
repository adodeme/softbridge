<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api/axios';

const route = useRoute();
const router = useRouter();
const form = ref({ nom: '', prenom: '', email: '', password: '', telephone: '' });
const errorMessage = ref('');

const handleRegister = async () => {
    try {
        await api.post('/register', form.value);
        const redirect = route.query.redirect || '/login';
        router.push(`/login?redirect=${encodeURIComponent(redirect)}`);
    } catch (error) {
        errorMessage.value = error.response?.data?.message || "Erreur lors de l'inscription";
    }
};
</script>

<template>
  <div class="max-w-lg mx-auto mt-10 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
    <h2 class="text-2xl font-bold text-center text-primary mb-6">Créer un compte</h2>
    <div v-if="errorMessage" class="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm border border-red-100">{{ errorMessage }}</div>
    <form @submit.prevent="handleRegister" class="space-y-3">
      <div class="grid grid-cols-2 gap-3">
        <div><input type="text" v-model="form.nom" placeholder="Nom" class="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-light outline-none" required></div>
        <div><input type="text" v-model="form.prenom" placeholder="Prénom" class="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-light outline-none" required></div>
      </div>
      <div><input type="email" v-model="form.email" placeholder="Email" class="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-light outline-none" required></div>
      <div><input type="password" v-model="form.password" placeholder="Mot de passe (6 caractères min)" class="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-light outline-none" required></div>
      <div><input type="text" v-model="form.telephone" placeholder="Numéro de téléphone" class="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-light outline-none"></div>
      <button type="submit" class="w-full py-3 mt-2 bg-primary text-white font-bold rounded-xl hover:bg-primary-light transition shadow-md">S'inscrire</button>
    </form>
    <p class="mt-4 text-center text-sm text-gray-500">Déjà un compte ? <router-link to="/login" class="text-primary-light font-semibold hover:underline">Se connecter</router-link></p>
  </div>
</template>