<script setup>
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';

const router = useRouter();

const services = [
  { icon: 'fa-laptop-code', title: 'Développement Web', slug: 'developpement-web', desc: 'Sites vitrines, E-commerce, Portails intranet et applications métiers.' },
  { icon: 'fa-mobile-screen-button', title: 'Applications Mobiles', slug: 'applications-mobiles', desc: 'Applications natives iOS/Android ou hybrides.' },
  { icon: 'fa-cubes', title: 'Logiciels de Gestion', slug: 'logiciels-de-gestion', desc: 'ERP, CRM, Gestion de stock et ressources humaines.' },
  { icon: 'fa-cloud', title: 'Cloud & Hébergement', slug: 'cloud-hebergement', desc: 'Déploiement sécurisé, bases de données et sauvegardes.' },
  { icon: 'fa-paintbrush', title: 'Design UI/UX', slug: 'design-ui-ux', desc: 'Interfaces modernes, intuitives pour l\'expérience utilisateur.' },
  { icon: 'fa-headset', title: 'Support & Maintenance', slug: 'support-maintenance', desc: 'Assistance technique réactive et maintenance continue.' }
];

const pourquoiNous = [
  { title: 'Expertise Locale', icon: 'fa-map-location-dot', desc: 'Une équipe basée au Bénin, à votre écoute.' },
  { title: '100% Sur-Mesure', icon: 'fa-pen-ruler', desc: 'Pas de standard. Chaque projet est conçu pour vos objectifs uniques.' },
  { title: 'Sécurité & Fiabilité', icon: 'fa-shield-halved', desc: 'Protocoles de sécurité de pointe pour vos données.' },
  { title: 'Accompagnement Global', icon: 'fa-handshake', desc: 'Du devis à la maintenance, nous restons à vos côtés.' }
];

const chiffresCles = [
  { valeur: '150+', label: 'Projets réalisés' },
  { valeur: '50+', label: 'Clients actifs' },
  { valeur: '10+', label: 'Logiciels SaaS' },
  { valeur: '8 ans', label: 'Expérience' }
];

const temoignages = [
  { auteur: 'Aline M.', entreprise: 'Directrice, TechRise', texte: 'SoftBridge a transformé notre gestion. Leur équipe a su comprendre nos besoins et livrer une solution sur mesure.' },
  { auteur: 'Bruno K.', entreprise: 'Fondateur, Agrilink', texte: 'Professionnalisme et réactivité. Nous avons gagné un temps précieux grâce à leurs logiciels SaaS.' },
  { auteur: 'Clarisse D.', entreprise: 'DG, FinPro Services', texte: 'Un accompagnement de haut niveau, du devis à la maintenance. Je recommande vivement.' }
];

