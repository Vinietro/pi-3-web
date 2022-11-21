<template>
  <div class="animal-preview">
    <div class="animal-meta">
      <AppLink
        name="profile"
        :params="{username: props.animal.author.username}"
      >
        <img :src="animal.author.image" :alt="props.animal.author.username">
      </AppLink>
      <div class="info">
        <AppLink
          name="profile"
          :params="{username: props.animal.author.username}"
          class="author"
        >
          {{ animal.author.username }}
        </AppLink>
        <span class="date">{{ new Date(animal.createdAt).toDateString() }}</span>
      </div>

      <button
        :aria-label="animal.favorited ? 'Remover dos favoritos' : 'Favoritar'"
        class="btn btn-sm pull-xs-right"
        :class="[animal.favorited ? 'btn-primary':'btn-outline-primary']"
        :disabled="favoriteProcessGoing"
        @click="() =>favoriteAnimal()"
      >
        <i class="ion-heart" /> {{ animal.favoritedCount }}
      </button>
    </div>

    <AppLink
      name="animal"
      :params="{slug: props.animal.slug}"
      class="preview-link"
    >
      <div class="row">
        <div class="col-xs-3">
          <img :src="animal.image" width="200">
        </div>
        <div class="col-xs-9">
          <h1>{{ animal.title }}</h1>
          <span>Conheça melhor...</span>
          <ul class="tag-list">
            <li
              v-for="tag in animal.tagList"
              :key="tag"
              class="tag-default tag-pill tag-outline"
            >
              {{ tag }}
            </li>
          </ul>
        </div>
      </div>
    </AppLink>
  </div>
</template>

<script setup lang="ts">
import { useFavoriteAnimal } from 'src/composable/useFavoriteAnimal'
import type { Animal } from 'src/services/api'
import { computed } from 'vue'

interface Props {
  animal: Animal
}
interface Emits {
  (e: 'update', animal: Animal): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const {
  favoriteProcessGoing,
  favoriteAnimal,
} = useFavoriteAnimal({
  isFavorited: computed(() => props.animal.favorited),
  animalSlug: computed(() => props.animal.slug),
  onUpdate: (newAnimal: Animal): void => emit('update', newAnimal),
})

</script>
