<template>
  <div class="column q-pa-md items-end text-right">
    <div class="text-h6 text-grey-10">{{ user.name }}</div>
    <div class="text-caption">{{ user.title }}</div>
    <div class="text-caption">{{ user.org }}</div>
    <div class="text-caption">{{ user.phone }}</div>
    <div v-if="user.email" class="text-caption">{{ user.email }}</div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ComponentUserInfo',
  props: {
    user: { type: Object, required: true }
  }
})
</script>
