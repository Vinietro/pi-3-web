<template>
  <AnimalDetailCommentsForm
    :animal-slug="slug"
    @add-comment="addComment"
  />

  <AnimalDetailComment
    v-for="comment in comments"
    :key="comment.id"
    :comment="comment"
    :username="username"
    @remove-comment="() => removeComment(comment.id)"
  />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { api } from 'src/services'
import type { Comment } from 'src/services/api'
import { useUserStore } from 'src/store/user'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import AnimalDetailComment from './AnimalDetailComment.vue'
import AnimalDetailCommentsForm from './AnimalDetailCommentsForm.vue'

const route = useRoute()
const slug = route.params.slug as string

const { user } = storeToRefs(useUserStore())

const username = computed(() => user.value?.username)

const comments = ref<Comment[]>([])

const addComment = async (comment: Comment) => {
  comments.value.unshift(comment)
}

const removeComment = async (commentId: number) => {
  await api.animals.deleteAnimalComment(slug, commentId)
  comments.value = comments.value.filter(c => c.id !== commentId)
}

comments.value = await api.animals.getAnimalComments(slug).then(res => res.data.comments)

</script>
