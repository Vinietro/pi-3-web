import type { AppRouteNames } from 'src/router'
import { pageToOffset, api } from 'src/services'
import type { Animal, MultipleAnimalsResponse } from 'src/services/api'
import useAsync from 'src/utils/use-async'
import type { ComputedRef } from 'vue'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

export function useAnimals () {
  const { animalsType, tag, username, metaChanged } = useAnimalsMeta()

  const animals = ref<Animal[]>([])
  const animalsCount = ref(0)
  const page = ref(1)

  async function fetchAnimals (): Promise<void> {
    animals.value = []
    let responsePromise: null | Promise<MultipleAnimalsResponse> = null

    if (animalsType.value === 'my-feed') {
      responsePromise = api.animals.getAnimalsFeed(pageToOffset(page.value))
        .then(res => res.data)
    } else if (animalsType.value === 'tag-feed' && tag.value) {
      responsePromise = api.animals.getAnimals({ tag: tag.value, ...pageToOffset(page.value) })
        .then(res => res.data)
    } else if (animalsType.value === 'user-feed' && username.value) {
      responsePromise = api.animals.getAnimals({ author: username.value, ...pageToOffset(page.value) })
        .then(res => res.data)
    } else if (animalsType.value === 'user-favorites-feed' && username.value) {
      responsePromise = api.animals.getAnimals({ favorited: username.value, ...pageToOffset(page.value) })
        .then(res => res.data)
    } else if (animalsType.value === 'global-feed') {
      responsePromise = api.animals.getAnimals(pageToOffset(page.value))
        .then(res => res.data)
    }

    if (responsePromise !== null) {
      const response = await responsePromise
      console.log(response)
      animals.value = response.animals
      animalsCount.value = response.animals.length
    } else {
      throw new Error(`Animals type "${animalsType.value}" not supported`)
    }
  }

  const changePage = (value: number): void => {
    page.value = value
  }

  const updateAnimal = (index: number, animal: Animal): void => {
    animals.value[index] = animal
  }

  const { active: animalsDownloading, run: runWrappedFetchAnimals } = useAsync(fetchAnimals)

  watch(metaChanged, async () => {
    if (page.value !== 1) changePage(1)
    else await runWrappedFetchAnimals()
  })

  watch(page, runWrappedFetchAnimals)

  return {
    fetchAnimals: runWrappedFetchAnimals,
    animalsDownloading,
    animals,
    animalsCount,
    page,
    changePage,
    updateAnimal,
    tag,
    username,
  }
}

export type AnimalsType = 'global-feed' | 'my-feed' | 'tag-feed' | 'user-feed' | 'user-favorites-feed'

export const animalsTypes: AnimalsType[] = ['global-feed', 'my-feed', 'tag-feed', 'user-feed', 'user-favorites-feed']
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export const isAnimalsType = (type: any): type is AnimalsType => animalsTypes.includes(type)

const routeNameToAnimalsType: Partial<Record<AppRouteNames, AnimalsType>> = {
  'global-feed': 'global-feed',
  'my-feed': 'my-feed',
  'tag': 'tag-feed',
  'profile': 'user-feed',
  'profile-favorites': 'user-favorites-feed',
}

interface UseAnimalsMetaReturn {
  tag: ComputedRef<string>
  username: ComputedRef<string>
  animalsType: ComputedRef<AnimalsType>
  metaChanged: ComputedRef<string>
}
function useAnimalsMeta (): UseAnimalsMetaReturn {
  const route = useRoute()

  const tag = ref('')
  const username = ref('')
  const animalsType = ref<AnimalsType>('global-feed')

  watch(
    () => route.name,
    routeName => {
      const possibleAnimalsType = routeNameToAnimalsType[routeName as AppRouteNames]
      if (!isAnimalsType(possibleAnimalsType)) return

      animalsType.value = possibleAnimalsType
    },
    { immediate: true },
  )

  watch(
    () => route.params.username,
    usernameParam => {
      if (usernameParam !== username.value) {
        username.value = typeof usernameParam === 'string' ? usernameParam : ''
      }
    },
    { immediate: true },
  )

  watch(
    () => route.params.tag,
    tagParam => {
      if (tagParam !== tag.value) {
        tag.value = typeof tagParam === 'string' ? tagParam : ''
      }
    },
    { immediate: true },
  )

  return {
    tag: computed(() => tag.value),
    username: computed(() => username.value),
    animalsType: computed(() => animalsType.value),
    metaChanged: computed(() => `${animalsType.value}-${username.value}-${tag.value}`),
  }
}
