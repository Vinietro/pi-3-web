<template>
  <AnimalsListNavigation
    v-bind="$attrs"
    :tag="tag"
    :username="username"
  />

  <div
    v-if="animalsDownloading"
    class="animal-preview"
  >
    Estamos carregando os bichinhos...
  </div>
  <div
    v-else-if="animals.length === 0"
    class="animal-preview"
  >
    Nenhum bichinho por aqui
  </div>
  <template v-else>
    <AnimalsListAnimalPreview
      v-for="(animal, index) in animals"
      :key="animal.slug"
      :animal="animal"
      @update="newAnimal => updateAnimal(index, newAnimal)"
    />

    <AppPagination
      :count="animalsCount"
      :page="page"
      @page-change="changePage"
    />
  </template>
</template>

<script setup lang="ts">
import { useAnimals } from 'src/composable/useAnimals'
import AppPagination from './AppPagination.vue'
import AnimalsListAnimalPreview from './AnimalsListAnimalPreview.vue'
import AnimalsListNavigation from './AnimalsListNavigation.vue'

const {
  fetchAnimals,
  animalsDownloading,
  animalsCount,
  animals,
  updateAnimal,
  page,
  changePage,
  tag,
  username,
} = useAnimals()

await fetchAnimals()

</script>
