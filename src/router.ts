import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteParams, RouteRecordRaw } from 'vue-router'
import Home from './pages/Home.vue'
import { isAuthorized } from './store/user'

export type AppRouteNames =
  | 'global-feed'
  | 'my-feed'
  | 'tag'
  | 'animal'
  | 'create-animal'
  | 'edit-animal'
  | 'login'
  | 'register'
  | 'profile'
  | 'profile-favorites'
  | 'settings'

export const routes: RouteRecordRaw[] = [
  {
    name: 'global-feed',
    path: '/',
    component: Home,
  },
  {
    name: 'my-feed',
    path: '/my-feeds',
    component: Home,
  },
  {
    name: 'tag',
    path: '/tag/:tag',
    component: Home,
  },
  {
    name: 'animal',
    path: '/animal/:slug',
    component: () => import('./pages/Animal.vue'),
  },
  {
    name: 'edit-animal',
    path: '/animal/:slug/edit',
    component: () => import('./pages/EditAnimal.vue'),
  },
  {
    name: 'create-animal',
    path: '/animal/create',
    component: () => import('./pages/EditAnimal.vue'),
  },
  {
    name: 'login',
    path: '/login',
    component: () => import('./pages/Login.vue'),
    beforeEnter: () => !isAuthorized(),
  },
  {
    name: 'register',
    path: '/register',
    component: () => import('./pages/Register.vue'),
    beforeEnter: () => !isAuthorized(),
  },
  {
    name: 'profile',
    path: '/profile/:username',
    component: () => import('./pages/Profile.vue'),
  },
  {
    name: 'profile-favorites',
    path: '/profile/:username/favorites',
    component: () => import('./pages/Profile.vue'),
  },
  {
    name: 'settings',
    path: '/settings',
    component: () => import('./pages/Settings.vue'),
  },
]
export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export function routerPush (name: AppRouteNames, params?: RouteParams): ReturnType<typeof router.push> {
  if (params !== undefined) {
    return router.push({
      name,
      params,
    })
  } else {
    return router.push({ name })
  }
}
