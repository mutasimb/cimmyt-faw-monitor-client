<template>
  <q-layout view="lHh Lpr lFf">

    <Header />

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import { defineComponent } from 'vue'

import Header from '../components/headers/HeaderMain'

export default defineComponent({
  name: 'LayoutMain',
  components: {
    Header
  }
})
</script>
