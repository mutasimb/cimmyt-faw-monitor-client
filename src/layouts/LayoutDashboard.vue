<template>
  <q-layout view="hHh LpR fFf">

    <Header @toggleLeft="onToggleLeftDrawer" @toggleRight="onToggleRightDrawer"/>

    <q-drawer show-if-above v-model="left" side="left" bordered>
      <LeftDrawerList />
    </q-drawer>

    <q-drawer v-model="right" side="right" bordered>
      <RightDrawerUserInfo v-if="!(!user)" :user="user" />
      <RightDrawerList />
    </q-drawer>

    <q-page-container class="bg-grey-1">
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import { defineComponent, ref, computed } from 'vue'
import { useStore } from 'vuex'

import Header from '../components/headers/HeaderDashboard.vue'
import LeftDrawerList from '../components/drawers/LeftDrawerList.vue'
import RightDrawerUserInfo from '../components/drawers/RightDrawerUserInfo.vue'
import RightDrawerList from '../components/drawers/RightDrawerList.vue'

export default defineComponent({
  name: 'LayoutDashboard',
  components: {
    Header,
    LeftDrawerList,
    RightDrawerUserInfo,
    RightDrawerList
  },
  setup () {
    const
      { state, getters, dispatch } = useStore(),
      left = ref(false),
      right = ref(false),
      activeSeasonAreas = computed(() => getters.activeSeasonAreas)

    dispatch('getTrapsUserData')
    dispatch('getScoutingsUserData')

    return {
      left,
      right,
      activeSeasonAreas,
      user: computed(() => state.auth.user),
      onToggleLeftDrawer: () => { left.value = !left.value },
      onToggleRightDrawer: () => { right.value = !right.value }
    }
  }
})
</script>
