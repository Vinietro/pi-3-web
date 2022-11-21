<template>
  <div class="animal-meta">
    <AppLink
      name="profile"
      :params="{username: animal.author.username}"
    >
      <img :src="animal.author.image" :alt="animal.author.username">
    </AppLink>

    <div class="info">
      <AppLink
        name="profile"
        :params="{username: animal.author.username}"
        class="author"
      >
        {{ animal.author.username }}
      </AppLink>

      <span class="date">{{ (new Date(animal.createdAt)).toLocaleDateString('pt-BR') }}</span>
    </div>

    <button
      v-if="displayFollowButton"
      :aria-label="animal.author.following ? 'Unfollow' : 'Follow'"
      class="btn btn-sm btn-outline-secondary space"
      :disabled="followProcessGoing"
      @click="toggleFollow"
    >
      <i class="ion-plus-round space" />
      {{ animal.author.following ? "Unfollow" : "Follow" }} {{ animal.author.username }}
    </button>

    <button
      :aria-label="animal.favorited ? 'Remover dos favoritos' : 'Favoritar'"
      class="btn btn-sm space"
      :class="[animal.favorited ? 'btn-primary':'btn-outline-primary']"
      :disabled="favoriteProcessGoing"
      @click="favoriteAnimal"
    >
      <i class="ion-heart space" />
      {{ animal.favorited ? 'Remover dos favoritos' : 'Favoritar' }}
      <span class="counter">({{ animal.favoritedCount }})</span>
    </button>

    <AppLink
      v-if="displayEditButton"
      aria-label="Edit animal"
      class="btn btn-outline-secondary btn-sm space"
      name="edit-animal"
      :params="{slug: animal.slug}"
    >
      <i class="ion-edit space" /> Editar
    </AppLink>

    <button
      v-if="displayEditButton"
      aria-label="Delete animal"
      class="btn btn-outline-danger btn-sm"
      @click="onDelete"
    >
      <i class="ion-trash-a" /> Deletar
    </button>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useFavoriteAnimal } from 'src/composable/useFavoriteAnimal'
import { useFollow } from 'src/composable/useFollowProfile'
import { routerPush } from 'src/router'
import { api } from 'src/services'
import type { Animal, Profile } from 'src/services/api'
import { useUserStore } from 'src/store/user'
import { computed, toRefs } from 'vue'

interface Props {
  animal: Animal
}
interface Emits {
  (e: 'update', animal: Animal): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { animal } = toRefs(props)
const { user, isAuthorized } = storeToRefs(useUserStore())
const displayEditButton = computed(() => isAuthorized.value && user.value?.username === animal.value.author.username)
const displayFollowButton = computed(() => isAuthorized.value && user.value?.username !== animal.value.author.username)

const { favoriteProcessGoing, favoriteAnimal } = useFavoriteAnimal({
  isFavorited: computed(() => animal.value.favorited),
  animalSlug: computed(() => animal.value.slug),
  onUpdate: newAnimal => emit('update', newAnimal),
})

const onDelete = async () => {
  await api.animals.deleteAnimal(animal.value.slug)
  await routerPush('global-feed')
}

const { followProcessGoing, toggleFollow } = useFollow({
  following: computed(() => animal.value.author.following),
  username: computed(() => animal.value.author.username),
  onUpdate: (author: Profile) => {
    const newAnimal = { ...animal.value, author }
    emit('update', newAnimal)
  },
})
</script>

<style scoped>
.space {
  margin-right: 8px;
}
</style>
