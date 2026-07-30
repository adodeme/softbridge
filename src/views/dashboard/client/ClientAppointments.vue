<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api/axios';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const appointments = ref([]);

onMounted(async () => {
    try {
        // Sécurité : on vérifie que l'utilisateur est bien connecté
        if (!authStore.user || !authStore.user.id) {
            console.error('Utilisateur non trouvé');
            return;
        }

        // L'API renvoie maintenant uniquement les rendez-vous du client connecté
        const res = await api.get('/appointments');
        appointments.value = res.data; // Plus besoin de filtrer !
        
    } catch (e) {
        console.error('Erreur lors du chargement des rendez-vous', e);
    }
});
</script>

<template>
  <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <h3 class="font-bold text-xl text-primary mb-4">Mes Rendez-vous</h3>
    
    <div v-if="appointments.length === 0" class="text-gray-400 text-center py-4">
      Aucun rendez-vous pris.
    </div>

    <div v-for="rdv in appointments" :key="rdv.id" class="border-b border-gray-100 py-4 flex justify-between items-center">
      <div>
        <p class="font-medium text-gray-800">{{ rdv.date }} à {{ rdv.heure_debut }}</p>
        <p class="text-sm text-gray-500">Durée : {{ rdv.duree }} minutes</p>
      </div>
      <span 
        class="px-2 py-1 text-xs font-bold rounded-full"
        :class="{
          'bg-yellow-100 text-yellow-700': rdv.statut === 'en_attente',
          'bg-green-100 text-green-700': rdv.statut === 'valide'
        }"
      >
        {{ rdv.statut.toUpperCase() }}
      </span>
    </div>
  </div>
</template>