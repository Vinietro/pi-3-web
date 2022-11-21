import { api } from 'src/services'
import type { Animal } from 'src/services/api'
import useAsync from 'src/utils/use-async'
import type { ComputedRef } from 'vue'

interface useFavoriteAnimalProps {
  isFavorited: ComputedRef<boolean>
  animalSlug: ComputedRef<string>
  onUpdate: (newAnimal: Animal) => void
}

export const useFavoriteAnimal = ({ isFavorited, animalSlug, onUpdate }: useFavoriteAnimalProps) => {
  const favoriteAnimal = async () => {
    const requestor = isFavorited.value ? api.animals.deleteAnimalFavorite : api.animals.createAnimalFavorite
    const animal = await requestor(animalSlug.value).then(res => res.data)
    onUpdate(animal)
  }

  const { active, run } = useAsync(favoriteAnimal)

  return {
    favoriteProcessGoing: active,
    favoriteAnimal: run,
  }
}
