import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

// --- Imports publics ---
import Login from '@/views/auth/Login.vue';
import Register from '@/views/auth/Register.vue';
import Home from '@/views/public/Home.vue';
import Catalog from '@/views/public/Catalog.vue';
import Appointment from '@/views/public/Appointment.vue';
import AppointmentDetails from '@/views/public/AppointmentDetails.vue';
import SoftwareDetail from '@/views/public/SoftwareDetail.vue';
import ServiceDetail from '@/views/public/ServiceDetail.vue';
import ForgotPassword from '@/views/auth/ForgotPassword.vue';        // <-- Nouveau
import ResetPassword from '@/views/auth/ResetPassword.vue';          // <-- Nouveau

import PublicLayout from '@/layouts/PublicLayout.vue';

// --- Layouts (Les conteneurs des Dashboards) ---
import ClientLayout from '@/layouts/ClientLayout.vue';
import ChefProjectLayout from '@/layouts/ChefProjectLayout.vue';
import AdminLayout from '@/layouts/AdminLayout.vue';

// --- Dashboard Client (Vues) ---
import ClientOverview from '@/views/dashboard/client/ClientOverview.vue';
import ClientQuotes from '@/views/dashboard/client/ClientQuotes.vue';
import ClientProjects from '@/views/dashboard/client/ClientProjects.vue';
import ClientAppointments from '@/views/dashboard/client/ClientAppointments.vue';
import ClientInvoices from '@/views/dashboard/client/ClientInvoices.vue';
import ClientNotifications from '@/views/dashboard/client/ClientNotifications.vue';

// --- Dashboard Client (Pages de Détail) ---
import ClientQuoteDetail from '@/views/dashboard/client/ClientQuoteDetail.vue';
import ClientProjectDetail from '@/views/dashboard/client/ClientProjectDetail.vue';
import ClientInvoiceDetail from '@/views/dashboard/client/ClientInvoiceDetail.vue';

// --- Dashboard Chef de Projet (Vues) ---
import ChefOverview from '@/views/dashboard/chef/ChefOverview.vue';
import ChefClients from '@/views/dashboard/chef/ChefClients.vue';
import ChefQuotes from '@/views/dashboard/chef/ChefQuotes.vue';
import ChefProjects from '@/views/dashboard/chef/ChefProjects.vue';
import ChefReports from '@/views/dashboard/chef/ChefReports.vue';
import ChefAppointments from '@/views/dashboard/chef/ChefAppointments.vue';
import ChefNotifications from '@/views/dashboard/chef/ChefNotifications.vue';
import ChefFactures from '@/views/dashboard/chef/ChefFactures.vue';

// --- Dashboard Chef de Projet (Pages de Détail) ---
import ChefQuoteDetail from '@/views/dashboard/chef/ChefQuoteDetail.vue';
import ChefProjectDetail from '@/views/dashboard/chef/ChefProjectDetail.vue';
import ChefReportDetail from '@/views/dashboard/chef/ChefReportDetail.vue';

// --- Dashboard Administrateur (Vues) ---
import AdminOverview from '@/views/dashboard/admin/AdminOverview.vue';
import AdminUsers from '@/views/dashboard/admin/AdminUsers.vue';
import AdminSoftwares from '@/views/dashboard/admin/AdminSoftwares.vue';
import AdminProjects from '@/views/dashboard/admin/AdminProjects.vue';
import AdminReports from '@/views/dashboard/admin/AdminReports.vue';
import AdminPayments from '@/views/dashboard/admin/AdminPayments.vue';
import AdminStatistics from '@/views/dashboard/admin/AdminStatistics.vue';
import AdminNotifications from '@/views/dashboard/admin/AdminNotifications.vue';
import AdminProjectDetail from '@/views/dashboard/admin/AdminProjectDetail.vue';

// --- Dashboard Administrateur (Pages de Détail) ---
import AdminReportDetail from '@/views/dashboard/admin/AdminReportDetail.vue';


const routes = [
    // --- Pages PUBLIQUES ---


    { path: '/forgot-password', component: ForgotPassword },     // <-- Nouveau
    { path: '/reset-password', component: ResetPassword },       // <-- Nouveau
    { path: '/services/:slug', component: ServiceDetail },
    {
    path: '/',
    component: PublicLayout,
    children: [
        { path: '', component: Home },
        { path: 'catalog', component: Catalog },
        { path: 'catalog/:id', component: SoftwareDetail },
        { path: 'rdv', component: Appointment },
        { path: 'appointments/:id', component: AppointmentDetails },
        { path: '/login', component: Login },
        { path: '/register', component: Register },
    ]
    },
    // --- DASHBOARD CLIENT ---
    { 
        path: '/dashboard/client', 
        component: ClientLayout, 
        meta: { requiresAuth: true, role: 'client' },
        children: [
            { path: '', redirect: 'accueil' },
            { path: 'accueil', component: ClientOverview },
            { path: 'quotes', component: ClientQuotes },
            { path: 'projects', component: ClientProjects },
            { path: 'appointments', component: ClientAppointments },
            { path: 'invoices', component: ClientInvoices },
            { path: 'notifications', component: ClientNotifications },
            { path: 'quotes/:id', component: ClientQuoteDetail },
            { path: 'projects/:id', component: ClientProjectDetail },
            { path: 'invoices/:id', component: ClientInvoiceDetail }
        ]
    },

    // --- DASHBOARD CHEF DE PROJET ---
    { 
        path: '/dashboard/chef-projet', 
        component: ChefProjectLayout, 
        meta: { requiresAuth: true, role: 'chef_projet' },
        children: [
            { path: '', redirect: 'accueil' },
            { path: 'accueil', component: ChefOverview },
            { path: 'clients', component: ChefClients },
            { path: 'quotes', component: ChefQuotes },
            { path: 'projects', component: ChefProjects },
            { path: 'reports', component: ChefReports },
            { path: 'appointments', component: ChefAppointments },
            { path: 'notifications', component: ChefNotifications },
            { path: 'factures', component: ChefFactures },
            { path: 'quotes/:id', component: ChefQuoteDetail },
            { path: 'projects/:id', component: ChefProjectDetail },
            { path: 'reports/:id', component: ChefReportDetail }
        ]
    },

    // --- DASHBOARD ADMINISTRATEUR ---
    { 
        path: '/dashboard/admin', 
        component: AdminLayout, 
        meta: { requiresAuth: true, role: 'administrateur' },
        children: [
            { path: '', redirect: 'accueil' },
            { path: 'accueil', component: AdminOverview },
            { path: 'users', component: AdminUsers },
            { path: 'softwares', component: AdminSoftwares },
            { path: 'projects', component: AdminProjects },
            { path: 'reports', component: AdminReports },
            { path: 'payments', component: AdminPayments },
            { path: 'statistics', component: AdminStatistics },
            { path: 'notifications', component: AdminNotifications },
            { path: 'reports/:id', component: AdminReportDetail },
            { path: 'projects/:id', component: AdminProjectDetail }
        ]
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

// Garde de navigation (Protection des routes)
router.beforeEach((to, from) => {
    const authStore = useAuthStore();
    if (to.meta.requiresAuth) {
        if (!authStore.token) return '/login';
        if (to.meta.role && authStore.user?.role !== to.meta.role) return '/';
    }
    return true;
});

export default router;