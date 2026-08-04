<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api/axios';
import Swal from 'sweetalert2';

const softwares = ref([]);
const isLoading = ref(true);
const errorMessage = ref('');
const showModal = ref(false);

const form = ref({
  id: null,
  nom: '',
  description: '',
  categorie: '',
  url: '',
  capture: null,
  preview: null,
  license_mensuelle_prix: 0,
  license_trimestrielle_prix: 0,
  license_annuelle_prix: 0
});

const loadData = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    const res = await api.get('/catalog');
    softwares.value = res.data;
  } catch (e) {
    errorMessage.value = 'Impossible de charger le catalogue.';
  } finally {
    isLoading.value = false;
  }
};

const onFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    form.value.capture = file;
    form.value.preview = URL.createObjectURL(file);
  }
};

const openModal = () => {
  // Réinitialiser le formulaire pour l'ajout
  form.value = {
    id: null,
    nom: '',
    description: '',
    categorie: '',
    url: '',
    capture: null,
    preview: null,
    license_mensuelle_prix: 0,
    license_trimestrielle_prix: 0,
    license_annuelle_prix: 0
  };
  showModal.value = true;
};

const saveSoftware = async () => {
  try {
    const formData = new FormData();
    formData.append('nom', form.value.nom);
    formData.append('description', form.value.description);
    formData.append('categorie', form.value.categorie);
    formData.append('url', form.value.url);
    if (form.value.capture) {
      formData.append('capture', form.value.capture);
    }

    const licenses = [];
    if (form.value.license_mensuelle_prix > 0) {
      licenses.push({ type: 'mensuelle', duree: 30, prix: form.value.license_mensuelle_prix });
    }
    if (form.value.license_trimestrielle_prix > 0) {
      licenses.push({ type: 'trimestrielle', duree: 90, prix: form.value.license_trimestrielle_prix });
    }
    if (form.value.license_annuelle_prix > 0) {
      licenses.push({ type: 'annuelle', duree: 365, prix: form.value.license_annuelle_prix });
    }
    formData.append('licenses', JSON.stringify(licenses));

    await api.post('/catalog', formData);

    showModal.value = false;
    await loadData();
    Swal.fire({ icon: 'success', title: 'Logiciel ajouté', timer: 2000 });
  } catch (e) {
      let errorMsg = 'Erreur lors de l\'enregistrement.';
      if (e.response?.data?.errors) {
          const firstKey = Object.keys(e.response.data.errors)[0];
          errorMsg = e.response.data.errors[firstKey][0];
      } else if (e.response?.data?.message) {
          errorMsg = e.response.data.message;
      } else if (e.message) {
          errorMsg = e.message;  // <-- ajout pour les erreurs réseau
      }
      Swal.fire({ icon: 'error', title: 'Erreur', text: errorMsg });
  }
};

onMounted(loadData);
</script>

<template>
  <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[400px]">
    <div class="flex flex-col sm:flex-row justify-between items-center mb-6">
      <h3 class="text-2xl font-bold text-primary mb-4 sm:mb-0 flex items-center gap-2">
        <i class="fas fa-cubes text-primary-light"></i> Gestion du catalogue
      </h3>
      <button @click="openModal()" class="bg-primary text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-light transition shadow-sm flex items-center gap-2">
        <i class="fas fa-plus"></i> Ajouter un logiciel
      </button>
    </div>

    <!-- Chargement / Erreur / Vide -->
    <div v-if="isLoading" class="text-center py-10 text-gray-500">
      <i class="fas fa-spinner fa-spin text-3xl text-primary-light"></i>
      <p class="mt-2">Chargement...</p>
    </div>

    <div v-else-if="errorMessage" class="bg-red-50 text-red-600 p-4 rounded-lg mb-4 border border-red-200">
      {{ errorMessage }}
    </div>

    <div v-else-if="softwares.length === 0" class="text-gray-400 text-center py-10 flex flex-col items-center gap-2">
      <i class="fas fa-box-open text-5xl text-gray-300"></i>
      <p>Aucun logiciel dans le catalogue.</p>
    </div>

    <!-- Tableau sans colonne Actions -->
    <div v-else class="overflow-x-auto border border-gray-200 rounded-lg">
      <table class="w-full text-sm text-left">
        <thead class="bg-gray-50 text-gray-600 border-b border-gray-200">
          <tr>
            <th class="px-6 py-3">Logiciel</th>
            <th class="px-6 py-3">Catégorie</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="sw in softwares" :key="sw.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 flex items-center gap-3">
              <img v-if="sw.capture_url" :src="sw.capture_url" class="w-12 h-12 object-cover rounded border" />
              <div v-else class="w-12 h-12 bg-gray-200 rounded border flex items-center justify-center text-gray-400">
                <i class="fas fa-image"></i>
              </div>
              <div>
                <p class="font-medium text-gray-800">{{ sw.nom }}</p>
                <p class="text-xs text-gray-500">{{ sw.description }}</p>
              </div>
            </td>
            <td class="px-6 py-4 text-gray-600">{{ sw.categorie }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- MODALE AJOUT -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="showModal = false">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
          <h3 class="text-xl font-bold text-gray-800 flex items-center gap-2">
            <i class="fas fa-cube text-primary-light"></i> Ajouter un logiciel
          </h3>
          <button @click="showModal = false" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        <form @submit.prevent="saveSoftware" class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Nom du logiciel</label>
            <input type="text" v-model="form.nom" class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-light focus:outline-none" required>
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Description</label>
            <textarea v-model="form.description" class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-light focus:outline-none" rows="3" required></textarea>
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Catégorie</label>
            <input type="text" v-model="form.categorie" class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-light focus:outline-none" required>
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">URL d'accès (optionnel)</label>
            <input type="url" v-model="form.url" class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-light focus:outline-none">
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Capture d'écran (image)</label>
            <input type="file" @change="onFileChange" accept="image/*" class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-light focus:outline-none">
            <div v-if="form.preview" class="mt-2">
              <img :src="form.preview" class="h-20 w-auto object-cover rounded border" />
            </div>
          </div>

          <!-- Formules d'abonnement -->
          <div class="border-t pt-4 mt-4">
            <h4 class="font-bold text-gray-800 mb-3">Formules d'abonnement (prix en FCFA)</h4>
            <div class="grid grid-cols-3 gap-3">
              <div>
                <label class="text-xs text-gray-600">Mensuelle</label>
                <input type="number" v-model.number="form.license_mensuelle_prix" min="0" step="1000" class="w-full border rounded px-2 py-1 text-sm">
              </div>
              <div>
                <label class="text-xs text-gray-600">Trimestrielle</label>
                <input type="number" v-model.number="form.license_trimestrielle_prix" min="0" step="1000" class="w-full border rounded px-2 py-1 text-sm">
              </div>
              <div>
                <label class="text-xs text-gray-600">Annuelle</label>
                <input type="number" v-model.number="form.license_annuelle_prix" min="0" step="1000" class="w-full border rounded px-2 py-1 text-sm">
              </div>
            </div>
            <p class="text-xs text-gray-400 mt-2">Laissez 0 ou vide pour ne pas proposer cette formule.</p>
          </div>

          <div class="flex gap-3 mt-6 pt-4 border-t border-gray-100">
            <button type="button" @click="showModal = false" class="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition">
              Annuler
            </button>
            <button type="submit" class="flex-1 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-light transition shadow-sm">
              Ajouter le logiciel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>