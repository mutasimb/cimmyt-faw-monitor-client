<template>
  <q-header elevated class="bg-white text-grey-10">
    <q-toolbar class="q-py-sm">

      <q-btn dense flat round icon="menu" @click="onClickMenu" />
      <q-avatar size="48px" class="q-mr-xs">
        <img src="icons/favicon-128x128.png" />
      </q-avatar>

      <q-toolbar-title class="text-weight-medium text-grey-10">{{ title }}</q-toolbar-title>

      <q-btn flat no-caps label="Home" class="text-grey-10" @click="() => { push('home') }" />
      <q-btn flat no-caps label="Login" class="text-grey-10" @click="() => { push('auth') }" />

    </q-toolbar>
  </q-header>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  name: 'Header',
  setup (_, { emit }) {
    const
      route = useRoute(),
      router = useRouter()

    return {
      title: computed(() => route.meta.title),
      push: name => router.push({ name }),
      onClickMenu: () => { emit('toggleLeft') }
    }
  }
})
</script>
