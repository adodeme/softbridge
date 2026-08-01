
<template>
  <div id="app">
    <AppNavbar />
    <div class="container-fluid pt-4">
      <router-view />
    </div>
  </div>
</template>

<style>
/* Style global pour correspondre à la maquette */
body {
  background-color: #f8f9fa; /* Fond gris clair comme sur la maquette */
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
</style>