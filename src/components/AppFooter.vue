<template>
  <footer class="bg-[#1E3A5F] text-white mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Colonne 1 : Logo + description -->
        <div>
          <h3 class="text-2xl font-bold mb-4">SoftBridge</h3>
          <p class="text-gray-300 text-sm leading-relaxed">
            Votre partenaire pour la transformation numérique. Nous connectons vos idées à la réalité technologique.
          </p>
        </div>

        <!-- Colonne 2 : Liens rapides -->
        <div>
          <h4 class="font-semibold text-lg mb-4">Liens rapides</h4>
          <ul class="space-y-2 text-sm">
            <li><router-link to="/" class="text-gray-300 hover:text-white transition">Accueil</router-link></li>
            <li><router-link to="/catalog" class="text-gray-300 hover:text-white transition">Catalogue</router-link></li>
            <li><router-link to="/rdv" class="text-gray-300 hover:text-white transition">Prendre rendez-vous</router-link></li>
            <li><router-link to="/login" class="text-gray-300 hover:text-white transition">Connexion</router-link></li>
          </ul>
        </div>

        <!-- Colonne 3 : Contact -->
        <div>
          <h4 class="font-semibold text-lg mb-4">Contact</h4>
          <ul class="space-y-2 text-sm text-gray-300">
            <li><i class="fas fa-envelope mr-2"></i> contact@softbridge.com</li>
            <li><i class="fas fa-phone mr-2"></i> +229 00 00 00 00</li>
            <li><i class="fas fa-map-marker-alt mr-2"></i> Cotonou, Bénin</li>
          </ul>
        </div>
      </div>

      <!-- Barre inférieure -->
      <div class="border-t border-gray-500 mt-8 pt-8 text-center text-sm text-gray-400">
        <p>&copy; {{ new Date().getFullYear() }} SoftBridge. Tous droits réservés.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
// Aucune logique requise
</script>