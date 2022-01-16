<template>
  <q-step icon="event" color="grey-10" title="Season" :caption="`Please choose the season of the crop`">
    <form @submit.prevent="onSubmit">
      <q-select
        class="q-mb-sm"
        outlined
        v-model="season"
        :options="userEditSeasons"
        option-label="name"
        option-value="_id"
        option-disable="closed"
        :disable="disableSeasonSelection"
        :error-message="disableSeasonSelection ? 'Sorry! You are not enlisted as a data collector for any of the active seasons.' : null"
        :error="disableSeasonSelection"
        label="Select Season"
        :readonly="userEditSeasons.length === 1 && userEditSeasons[0]._id === userDefaultSeason._id"
      />
      <q-stepper-navigation class="text-right">
        <q-btn style="min-width: 105px;" type="submit" color="black" label="Next" :disable="disableSubmission"/>
      </q-stepper-navigation>
    </form>
  </q-step>
</template>

<script>
// handle user's default season
// handle single season, lock selection

import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'ComponentFormTrapStep1',
  setup (_, { emit }) {
    const
      { state, getters, commit } = useStore(),
      form = computed(() => state.forms.activeForm),
      userEditSeasons = computed(() => getters.userEditSeasons),
      userDefaultSeason = computed(() => getters.userDefaultSeason),
      season = computed({ get: () => form.value.season, set: val => { commit('mutateForm', ['season', val]) } }),
      disableSeasonSelection = computed(() => userEditSeasons.value.filter(el => 'closed' in el && !el.closed).length === 0),
      disableSubmission = computed(() => !season.value),
      onSubmit = () => { emit('nextStep') }

    return { season, userEditSeasons, userDefaultSeason, disableSeasonSelection, disableSubmission, onSubmit }
  }
})
</script>
