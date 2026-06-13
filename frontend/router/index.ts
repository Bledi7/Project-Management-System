import { createRouter, createWebHistory } from 'vue-router'
import { authState, isAuthenticated, logout } from '@/modules/auth/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login-view/LoginView.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/register-view/RegisterView.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/',
      name: 'dashboard',
      component: () => import('@/views/dashboard-view/DashboardView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/projects',
      name: 'projects',
      component: () => import('@/views/projects-view/ProjectsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/projects/:key',
      name: 'project-details',
      component: () => import('@/views/project-details-view/ProjectDetailsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/reports',
      name: 'reports',
      component: () => import('@/views/reports-view/ReportsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/my-reports',
      name: 'my-reports',
      component: () => import('@/views/reports-view/ReportsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/priorities',
      name: 'priorities',
      component: () => import('@/views/priorities-view/PrioritiesView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/team',
      name: 'team',
      component: () => import('@/views/team-view/TeamView.vue'),
      meta: { requiresAuth: true, roles: ['ADMIN', 'PRODUCT_OWNER'] },
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('@/views/users-view/UsersView.vue'),
      meta: { requiresAuth: true, roles: ['ADMIN', 'PRODUCT_OWNER'] },
    },
    {
      path: '/sprint-planning',
      name: 'sprint-planning',
      component: () => import('@/views/po-sprint-planning-view/PoSprintPlanningView.vue'),
      meta: { requiresAuth: true, roles: ['ADMIN', 'PRODUCT_OWNER'] },
    },
    {
      path: '/sprint-capacity',
      name: 'sprint-capacity',
      component: () => import('@/views/dev-sprint-capacity-view/DevSprintCapacityView.vue'),
      meta: { requiresAuth: true, roles: ['DEVELOPER'] },
    },
    {
      path: '/admin/invitations',
      name: 'admin-invitations',
      component: () => import('@/views/admin-invitations-view/AdminInvitationsView.vue'),
      meta: { requiresAuth: true, roles: ['ADMIN'] },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/profile-view/ProfileView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/profile/edit',
      name: 'profile-edit',
      component: () => import('@/views/profile-view/ProfileView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/faq',
      name: 'faq',
      component: () => import('@/views/dashboard-view/DashboardView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/logout',
      name: 'logout',
      redirect: () => {
        logout()
        return { name: 'login' }
      },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: () => (isAuthenticated() ? '/' : '/login'),
    },
  ],
})

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.meta.guestOnly && isAuthenticated()) {
    return { name: 'dashboard' }
  }

  const allowedRoles = to.meta.roles
  if (allowedRoles?.length && isAuthenticated()) {
    const userRole = authState.user?.role
    if (!userRole || !allowedRoles.includes(userRole)) {
      return { name: 'dashboard' }
    }
  }

  return true
})

export default router
