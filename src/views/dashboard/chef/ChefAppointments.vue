<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api/axios';

const appointments = ref([]);

onMounted(async () => {
  try {
    appointments.value = (await api.get('/appointments')).data;
  } catch (e) {
    console.error('Erreur chargement rendez-vous', e);
  }
});
</script>

<template>
  <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <div class="flex items-center gap-2 mb-6">
      <i class="fas fa-calendar-check text-2xl text-primary-light"></i>
      <h3 class="text-2xl font-bold text-primary">Tous les rendez-vous</h3>
    </div>

    <!-- État vide -->
    <div v-if="appointments.length === 0" class="text-center py-12 text-gray-400">
      <i class="fas fa-calendar-xmark text-5xl mb-3 block text-gray-300"></i>
      <p>Aucun rendez-vous pour le moment.</p>
    </div>

    <!-- Liste des rendez-vous -->
    <div class="space-y-4">
      <div v-for="rdv in appointments" :key="rdv.id"
           class="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-primary-light transition-colors duration-200">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <!-- Informations -->
          <div class="flex items-start gap-3">
            <div class="mt-1 w-10 h-10 rounded-full bg-primary-light/10 flex items-center justify-center text-primary-light flex-shrink-0">
              <i class="fas fa-user"></i>
            </div>
            <div>
              <p class="font-semibold text-gray-800">
                {{ rdv.user?.prenom || rdv.guest_prenom }} {{ rdv.user?.nom || rdv.guest_nom }}
              </p>
              <div class="flex items-center gap-2 text-sm text-gray-500 mt-1">
                <i class="far fa-calendar-alt text-xs"></i>
                <span>{{ rdv.date }}</span>
                <i class="far fa-clock text-xs ml-2"></i>
                <span>{{ rdv.heure_debut }}</span>
                <span class="text-gray-400">({{ rdv.duree }} min)</span>
              </div>
            </div>
          </div>

          <!-- Statut -->
          <div class="flex items-center gap-2">
            <span class="px-3 py-1.5 text-xs font-bold rounded-full"
                  :class="{
                    'bg-yellow-100 text-yellow-700 border border-yellow-200': rdv.statut === 'valide',
                    'bg-blue-100 text-blue-700 border border-blue-200': rdv.statut === 'en_attente',
                    'bg-green-100 text-green-700 border border-green-200': rdv.statut === 'termine',
                  }">
              {{ rdv.statut.toUpperCase() }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>