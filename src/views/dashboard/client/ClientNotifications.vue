<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api/axios';
import LoadingSpinner from '@/components/LoadingSpinner.vue';

const notifications = ref([]);
const isLoading = ref(true);

const loadNotifications = async () => {
  try {
    const res = await api.get('/notifications');
    notifications.value = res.data;
  } catch (e) {
    console.error('Erreur chargement notifications', e);
  } finally {
    isLoading.value = false;
  }
};

const markAsRead = async (notification) => {
  try {
    await api.post(`/notifications/${notification.id}/mark-read`);
    notification.lu = true;
  } catch (e) {
    console.error('Erreur marquage notification', e);
  }
};

const markAllAsRead = async () => {
  try {
    await api.post('/notifications/mark-read');
    notifications.value.forEach(n => n.lu = true);
  } catch (e) {
    console.error('Erreur marquage global', e);
  }
};

onMounted(loadNotifications);
</script>

<template>
  <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-bold text-xl text-primary">Mes Notifications</h3>
      <button @click="markAllAsRead" class="text-sm text-primary-light hover:underline">Tout marquer lu</button>
    </div>

    <LoadingSpinner v-if="isLoading" />

    <div v-else-if="notifications.length === 0" class="text-gray-400 text-center py-4">Aucune notification.</div>

    <div v-else class="space-y-2">
      <div v-for="notif in notifications" :key="notif.id"
           class="border-b border-gray-100 py-3 flex items-start gap-3 cursor-pointer"
           :class="notif.lu ? 'opacity-60' : ''"
           @click="markAsRead(notif)">
        <div class="mt-1 text-primary-light"><i class="fas fa-bell"></i></div>
        <div class="flex-1">
          <p class="text-sm text-gray-700 font-medium">{{ notif.message }}</p>
          <p class="text-xs text-gray-400 mt-1">{{ new Date(notif.date_envoi).toLocaleString() }}</p>
          <span v-if="!notif.lu" class="inline-block mt-1 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">Non lu</span>
        </div>
      </div>
    </div>
  </div>
</template>