<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <form @submit.prevent="onSubmit">
            <fieldset class="form-group">
              <input
                v-model="form.title"
                type="text"
                class="form-control form-control-lg"
                placeholder="Nome do bichinho"
              >
            </fieldset>
            <fieldset class="form-group">
              <input
                v-model="form.image"
                type="text"
                class="form-control form-control-lg"
                placeholder="URL da imagem"
              >
            </fieldset>
            <fieldset class="form-group">
              <select
                v-model="tag"
                type="text"
                class="form-control"
              >
                <option disabled>
                  Selecione a categoria
                </option>
                <option value="Cachorro">
                  Cachorro
                </option>
                <option value="Gato">
                  Gato
                </option>
                <option value="Ave">
                  Ave
                </option>
                <option value="Roedores">
                  Roedores
                </option>
                <option value="Outros">
                  Outros
                </option>
              </select>
            </fieldset>
            <fieldset class="form-group">
              <textarea
                v-model="form.body"
                :rows="8"
                class="form-control"
                placeholder="Descreva ao máximo nosso amigo para que alguém possa adotá-lo"
              />
            </fieldset>
            <button
              class="btn btn-lg pull-xs-right btn-primary"
              type="submit"
              :disabled="!(form.title && form.body)"
            >
              Publicar bichinho
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { api } from 'src/services'
import type { Animal } from 'src/services/api'
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface FormState {
  title: string
  image: string
  description: string
  body: string
  tagList: string[]
}

const route = useRoute()
const router = useRouter()
const slug = computed<string>(() => route.params.slug as string)

const form: FormState = reactive({
  title: '',
  image: '',
  description: '',
  body: '',
  tagList: [],
})

const tag = ref<string>('')

async function fetchAnimal (slug: string) {
  const animal = await api.animals.getAnimal(slug).then(res => res.data.animal)

  // FIXME: I always feel a little wordy here
  form.title = animal.title
  form.image = animal.image
  form.description = animal.description
  form.body = animal.body
  form.tagList = animal.tagList
}

onMounted(() => {
  if (slug.value) fetchAnimal(slug.value)
})

const onSubmit = async () => {
  form.tagList = [tag.value.trim()]
  let animal: Animal
  if (slug.value) {
    animal = await api.animals.updateAnimal(slug.value, { animal: form }).then(res => res.data.animal)
  } else {
    animal = await api.animals.createAnimal({ animal: form }).then(res => res.data.animal)
  }
  return router.push({ name: 'animal', params: { slug: animal.slug } })
}

</script>
