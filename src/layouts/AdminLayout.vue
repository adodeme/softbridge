<script setup>
import AdminSidebar from '@/components/AdminSidebar.vue';
import { ref } from 'vue';

const sidebarOpen = ref(false);
</script>

<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden">
    <!-- Sidebar desktop (visible sur md et plus) -->
    <AdminSidebar class="hidden md:flex" />
    
    <!-- Overlay + sidebar mobile -->
    <div v-if="sidebarOpen" class="fixed inset-0 z-40 md:hidden">
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="sidebarOpen = false"></div>
      <div class="relative z-50 w-64 h-full bg-white" @click.stop>
        <AdminSidebar />
      </div>
    </div>

    <div class="flex-1 flex flex-col h-screen overflow-hidden">
      <main class="flex-1 overflow-y-auto p-6 pt-20 md:pt-6">
        <!-- Bouton d'ouverture sidebar mobile -->
        <button @click="sidebarOpen = !sidebarOpen" class="md:hidden fixed top-4 left-4 z-50 bg-primary text-white p-2 rounded-lg shadow-lg">
          <i class="fas fa-bars"></i>
        </button>
        <router-view />
      </main>
    </div>
  </div>
</template>