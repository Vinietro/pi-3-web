<template>
  <div class="card">
    <div class="card-block">
      <p class="card-text">
        {{ comment.body }}
      </p>
    </div>

    <div class="card-footer">
      <AppLink
        name="profile"
        :params="{username: comment.User.username}"
        class="comment-author"
      >
        <img
          :src="comment.User.image"
          class="comment-author-img"
          :alt="comment.User.username"
        >
      </AppLink>

      &nbsp;

      <AppLink
        name="profile"
        :params="{username: comment.User.username}"
        class="comment-author"
      >
        {{ comment.User.username }}
      </AppLink>

      <span class="date-posted">{{ (new Date(comment.createdAt)).toLocaleDateString('pt-BR') }}</span>

      <span class="mod-options">
        <i
          v-if="showRemove"
          role="button"
          aria-label="Delete comment"
          class="ion-trash-a"
          @click="emit('remove-comment')"
        />
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Comment } from 'src/services/api'

interface Props {
  comment: Comment
  username?: string
}

interface Emits {
  (e: 'remove-comment'): boolean
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const showRemove = computed(() => props.username !== undefined && props.username === props.comment.User.username)
</script>
