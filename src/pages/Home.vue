<template>
  <div class="home-page">
    <div class="banner row flex-items-xs-center">
      <div class="col">
        <img src="../../assets/logo.png" alt="">
      </div>
    </div>

    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <Suspense>
            <AnimalsList
              use-global-feed
              use-my-feed
              use-tag-feed
            />
            <template #fallback>
              Estamos carregando os bichinhos...
            </template>
          </Suspense>
        </div>

        <div class="col-md-3">
          <div class="sidebar">
            <Suspense>
              <PopularTags />
              <template #fallback>
                Categorias carregando...
              </template>
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AnimalsList from 'src/components/AnimalsList.vue'
import PopularTags from 'src/components/PopularTags.vue'
</script>
