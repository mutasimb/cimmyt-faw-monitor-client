<template>
  <q-layout view="hHh LpR fFf">

    <Header @toggleLeft="onToggleDrawer" />

    <q-drawer show-if-above v-model="left" side="left" bordered>
      <LeftDrawerList />
    </q-drawer>

    <q-page-container class="bg-grey-1">
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'

import Header from '../components/headers/HeaderData'
import LeftDrawerList from '../components/drawers/LeftDrawerList'

export default defineComponent({
  name: 'LayoutData',
  components: {
    Header,
    LeftDrawerList
  },
  setup () {
    const left = ref(false)

    return {
      left,
      onToggleDrawer: () => { left.value = !left.value }
    }
  }
})
</script>
