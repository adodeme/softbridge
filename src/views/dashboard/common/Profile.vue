<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api/axios';
import { useAuthStore } from '@/stores/auth';
import Swal from 'sweetalert2';

const authStore = useAuthStore();
const user = ref({});
const loading = ref(false);

onMounted(async () => {
  const res = await api.get('/profile');
  user.value = res.data;
});

const updateProfile = async () => {
  loading.value = true;
  try {
    await api.put('/profile', {
      nom: user.value.nom,
      prenom: user.value.prenom,
      telephone: user.value.telephone,
      email: user.value.email
    });
    Swal.fire('Succès', 'Profil mis à jour.', 'success');
  } catch (e) {
    Swal.fire('Erreur', e.response?.data?.message || 'Erreur', 'error');
  } finally {
    loading.value = false;
  }
};

const onPhotoChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const formData = new FormData();
  formData.append('photo', file);
  try {
    const res = await api.post('/profile/photo', formData);
    user.value.photo = res.data.photo;
    Swal.fire('Succès', 'Photo mise à jour.', 'success');
  } catch (e) {
    Swal.fire('Erreur', 'Impossible d\'uploader la photo.', 'error');
  }
};
</script>

<template>
  <div class="max-w-2xl mx-auto py-8 px-4">
    <h2 class="text-2xl font-bold text-primary mb-6">Mon Profil</h2>
    <div class="bg-white p-6 rounded-xl shadow-sm border">
      <!-- Photo de profil -->
      <div class="flex items-center gap-4 mb-6">
        <img v-if="user.photo" :src="user.photo" class="w-20 h-20 rounded-full object-cover border" />
        <div v-else class="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-2xl text-gray-400">
          <i class="fas fa-user"></i>
        </div>
        <label class="cursor-pointer text-primary-light hover:text-primary">
          <i class="fas fa-camera mr-2"></i> Changer la photo
          <input type="file" accept="image/*" @change="onPhotoChange" class="hidden" />
        </label>
      </div>

      <!-- Formulaire -->
      <form @submit.prevent="updateProfile" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div><label class="block text-sm font-medium text-gray-700">Nom</label><input v-model="user.nom" class="w-full border rounded-lg px-3 py-2" required></div>
          <div><label class="block text-sm font-medium text-gray-700">Prénom</label><input v-model="user.prenom" class="w-full border rounded-lg px-3 py-2" required></div>
        </div>
        <div><label class="block text-sm font-medium text-gray-700">Email</label><input type="email" v-model="user.email" class="w-full border rounded-lg px-3 py-2" required></div>
        <div><label class="block text-sm font-medium text-gray-700">Téléphone</label><input v-model="user.telephone" class="w-full border rounded-lg px-3 py-2"></div>
        <button type="submit" :disabled="loading" class="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-light transition">
          {{ loading ? 'Enregistrement...' : 'Enregistrer' }}
        </button>
      </form>
    </div>
  </div>
</template>