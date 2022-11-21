<template>
  <div class="banner">
    <div class="container">
      <h1>{{ animal.title }}</h1>
      <ul class="tag-list">
        <li
          v-for="tag in animal.tagList"
          :key="tag"
          class="tag-default tag-pill tag-outline"
        >
          {{ tag }}
        </li>
      </ul>

      <AnimalDetailMeta
        v-if="animal"
        :animal="animal"
        @update="updateAnimal"
      />
    </div>
  </div>

  <div class="container page">
    <div class="row animal-content">
      <div class="col-md-3">
        <img :src="animal.image" width="200">
      </div>
      <!--       eslint-disable vue/no-v-html  -->
      <div
        class="col-md-9"
        v-html="animalHandledBody"
      />
      <!--       eslint-enable vue/no-v-html  -->

      <!--      TODO: abstract tag list component-->
    </div>

    <hr>

    <div class="animal-actions">
      <AnimalDetailMeta
        v-if="animal"
        :animal="animal"
        @update="updateAnimal"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import marked from 'src/plugins/marked'
import { api } from 'src/services'
import type { Animal } from 'src/services/api'
import { computed, reactive } from 'vue'
import { useRoute } from 'vue-router'
import AnimalDetailMeta from './AnimalDetailMeta.vue'

const route = useRoute()
const slug = route.params.slug as string
const animal: Animal = reactive(await api.animals.getAnimal(slug).then(res => res.data.animal))

const animalHandledBody = computed(() => marked(animal.body))

const updateAnimal = (newAnimal: Animal) => {
  Object.assign(animal, newAnimal)
}
</script>
