<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api/axios';
import Swal from 'sweetalert2';

const clients = ref([]);
const showModal = ref(false);
const newClient = ref({
  nom: '',
  prenom: '',
  email: '',
  telephone: '',
  nom_entreprise: ''
});

// Chargement des clients
const loadClients = async () => {
  try {
    clients.value = (await api.get('/clients')).data;
  } catch (e) {
    console.error('Erreur chargement clients', e);
  }
};

// Création d'un client
const createClient = async () => {
  try {
    const response = await api.post('/clients', newClient.value);
    showModal.value = false;
    
    // Réinitialisation du formulaire
    newClient.value = { nom: '', prenom: '', email: '', telephone: '', nom_entreprise: '' };
    await loadClients();

    // Affichage du mot de passe généré pour le Chef
    Swal.fire({
      icon: 'success',
      title: 'Client créé avec succès !',
      text: `Mot de passe généré pour le client : ${response.data.generated_password}`,
      confirmButtonColor: '#1572E8'
    });
  } catch (e) {
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: e.response?.data?.message || 'Erreur lors de la création du client'
    });
  }
};

onMounted(loadClients);
</script>

<template>
  <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <div class="flex justify-between items-center mb-6">
      <h3 class="font-bold text-xl text-primary">Mes Clients</h3>
      <button 
        @click="showModal = true" 
        class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light transition"
      >
        <i class="fas fa-plus mr-2"></i> Ajouter un client
      </button>
    </div>

    <div v-if="clients.length === 0" class="text-gray-400 text-center py-4">
      Aucun client enregistré.
    </div>

    <div v-for="client in clients" :key="client.id" class="border-b border-gray-100 py-3 flex justify-between items-center">
      <div>
        <h4 class="font-bold text-gray-800">{{ client.nom_entreprise }}</h4>
        <p class="text-sm text-gray-600">{{ client.user?.prenom }} {{ client.user?.nom }} - {{ client.user?.email }}</p>
      </div>
      <span class="text-xs text-gray-500">#{{ client.numero_client }}</span>
    </div>

    <!-- MODALE AJOUTER CLIENT -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="showModal = false">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <h3 class="text-xl font-bold text-gray-800 mb-4">Ajouter un client</h3>
        <form @submit.prevent="createClient" class="space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <input type="text" v-model="newClient.nom" placeholder="Nom" class="w-full border rounded-lg px-3 py-2" required>
            <input type="text" v-model="newClient.prenom" placeholder="Prénom" class="w-full border rounded-lg px-3 py-2" required>
          </div>
          <input type="email" v-model="newClient.email" placeholder="Email" class="w-full border rounded-lg px-3 py-2" required>
          <input type="text" v-model="newClient.telephone" placeholder="Téléphone" class="w-full border rounded-lg px-3 py-2">
          <input type="text" v-model="newClient.nom_entreprise" placeholder="Nom de l'entreprise" class="w-full border rounded-lg px-3 py-2" required>
          <div class="flex gap-3 mt-4">
            <button type="button" @click="showModal = false" class="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg">Annuler</button>
            <button type="submit" class="flex-1 py-2 bg-primary text-white rounded-lg">Enregistrer</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>