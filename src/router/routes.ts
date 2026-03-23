import { RouteRecordRaw } from 'vue-router';
import AuthenticationGuard from './auth-guards'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/HomePage.vue') }],
  },
  {
    path:'/login',
    name: 'Login',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      {
        path: '',
        name: 'LoginA',
        component: () => import('pages/LoginPage.vue')
      }
    ],
  },
  {
    path:'/dashboard',
    name: 'Dashboard',
    beforeEnter: [AuthenticationGuard],
    component: () => import('layouts/DashboardLayout.vue'),
    children: [
      {
        path: '',
        name: 'Application',
        component: () => import('pages/ApplicationsPage.vue')
      }
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
