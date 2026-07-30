<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const services = [
  {
    slug: 'developpement-web',
    title: 'Développement Web',
    desc: 'Sites vitrines, E-commerce, Portails intranet et applications métiers.',
    icon: 'fa-laptop-code',
    image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=800&auto=format&fit=crop',
    content: `Notre équipe conçoit des sites web modernes et performants, parfaitement adaptés à vos objectifs. Du simple site vitrine au portail complexe, nous utilisons les dernières technologies (Laravel, Vue.js, React) pour garantir rapidité, sécurité et évolutivité. Nous vous accompagnons de la conception à la mise en ligne, en passant par le référencement naturel (SEO).`
  },
  {
    slug: 'applications-mobiles',
    title: 'Applications Mobiles',
    desc: 'Applications natives iOS/Android ou hybrides.',
    icon: 'fa-mobile-screen-button',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800&auto=format&fit=crop',
    content: `Développez votre présence mobile avec une application sur mesure. Nous créons des applications natives (Swift, Kotlin) ou hybrides (Flutter, React Native) qui offrent une expérience utilisateur fluide et intuitive. De la conception UI/UX au déploiement sur les stores, nous gérons l’ensemble du cycle de vie.`
  },
  {
    slug: 'logiciels-de-gestion',
    title: 'Logiciels de Gestion',
    desc: 'ERP, CRM, Gestion de stock et ressources humaines.',
    icon: 'fa-cubes',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
    content: `Optimisez votre activité avec des logiciels de gestion personnalisés. Nous développons des ERP, CRM, solutions de facturation, gestion des stocks et RH adaptés à votre métier. Nos outils centralisent vos données, automatisent vos processus et facilitent la prise de décision grâce à des tableaux de bord clairs.`
  },
  {
    slug: 'cloud-hebergement',
    title: 'Cloud & Hébergement',
    desc: 'Déploiement sécurisé, bases de données et sauvegardes.',
    icon: 'fa-cloud',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=800&auto=format&fit=crop',
    content: `Assurez la disponibilité et la sécurité de vos applications grâce à nos solutions d’hébergement cloud. Nous configurons des serveurs dédiés, VPS ou cloud (AWS, DigitalOcean) avec monitoring, sauvegardes automatiques et protection contre les intrusions. Votre infrastructure est entre de bonnes mains.`
  },
  {
    slug: 'design-ui-ux',
    title: 'Design UI/UX',
    desc: 'Interfaces modernes, intuitives pour l\'expérience utilisateur.',
    icon: 'fa-paintbrush',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800&auto=format&fit=crop',
    content: `L’apparence et l’ergonomie de votre application sont essentielles. Nos designers créent des interfaces modernes et intuitives, centrées sur l’utilisateur. Nous réalisons des maquettes, prototypes interactifs et tests utilisateurs pour garantir une expérience fluide et engageante.`
  },
  {
    slug: 'support-maintenance',
    title: 'Support & Maintenance',
    desc: 'Assistance technique réactive et maintenance continue.',
    icon: 'fa-headset',
    image: 'https://images.unsplash.com/photo-1560264280-88b68371db39?q=80&w=800&auto=format&fit=crop',
    content: `Bénéficiez d’un support technique réactif et d’une maintenance proactive. Nous assurons la correction de bugs, les mises à jour de sécurité, l’évolution fonctionnelle et le suivi de vos applications dans la durée. Notre équipe reste disponible pour vous accompagner après la mise en production.`
  }
];

const service = computed(() => services.find(s => s.slug === route.params.slug));
</script>

<template>
  <div class="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <div v-if="service" class="bg-white rounded-2xl shadow-lg overflow-hidden">
      <!-- Image d'en-tête -->
      <div class="h-64 sm:h-80 w-full overflow-hidden">
        <img :src="service.image" :alt="service.title" class="w-full h-full object-cover">
      </div>
      <div class="p-8 md:p-12">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-12 h-12 bg-blue-50 text-primary-light rounded-xl flex items-center justify-center text-2xl">
            <i :class="'fas ' + service.icon"></i>
          </div>
          <h1 class="text-3xl font-bold text-primary">{{ service.title }}</h1>
        </div>
        <p class="text-gray-600 text-lg leading-relaxed mb-6">{{ service.desc }}</p>
        <div class="prose max-w-none text-gray-700 text-base leading-relaxed whitespace-pre-line">
          {{ service.content }}
        </div>
        <div class="mt-8 flex gap-4">
          <router-link to="/rdv" class="bg-primary-light text-white px-6 py-3 rounded-full font-semibold hover:bg-primary transition">
            Demander un devis
          </router-link>
          <router-link to="/" class="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-full font-semibold hover:border-primary-light hover:text-primary-light transition">
            Retour à l'accueil
          </router-link>
        </div>
      </div>
    </div>
    <div v-else class="text-center py-20 text-gray-500">
      <i class="fas fa-exclamation-triangle text-5xl mb-4 text-gray-300"></i>
      <p class="text-xl">Service introuvable.</p>
      <router-link to="/" class="mt-4 inline-block text-primary-light hover:underline">Retour à l'accueil</router-link>
    </div>
  </div>
</template>