const demandeDevis = () => {
  Swal.fire({
    title: 'Comment voulez-vous procéder ?',
    text: 'Vous pouvez prendre rendez-vous avec notre équipe pour discuter de votre projet, ou remplir directement un formulaire de demande de devis.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Prendre rendez-vous',
    cancelButtonText: 'Formulaire de devis',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      router.push('/rdv');
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      router.push('/demande-devis');
    }
  });
};
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Section HERO (inchangée) -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-12 md:py-20">
      <div>
        <h1 class="text-4xl md:text-5xl font-bold text-primary leading-tight">
          SoftBridge, <span class="text-primary-light">le partenaire</span> de votre transformation numérique
        </h1>
        <p class="text-lg text-gray-600 mt-4 mb-8">
          Nous réalisons vos projets informatiques sur mesure (sites web, logiciels de gestion, applications mobiles) et commercialisons des solutions SaaS prêtes à l’emploi.
        </p>
        <div class="flex flex-wrap gap-4">
          <button @click="demandeDevis" class="bg-primary-light text-white px-8 py-3 rounded-full font-semibold hover:bg-primary transition-colors shadow-md">
            <i class="fas fa-paper-plane mr-2"></i> Demander un devis
          </button>
          <router-link to="/catalog" class="border-2 border-primary-light text-primary-light px-8 py-3 rounded-full font-semibold hover:bg-primary-light hover:text-white transition-colors">
            Voir le catalogue
          </router-link>
        </div>
      </div>
      <div class="hidden lg:block">
        <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop" 
             alt="Développement logiciel" 
             class="w-full h-[400px] object-cover rounded-2xl shadow-lg border-4 border-white">
      </div>
    </div>

    <!-- Section À PROPOS (ajoutée) -->
    <div class="py-16 bg-white rounded-2xl shadow-sm px-6 mb-16 mt-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h3 class="text-3xl font-bold text-primary mb-4">À propos de SoftBridge</h3>
          <p class="text-gray-600 leading-relaxed mb-4">
            SoftBridge est une entreprise de services numériques basée à Cotonou, Bénin. Nous accompagnons les entreprises et organisations dans la conception, le développement et la commercialisation de solutions logicielles innovantes.
          </p>
          <p class="text-gray-600 leading-relaxed mb-4">
            Notre mission est de connecter vos idées à la réalité technologique, que ce soit à travers des projets sur mesure ou des logiciels SaaS prêts à l'emploi.
          </p>
          <div class="space-y-2">
            <p class="text-gray-700"><i class="fas fa-check-circle text-primary-light mr-2"></i> Expertise locale et internationale</p>
            <p class="text-gray-700"><i class="fas fa-check-circle text-primary-light mr-2"></i> Solutions flexibles et évolutives</p>
            <p class="text-gray-700"><i class="fas fa-check-circle text-primary-light mr-2"></i> Support réactif et durable</p>
          </div>
        </div>
        <div class="hidden lg:block">
          <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" 
               alt="Notre équipe" 
               class="w-full h-[350px] object-cover rounded-2xl shadow-lg border-4 border-white">
        </div>
      </div>
    </div>

    <!-- Section CHIFFRES CLÉS (ajoutée) -->
    <div class="py-12 bg-primary rounded-2xl shadow-lg px-6 mb-16 text-white">
      <h3 class="text-3xl font-bold text-center mb-10">SoftBridge en chiffres</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div v-for="chiffre in chiffresCles" :key="chiffre.label">
          <p class="text-4xl font-bold text-primary-light">{{ chiffre.valeur }}</p>
          <p class="text-sm text-gray-300 mt-1">{{ chiffre.label }}</p>
        </div>
      </div>
    </div>

    <!-- Section TÉMOIGNAGES (ajoutée) -->
    <div class="py-12 bg-white rounded-2xl shadow-sm px-6 mb-16">
      <h3 class="text-3xl font-bold text-center text-primary mb-10">Ils nous font confiance</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div v-for="temoignage in temoignages" :key="temoignage.auteur" class="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <i class="fas fa-quote-left text-primary-light text-2xl mb-2"></i>
          <p class="text-gray-600 text-sm leading-relaxed mb-4">« {{ temoignage.texte }} »</p>
          <p class="font-bold text-gray-800">{{ temoignage.auteur }}</p>
          <p class="text-xs text-gray-500">{{ temoignage.entreprise }}</p>
        </div>
      </div>
    </div>

    <!-- Section APPEL À L'ACTION (ajoutée) -->
    <div class="bg-primary-light text-white rounded-2xl shadow-lg px-6 py-12 mb-16 text-center">
      <h3 class="text-3xl font-bold mb-4">Prêt à lancer votre projet ?</h3>
      <p class="text-lg mb-8 text-gray-100">Rejoignez des dizaines d'entreprises qui ont fait confiance à SoftBridge.</p>
      <div class="flex justify-center gap-4">
        <router-link to="/rdv" class="bg-white text-primary px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition">
          Prendre rendez-vous
        </router-link>
        <router-link to="/register" class="border-2 border-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-primary transition">
          Créer un compte
        </router-link>
      </div>
    </div>

    <!-- Section POURQUOI NOUS CHOISIR (inchangée) -->
    <div class="py-12 bg-white rounded-2xl shadow-sm px-6 mb-16">
      <h3 class="text-3xl font-bold text-center text-primary mb-10">Pourquoi choisir SoftBridge ?</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div v-for="item in pourquoiNous" :key="item.title" class="text-center">
            <div class="w-16 h-16 mx-auto bg-blue-50 text-primary-light rounded-full flex items-center justify-center text-2xl mb-3">
                <i :class="'fas ' + item.icon"></i>
            </div>
            <h5 class="font-bold text-gray-800">{{ item.title }}</h5>
            <p class="text-sm text-gray-600 mt-2 px-2">{{ item.desc }}</p>
        </div>
      </div>
    </div>

    <!-- Section NOS SERVICES (inchangée) -->
    <div class="mb-16">
      <div class="text-center mb-10">
        <h3 class="text-3xl font-bold text-primary">Nos Services</h3>
        <p class="text-gray-600 mt-2">Une gamme complète de solutions pour vos besoins numériques.</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="service in services" :key="service.title" class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div class="w-12 h-12 bg-blue-50 text-primary-light rounded-xl flex items-center justify-center text-2xl mb-4">
            <i :class="'fas ' + service.icon"></i>
          </div>
          <h5 class="font-bold text-gray-800 mb-2">{{ service.title }}</h5>
          <p class="text-sm text-gray-600 mb-4">{{ service.desc }}</p>
          <router-link :to="'/services/' + service.slug" class="text-sm font-semibold text-primary-light hover:text-primary transition-colors">
            En savoir plus <i class="fas fa-arrow-right ml-1"></i>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>