<template>
  <q-spinner-grid
    v-if="loading || loadingUser || loadingSeasons || loadingCountries"
    color="black"
    size="3em"
    :style="{ position: 'fixed', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }"
  />
  <router-view v-else/>
</template>

<script>
import { defineComponent, ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

import setAuthToken from './utils/setAuthToken'
export default defineComponent({
  name: 'AppRoot',
  setup () {
    const
      { state, getters, dispatch } = useStore(),
      router = useRouter(),

      loading = ref(true),
      loadingUser = computed(() => state.auth.loadingUser),
      loadingSeasons = computed(() => state.seasons.loading),
      loadingCountries = computed(() => state.countries.loading)

    setAuthToken(localStorage.token)
    dispatch('getCountries')
      .then(() => dispatch('getSeasons'))
      .then(() => dispatch('loadUser'))
      .then(user => {
        console.log('triggering initial season data download for user:', user)
        dispatch('selectSeason', {
          season: typeof localStorage.selectedSeason === 'undefined'
            ? user.defaultSeason // activate user's default season if none found in localstorage
            : localStorage.selectedSeason // activate the one from localstorage
        })
      })
      .catch(() => {
        if (state.seasons.data.length) {
          console.log('triggering initial season data download inside app catch')
          dispatch('selectSeason', {
            season: typeof localStorage.selectedSeason === 'undefined'
              ? state.seasons.data.find(el => el.default)._id // activate app's default season if none found in localstorage
              : localStorage.selectedSeason // activate the one from localstorage
          })
        }
      })
      .finally(() => {
        console.log('Initial load finished!')
      })

    watch(
      () => getters.isAuthenticated,
      val => {
        router.push({ name: val ? 'dashboard-home' : 'home' })
        loading.value = false
      },
      { immediate: true }
    )

    Object.keys(localStorage)
      .forEach(el => {
        if (['selectedSeason', 'token'].indexOf(el) === -1) localStorage.removeItem(el)
      })

    return {
      loading,
      loadingUser,
      loadingSeasons,
      loadingCountries
    }
  }
})
</script>
