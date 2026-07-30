<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api/axios';
import Swal from 'sweetalert2';

const softwares = ref([]);
const isLoading = ref(true);
const errorMessage = ref('');
const showModal = ref(false);
const isEdit = ref(false);

const form = ref({
  id: null,
  nom: '',
  description: '',
  categorie: '',
  capture: null,
  preview: null
});

const loadData = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    const res = await api.get('/catalog', {
      headers: { 'Cache-Control': 'no-cache' }
    });
    softwares.value = res.data;
    console.log('✅ Logiciels chargés :', softwares.value);
  } catch (e) {
    console.error('❌ Erreur chargement catalogue :', e);
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
    console.log('📸 Image sélectionnée :', file.name, file.type, file.size);
  }
};

const openModal = (sw = null) => {
  isEdit.value = !!sw;
  if (sw) {
    form.value = {
      id: sw.id,
      nom: sw.nom,
      description: sw.description,
      categorie: sw.categorie,
      capture: null,
      preview: sw.capture ? `http://localhost:8000/storage/${sw.capture}` : null
    };
  } else {
    form.value = {
      id: null,
      nom: '',
      description: '',
      categorie: '',
      capture: null,
      preview: null
    };
  }
  showModal.value = true;
};

const saveSoftware = async () => {
  try {
    const formData = new FormData();
    formData.append('nom', form.value.nom);
    formData.append('description', form.value.description);
    formData.append('categorie', form.value.categorie);
    if (form.value.capture) {
      formData.append('capture', form.value.capture);
    }

    console.log('📤 Envoi du FormData avec les champs :');
    for (let [key, val] of formData.entries()) {
      console.log('   -', key, ':', val);
    }

    let response;
    if (isEdit.value) {
      formData.append('_method', 'PUT');
      response = await api.post(`/catalog/${form.value.id}`, formData);
    } else {
      response = await api.post('/catalog', formData);
    }

    showModal.value = false;
    await loadData();
    Swal.fire({ icon: 'success', title: isEdit.value ? 'Logiciel modifié' : 'Logiciel ajouté', timer: 2000 });
  } catch (e) {
    console.error('❌ Erreur saveSoftware :', e);
    let errorMsg = 'Erreur lors de l\'enregistrement.';
    if (e.response && e.response.data) {
      if (e.response.data.errors) {
        const firstKey = Object.keys(e.response.data.errors)[0];
        errorMsg = e.response.data.errors[firstKey][0];
      } else if (e.response.data.message) {
        errorMsg = e.response.data.message;
      }
    }
    Swal.fire({ icon: 'error', title: 'Erreur', text: errorMsg });
  }
};

const deleteSoftware = async (id) => {
  const firstConfirm = await Swal.fire({
    title: 'Supprimer ce logiciel ?',
    text: "Cette action est irréversible.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#6b7280'
  });

  if (!firstConfirm.isConfirmed) return;

  try {
    // Premier essai sans force
    await api.delete(`/catalog/${id}`);
    console.log(`✅ Logiciel ${id} supprimé avec succès.`);
    await loadData();
    Swal.fire('Supprimé !', 'Le logiciel a été supprimé.', 'success');

  } catch (error) {
    // Cas où le backend bloque à cause de licences actives (409)
    if (error.response?.status === 409) {
      const licenses = error.response.data.active_licenses || [];

      const listHtml = licenses.map(l =>
        `<li>${l.type} — ${l.duree} jours — ${l.prix} FCFA</li>`
      ).join('');

      const forceConfirm = await Swal.fire({
        title: 'Licences actives détectées',
        html: `
          <p>Ce logiciel possède <strong>${licenses.length}</strong> licence(s) active(s) :</p>
          <ul style="text-align:left; margin-top:10px;">${listHtml}</ul>
          <p style="margin-top:10px;">Voulez-vous vraiment supprimer le logiciel <strong>et</strong> ces licences ?</p>
        `,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui, tout supprimer',
        cancelButtonText: 'Annuler',
        confirmButtonColor: '#d33',
        cancelButtonColor: '#6b7280'
      });

      if (forceConfirm.isConfirmed) {
        try {
          await api.delete(`/catalog/${id}`, { params: { force: true } });
          console.log(`✅ Logiciel ${id} supprimé avec licences actives.`);
          await loadData();
          Swal.fire('Supprimé !', 'Le logiciel et ses licences ont été supprimés.', 'success');
        } catch (forceError) {
          console.error('❌ Erreur lors de la suppression forcée :', forceError);
          Swal.fire('Erreur', forceError.response?.data?.error || 'Erreur lors de la suppression.', 'error');
        }
      }

    } else {
      console.error('❌ Erreur lors de la suppression :', error);
      Swal.fire('Erreur', error.response?.data?.error || 'Erreur lors de la suppression.', 'error');
    }
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

    <div v-else class="overflow-x-auto border border-gray-200 rounded-lg">
      <table class="w-full text-sm text-left">
        <thead class="bg-gray-50 text-gray-600 border-b border-gray-200">
          <tr>
            <th class="px-6 py-3">Logiciel</th>
            <th class="px-6 py-3">Catégorie</th>
            <th class="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="sw in softwares" :key="sw.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 flex items-center gap-3">
              <img v-if="sw.capture" :src="'http://localhost:8000/storage/' + sw.capture" class="w-12 h-12 object-cover rounded border" />
              <div>
                <p class="font-medium text-gray-800">{{ sw.nom }}</p>
                <p class="text-xs text-gray-500">{{ sw.description }}</p>
              </div>
            </td>
            <td class="px-6 py-4 text-gray-600">{{ sw.categorie }}</td>
            <td class="px-6 py-4 flex gap-2">
              <button @click="openModal(sw)" class="text-primary-light hover:text-primary font-semibold text-sm transition-colors flex items-center gap-1">
                <i class="fas fa-pen"></i> Modifier
              </button>
              <button @click="deleteSoftware(sw.id)" class="text-red-500 hover:text-red-700 font-semibold text-sm transition-colors flex items-center gap-1">
                <i class="fas fa-trash-can"></i> Supprimer
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- MODALE AJOUT / MODIFICATION -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="showModal = false">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        <div class="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
          <h3 class="text-xl font-bold text-gray-800 flex items-center gap-2">
            <i class="fas fa-cube text-primary-light"></i> 
            {{ isEdit ? 'Modifier le logiciel' : 'Ajouter un logiciel' }}
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
            <label class="block text-sm font-semibold text-gray-700 mb-1">Capture d'écran (image)</label>
            <input type="file" @change="onFileChange" accept="image/*" class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-light focus:outline-none">
            <div v-if="form.preview" class="mt-2">
              <img :src="form.preview" class="h-20 w-auto object-cover rounded border" />
            </div>
          </div>
          <div class="flex gap-3 mt-6 pt-4 border-t border-gray-100">
            <button type="button" @click="showModal = false" class="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition">
              Annuler
            </button>
            <button type="submit" class="flex-1 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-light transition shadow-sm">
              {{ isEdit ? 'Enregistrer les modifications' : 'Ajouter le logiciel' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>