<template>
  <nav class="navbar navbar-light">
    <div class="container">
      <AppLink
        class="navbar-brand"
        name="global-feed"
      >
        pet rescue
      </AppLink>

      <ul class="nav navbar-nav pull-xs-right">
        <li
          v-for="link in navLinks"
          :key="link.name"
          class="nav-item m-r-3"
        >
          <AppLink
            class="nav-link"
            active-class="active"
            :name="link.name"
            :params="link.params"
          >
            <i
              v-if="link.icon"
              :class="link.icon"
            />
            {{ link.title }}
          </AppLink>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { AppRouteNames } from 'src/router'
import { useUserStore } from 'src/store/user'
import { computed } from 'vue'
import type { RouteParams } from 'vue-router'

interface NavLink {
  name: AppRouteNames
  params?: Partial<RouteParams>
  title: string
  icon?: string
  display: 'all' | 'anonym' | 'authorized'
}

const { user } = storeToRefs(useUserStore())

const username = computed(() => user.value?.username)
const displayStatus = computed(() => username.value ? 'authorized' : 'anonym')

const allNavLinks = computed<NavLink[]>(() => [
  {
    name: 'global-feed',
    title: 'Home',
    display: 'all',
  },
  {
    name: 'login',
    title: 'Entrar',
    display: 'anonym',
  },
  {
    name: 'register',
    title: 'Cadastrar',
    display: 'anonym',
  },
  {
    name: 'create-animal',
    title: 'Anunciar bichinho',
    display: 'authorized',
    icon: 'ion-compose',
  },
  {
    name: 'settings',
    title: 'Configurações',
    display: 'authorized',
    icon: 'ion-gear-a',
  },
  {
    name: 'profile',
    params: { username: username.value },
    title: username.value || '',
    display: 'authorized',
  },
])

const navLinks = computed(() => allNavLinks.value.filter(
  l => l.display === displayStatus.value || l.display === 'all',
))

</script>
