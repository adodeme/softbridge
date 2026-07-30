<script setup>
import ChefProjectSidebar from '@/components/ChefProjectSidebar.vue';
</script>
<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden">
    <ChefProjectSidebar />
    <div class="flex-1 flex flex-col h-screen overflow-hidden">
      <main class="flex-1 overflow-y-auto p-6 pt-20 md:pt-6">
        <router-view />
      </main>
    </div>
  </div>
</template>