<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api/axios';
import { useAuthStore } from '@/stores/auth';
import Swal from 'sweetalert2';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const software = ref(null);
const selectedLicense = ref(null);

onMounted(async () => {
  try {
    const response = await api.get('/catalog/' + route.params.id);
    software.value = response.data;
    if (software.value.licenses?.length) {
      selectedLicense.value = software.value.licenses[0];
    }
  } catch (error) {
    console.error('Erreur chargement logiciel', error);
  }
});

const subscribe = async () => {
  if (!authStore.token) {
    return router.push(`/login?redirect=${route.fullPath}`);
  }
  try {
    const res = await api.post('/subscriptions', { license_id: selectedLicense.value.id });
    Swal.fire({ icon: 'success', title: 'Abonnement initié !', text: 'Veuillez procéder au paiement dans votre tableau de bord.', confirmButtonColor: '#1572E8' });
    router.push('/dashboard/client/invoices');
  } catch (error) {
    Swal.fire({ icon: 'error', title: 'Erreur', text: error.response?.data?.message || 'Une erreur est survenue.' });
  }
};
</script>

<template>
  <div class="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <div v-if="!software" class="text-center py-20 text-gray-500">
      <i class="fas fa-spinner fa-spin text-4xl text-primary-light"></i>
      <p class="mt-4">Chargement du logiciel...</p>
    </div>

    <div v-else class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      <div class="h-72 sm:h-96 w-full overflow-hidden bg-gray-100">
        <img
          v-if="software.capture_url"
          :src="software.capture_url"
          :alt="software.nom"
          class="w-full h-full object-cover"
        />
        <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
          <i class="fas fa-image text-6xl"></i>
        </div>
      </div>

      <div class="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div class="lg:col-span-2">
          <h1 class="text-3xl font-bold text-primary mb-4">{{ software.nom }}</h1>
          
          <div class="prose prose-lg max-w-none text-gray-700 mb-8">
            <p class="text-lg leading-relaxed">{{ software.description }}</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            <div class="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              <i class="fas fa-check-circle text-green-500 text-xl mt-0.5"></i>
              <div>
                <h4 class="font-semibold text-gray-800">Mises à jour incluses</h4>
                <p class="text-sm text-gray-500">Profitez des dernières améliorations en continu.</p>
              </div>
            </div>
            <div class="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              <i class="fas fa-headset text-primary-light text-xl mt-0.5"></i>
              <div>
                <h4 class="font-semibold text-gray-800">Support prioritaire</h4>
                <p class="text-sm text-gray-500">Assistance réactive pour toutes vos questions.</p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h2 class="text-xl font-bold text-gray-800 mb-4">Formules d'abonnement</h2>
          
          <div class="space-y-3">
            <div
              v-for="lic in software.licenses"
              :key="lic.id"
              @click="selectedLicense = lic"
              :class="[
                'border-2 rounded-xl p-4 cursor-pointer transition-all duration-200',
                selectedLicense?.id === lic.id
                  ? 'border-primary-light bg-blue-50 shadow-sm'
                  : 'border-gray-200 hover:border-primary-light'
              ]"
            >
              <p class="font-bold text-gray-800 text-lg">{{ lic.type.toUpperCase() }}</p>
              <p class="text-primary text-2xl font-bold mt-2">{{ lic.prix.toLocaleString() }} FCFA</p>
              <p class="text-xs text-gray-500 mt-1">Durée : {{ lic.duree }} jours</p>
            </div>
          </div>

          <button
            @click="subscribe"
            class="w-full mt-6 bg-primary-light text-white py-3 rounded-xl font-bold hover:bg-primary transition-colors shadow-md flex items-center justify-center gap-2"
          >
            <i class="fas fa-shopping-cart"></i> S'abonner
          </button>
          
          <p v-if="!authStore.token" class="text-center text-xs text-gray-500 mt-3">
            * Connexion requise pour finaliser l'abonnement.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>