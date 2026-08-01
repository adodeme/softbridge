<script setup>
import AppNavbar from '@/components/AppNavbar.vue';
import ChefProjectSidebar from '@/components/ChefProjectSidebar.vue';
import { ref } from 'vue';

const sidebarOpen = ref(false);
</script>

<template>
  <div class="flex flex-col h-screen bg-gray-50 overflow-hidden">
    <AppNavbar />

    <div class="flex flex-1 overflow-hidden">
      <ChefProjectSidebar class="hidden md:flex" />

      <div v-if="sidebarOpen" class="fixed inset-0 z-40 md:hidden">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="sidebarOpen = false"></div>
        <div class="relative z-50 w-64 h-full bg-white overflow-y-auto" @click.stop>
          <ChefProjectSidebar />
        </div>
      </div>

      <div class="flex-1 flex flex-col overflow-hidden">
        <main class="flex-1 overflow-y-auto p-6">
          <button @click="sidebarOpen = !sidebarOpen" class="md:hidden fixed top-20 right-4 z-50 bg-primary text-white p-2 rounded-lg shadow-lg">
            <i class="fas fa-bars"></i>
          </button>
          <router-view />
        </main>
      </div>
    </div>
  </div>
</template>