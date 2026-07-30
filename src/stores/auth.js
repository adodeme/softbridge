import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/api/axios';
import router from '@/router';

export const useAuthStore = defineStore('auth', () => {
    const token = ref(localStorage.getItem('token') || null);
    const user = ref(JSON.parse(localStorage.getItem('user') || 'null'));

    const login = async (email, password) => {
        try {
            const response = await api.post('/login', { email, password });
            // Sauvegarde du token et de l'utilisateur dans localStorage
            token.value = response.data.access_token;
            user.value = response.data.user;
            localStorage.setItem('token', token.value);
            localStorage.setItem('user', JSON.stringify(user.value));

            // Redirection selon le rôle
            const role = user.value.role;
            if (role === 'client') router.push('/dashboard/client/accueil');
            else if (role === 'chef_projet') router.push('/dashboard/chef-projet/accueil');
            else if (role === 'administrateur') router.push('/dashboard/admin/accueil');

            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Erreur de connexion' };
        }
    };

    const logout = async () => {
        try {
            await api.post('/logout');
        } catch (e) {
            console.warn('Erreur lors de la déconnexion serveur', e);
        } finally {
            token.value = null;
            user.value = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            router.push('/login');
        }
    };

    return { user, token, login, logout };
});