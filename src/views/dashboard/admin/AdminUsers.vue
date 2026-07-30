<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api/axios';
import { useAuthStore } from '@/stores/auth';
import Swal from 'sweetalert2';

const authStore = useAuthStore();
const users = ref([]);
const showModal = ref(false);
const isEdit = ref(false);
const form = ref({ id: null, nom: '', prenom: '', email: '', telephone: '', role: 'client', password: '' });

// Charger la liste des utilisateurs
const loadUsers = async () => {
  try { users.value = (await api.get('/users')).data; } catch (e) { console.error(e); }
};

// Ouvrir la modale (Ajout ou Modification)
const openModal = (user = null) => {
  isEdit.value = !!user;
  form.value = user 
    ? { ...user, password: '' } 
    : { id: null, nom: '', prenom: '', email: '', telephone: '', role: 'client', password: '' };
  showModal.value = true;
};

// Enregistrer l'utilisateur (Création ou Modification)
const saveUser = async () => {
  try {
    if (isEdit.value) {
      await api.put(`/users/${form.value.id}`, form.value);
    } else {
      await api.post('/users', form.value);
    }
    showModal.value = false;
    await loadUsers();
    Swal.fire({ icon: 'success', title: isEdit.value ? 'Utilisateur modifié' : 'Utilisateur créé', timer: 2000 });
  } catch (e) {
    Swal.fire({ icon: 'error', title: 'Erreur', text: e.response?.data?.message || 'Erreur lors de l\'enregistrement' });
  }
};

// Supprimer un utilisateur
const deleteUser = async (id) => {
  const result = await Swal.fire({ 
    title: 'Supprimer cet utilisateur ?', 
    text: "Cette action est irréversible.", 
    icon: 'warning', 
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#6b7280'
  });
  if (result.isConfirmed) { 
    await api.delete(`/users/${id}`); 
    await loadUsers(); 
    Swal.fire('Supprimé !', 'L\'utilisateur a été supprimé.', 'success');
  }
};

onMounted(loadUsers);
</script>

<template>
  <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 -h-[400px]">
    
    <!-- En-tête avec bouton d'ajout -->
    <div class="flex flex-col sm:flex-row justify-between items-center mb-6">
      <h3 class="text-2xl font-bold text-primary mb-4 sm:mb-0 flex items-center gap-2">
        <i class="fas fa-users-gear text-primary-light"></i> Gestion des utilisateurs
      </h3>
      <button 
        @click="openModal()" 
        class="bg-primary text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-light transition shadow-sm flex items-center gap-2"
      >
        <i class="fas fa-plus"></i> Ajouter un utilisateur
      </button>
    </div>

    <!-- Tableau des utilisateurs -->
    <div class="overflow-x-auto rounded-lg border border-gray-200">
      <table class="w-full text-sm text-left">
        <thead class="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
          <tr>
            <th class="px-6 py-3">Utilisateur</th>
            <th class="px-6 py-3">Email</th>
            <th class="px-6 py-3">Rôle</th>
            <th class="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="u in users" :key="u.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 font-medium text-gray-800">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-blue-100 text-primary flex items-center justify-center text-sm font-bold">
                  {{ u.prenom?.charAt(0) }}{{ u.nom?.charAt(0) }}
                </div>
                <span>{{ u.prenom }} {{ u.nom }}</span>
              </div>
            </td>
            <td class="px-6 py-4 text-gray-600">{{ u.email }}</td>
            <td class="px-6 py-4">
              <span 
                class="px-3 py-1 text-xs font-bold rounded-full inline-block"
                :class="{
                  'bg-blue-100 text-blue-700': u.role === 'client',
                  'bg-orange-100 text-orange-700': u.role === 'chef_projet',
                  'bg-purple-100 text-purple-700': u.role === 'administrateur'
                }"
              >
                {{ u.role === 'client' ? 'Client' : u.role === 'chef_projet' ? 'Chef de Projet' : 'Administrateur' }}
              </span>
            </td>
            <td class="px-6 py-4 text-right flex justify-end gap-2">
              <button 
                @click="openModal(u)" 
                class="text-primary-light hover:text-primary font-semibold text-sm transition-colors flex items-center gap-1"
              >
                <i class="fas fa-pen"></i> Modifier
              </button>
              <button 
                  v-if="authStore.user && u.id !== authStore.user.id" 
                  @click="deleteUser(u.id)" 
                  class="text-red-500 hover:text-red-700 font-semibold text-sm transition-colors flex items-center gap-1"
              >
                  <i class="fas fa-trash-can"></i> Supprimer
              </button>
            </td>
          </tr>
          <tr v-if="users.length === 0">
            <td colspan="4" class="px-6 py-8 text-center text-gray-500">
              <i class="fas fa-user-slash text-3xl block mb-2 text-gray-300"></i>
              Aucun utilisateur trouvé.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- MODALE AJOUT / MODIFICATION UTILISATEUR -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="showModal = false">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all scale-100">
        
        <div class="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
          <h3 class="text-xl font-bold text-gray-800 flex items-center gap-2">
            <i class="fas fa-user-cog text-primary-light"></i> 
            {{ isEdit ? 'Modifier l\'utilisateur' : 'Créer un utilisateur' }}
          </h3>
          <button @click="showModal = false" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        <form @submit.prevent="saveUser" class="space-y-5">
          <!-- Nom et Prénom -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Nom</label>
              <input type="text" v-model="form.nom" placeholder="Nom" class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-light focus:outline-none" required>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Prénom</label>
              <input type="text" v-model="form.prenom" placeholder="Prénom" class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-light focus:outline-none" required>
            </div>
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input type="email" v-model="form.email" placeholder="exemple@email.com" class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-light focus:outline-none" required>
          </div>

          <!-- Téléphone -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Téléphone</label>
            <input type="text" v-model="form.telephone" placeholder="+229 00 00 00 00" class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-light focus:outline-none">
          </div>

          <!-- Mot de passe -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">
              Mot de passe <span v-if="!isEdit" class="text-red-500">*</span>
              <span v-else class="text-xs text-gray-400 font-normal">(Laissez vide pour conserver l'actuel)</span>
            </label>
            <input type="password" v-model="form.password" placeholder="••••••••" class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-light focus:outline-none" :required="!isEdit">
          </div>

          <!-- Rôle -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Rôle</label>
            <select v-model="form.role" class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-light focus:outline-none bg-white">
              <option value="client">Client</option>
              <option value="chef_projet">Chef de Projet</option>
              <option value="administrateur">Administrateur</option>
            </select>
          </div>

          <!-- Boutons d'action -->
          <div class="flex gap-3 mt-8 pt-4 border-t border-gray-100">
            <button type="button" @click="showModal = false" class="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition">
              Annuler
            </button>
            <button type="submit" class="flex-1 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-light transition shadow-sm">
              {{ isEdit ? 'Enregistrer les modifications' : 'Créer l\'utilisateur' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>