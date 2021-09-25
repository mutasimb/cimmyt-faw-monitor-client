<template>
  <q-header elevated class="bg-white text-grey-10">
    <q-toolbar class="q-py-sm">

      <q-btn dense flat round icon="menu" @click="onClickMenu" />
      <q-avatar size="48px" class="q-mr-xs">
        <img src="icons/favicon-128x128.png" />
      </q-avatar>
      <q-toolbar-title class="text-weight-medium text-grey-10">{{ title }}</q-toolbar-title>

      <Avatar v-if="!(!user)" :name="user.name" @click="onClickAvatar" />

    </q-toolbar>
  </q-header>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

import Avatar from './Avatar.vue'

export default defineComponent({
  name: 'Header',
  components: { Avatar },
  setup (_, { emit }) {
    const
      { state } = useStore(),
      route = useRoute()

    return {
      user: computed(() => state.auth.user),
      title: computed(() => route.meta.title),
      onClickMenu: () => { emit('toggleLeft') },
      onClickAvatar: () => { emit('toggleRight') }
    }
  }
})
</script>
