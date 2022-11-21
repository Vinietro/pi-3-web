<template>
  <div class="animal-page">
    <Suspense>
      <AnimalDetail />
      <template #fallback>
        <div class="container page">
          Carregando bichinho...
        </div>
      </template>
    </Suspense>

    <Suspense>
      <div class="row">
        <div class="col-xs-12 col-md-8 offset-md-2">
          <AnimalDetailComments />
        </div>
      </div>
      <template #fallback>
        <div class="container page">
          Comentários carregando...
        </div>
      </template>
    </Suspense>
  </div>
</template>

<script setup lang="ts">
import AnimalDetail from 'src/components/AnimalDetail.vue'
import AnimalDetailComments from 'src/components/AnimalDetailComments.vue'
</script>

<style scoped>
.row{
  margin-right: 0;
}
</style>
