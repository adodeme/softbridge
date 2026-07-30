<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api/axios';

const notifications = ref([]);

onMounted(async () => {
  try {
    // Marquer toutes les notifications comme lues
    await api.post('/notifications/mark-read');
    // Recharger la liste mise à jour
    const response = await api.get('/notifications');
    notifications.value = response.data;
    // Informer la navbar qu'elle doit rafraîchir son badge
    window.dispatchEvent(new Event('reloadNotifications'));
  } catch (error) {
    console.error('Erreur lors du marquage des notifications', error);
    // En cas d'erreur, essayer au moins de charger les notifications
    try {
      const res = await api.get('/notifications');
      notifications.value = res.data;
    } catch (e) {}
  }
});
</script>

<template>
  <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <h3 class="font-bold text-xl text-primary mb-4">Mes Notifications</h3>
    
    <div v-if="notifications.length === 0" class="text-gray-400 text-center py-4">
      Aucune notification.
    </div>

    <div v-for="notif in notifications" :key="notif.id" class="border-b border-gray-100 py-4 flex items-start gap-4">
      <div class="mt-1 text-primary-light">
        <i class="fas fa-bell"></i>
      </div>
      <div class="flex-1">
        <p class="text-sm text-gray-700 font-medium">{{ notif.message }}</p>
        <p class="text-xs text-gray-400 mt-1">{{ new Date(notif.date_envoi).toLocaleString() }}</p>
        <span v-if="!notif.lu" class="inline-block mt-1 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">Non lu</span>
        <span v-else class="inline-block mt-1 bg-gray-200 text-gray-500 text-[10px] px-2 py-0.5 rounded-full">Lu</span>
      </div>
    </div>
  </div>
</template>