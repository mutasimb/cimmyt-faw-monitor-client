<template>
  <q-avatar
    rounded
    class="non-selectable cursor-pointer"
    size="36px"
    @click="$emit('toggleRight')"
  >
    <img :src="`https://ui-avatars.com/api/?name=${name.split(' ').join('+')}&color=fff&background=212121&size=36`"/>
  </q-avatar>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ComponentAvatar',
  props: {
    name: { type: String, required: true }
  }
})
</script>
