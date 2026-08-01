<script setup>
import AppNavbar from '@/components/AppNavbar.vue';
import AppFooter from '@/components/AppFooter.vue';
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <AppNavbar />
    <div class="flex-1">
      <router-view />
    </div>
    <AppFooter />
  </div>
</template>