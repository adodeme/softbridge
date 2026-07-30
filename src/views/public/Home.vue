<script setup>
const services = [
  {
    icon: 'fa-laptop-code',
    title: 'Développement Web',
    slug: 'developpement-web',
    desc: 'Sites vitrines, E-commerce, Portails intranet et applications métiers.',
    image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=800&auto=format&fit=crop',
    content: `Notre équipe conçoit des sites web modernes et performants, parfaitement adaptés à vos objectifs. Du simple site vitrine au portail complexe, nous utilisons les dernières technologies (Laravel, Vue.js, React) pour garantir rapidité, sécurité et évolutivité. Nous vous accompagnons de la conception à la mise en ligne, en passant par le référencement naturel (SEO).`
  },
  {
    icon: 'fa-mobile-screen-button',
    title: 'Applications Mobiles',
    slug: 'applications-mobiles',
    desc: 'Applications natives iOS/Android ou hybrides.',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800&auto=format&fit=crop',
    content: `Développez votre présence mobile avec une application sur mesure. Nous créons des applications natives (Swift, Kotlin) ou hybrides (Flutter, React Native) qui offrent une expérience utilisateur fluide et intuitive. De la conception UI/UX au déploiement sur les stores, nous gérons l’ensemble du cycle de vie.`
  },
  {
    icon: 'fa-cubes',
    title: 'Logiciels de Gestion',
    slug: 'logiciels-de-gestion',
    desc: 'ERP, CRM, Gestion de stock et ressources humaines.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
    content: `Optimisez votre activité avec des logiciels de gestion personnalisés. Nous développons des ERP, CRM, solutions de facturation, gestion des stocks et RH adaptés à votre métier. Nos outils centralisent vos données, automatisent vos processus et facilitent la prise de décision grâce à des tableaux de bord clairs.`
  },
  {
    icon: 'fa-cloud',
    title: 'Cloud & Hébergement',
    slug: 'cloud-hebergement',
    desc: 'Déploiement sécurisé, bases de données et sauvegardes.',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=800&auto=format&fit=crop',
    content: `Assurez la disponibilité et la sécurité de vos applications grâce à nos solutions d’hébergement cloud. Nous configurons des serveurs dédiés, VPS ou cloud (AWS, DigitalOcean) avec monitoring, sauvegardes automatiques et protection contre les intrusions. Votre infrastructure est entre de bonnes mains.`
  },
  {
    icon: 'fa-paintbrush',
    title: 'Design UI/UX',
    slug: 'design-ui-ux',
    desc: 'Interfaces modernes, intuitives pour l\'expérience utilisateur.',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800&auto=format&fit=crop',
    content: `L’apparence et l’ergonomie de votre application sont essentielles. Nos designers créent des interfaces modernes et intuitives, centrées sur l’utilisateur. Nous réalisons des maquettes, prototypes interactifs et tests utilisateurs pour garantir une expérience fluide et engageante.`
  },
  {
    icon: 'fa-headset',
    title: 'Support & Maintenance',
    slug: 'support-maintenance',
    desc: 'Assistance technique réactive et maintenance continue.',
    image: 'https://images.unsplash.com/photo-1560264280-88b68371db39?q=80&w=800&auto=format&fit=crop',
    content: `Bénéficiez d’un support technique réactif et d’une maintenance proactive. Nous assurons la correction de bugs, les mises à jour de sécurité, l’évolution fonctionnelle et le suivi de vos applications dans la durée. Notre équipe reste disponible pour vous accompagner après la mise en production.`
  }
];

const pourquoiNous = [
    { title: 'Expertise Locale', icon: 'fa-map-location-dot', desc: 'Une équipe basée au Bénin, à votre écoute.' },
    { title: '100% Sur-Mesure', icon: 'fa-pen-ruler', desc: 'Pas de standard. Chaque projet est conçu pour vos objectifs uniques.' },
    { title: 'Sécurité & Fiabilité', icon: 'fa-shield-halved', desc: 'Protocoles de sécurité de pointe pour vos données.' },
    { title: 'Accompagnement Global', icon: 'fa-handshake', desc: 'Du devis à la maintenance, nous restons à vos côtés.' }
];
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    
    <!-- Section HERO (Bleue) -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-12 md:py-20">
      <div>
        <h1 class="text-4xl md:text-5xl font-bold text-primary leading-tight">
          Le pont vers <span class="text-primary-light">votre transformation</span> <br> numérique.
        </h1>
        <p class="text-lg text-gray-600 mt-4 mb-8">
          De la demande à la solution, tout sur une seule plateforme. 
          SoftBridge connecte vos idées à la réalité technologique.
        </p>
        <div class="flex flex-wrap gap-4">
          <router-link to="/rdv" class="bg-primary-light text-white px-8 py-3 rounded-full font-semibold hover:bg-primary transition-colors shadow-md">
            <i class="fas fa-paper-plane mr-2"></i> Demander un devis
          </router-link>
          <router-link to="/catalog" class="border-2 border-primary-light text-primary-light px-8 py-3 rounded-full font-semibold hover:bg-primary-light hover:text-white transition-colors">
            Voir le catalogue
          </router-link>
        </div>
      </div>
      <div class="hidden lg:block">
        <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop" 
             alt="Bureau SoftBridge" 
             class="w-full h-[400px] object-cover rounded-2xl shadow-lg border-4 border-white">
      </div>
    </div>

    <!-- Section POURQUOI NOUS CHOISIR -->
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

    <!-- Section NOS SERVICES -->
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