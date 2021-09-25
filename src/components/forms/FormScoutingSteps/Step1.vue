<template>
  <q-step icon="event" color="grey-10" title="Season" caption="Please choose the season of the crop">
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
      />
      <q-stepper-navigation class="text-right">
        <q-btn style="min-width: 105px;" type="submit" color="black" label="Next" :disable="disableSubmission"/>
      </q-stepper-navigation>
    </form>
  </q-step>
</template>

<script>
import { defineComponent, computed, watch } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'ComponentFormScoutingStep1',
  setup (_, { emit }) {
    const
      { state, getters, commit } = useStore(),
      form = computed(() => state.forms.activeForm),
      season = computed({ get: () => form.value.season, set: val => { commit('mutateForm', ['season', val]) } }),
      userEditSeasons = computed(() => getters.userEditSeasons),
      disableSeasonSelection = computed(() => userEditSeasons.value.filter(el => 'closed' in el && !el.closed).length === 0),
      disableSubmission = computed(() => !season.value),
      onSubmit = () => { emit('nextStep') }

    watch(
      () => season.value,
      () => {
        commit('mutateForm', ['crop', null])
        commit('mutateForm', ['area', null])
        commit('mutateForm', ['trap', null])
        commit('mutateForm', ['moth', null])
        commit('mutateForm', ['stage', null])
        commit('mutateForm', ['sfw', null])
        commit('mutateForm', ['iw', null])
        commit('mutateForm', ['cob', null])
      }
    )

    return { season, userEditSeasons, disableSeasonSelection, disableSubmission, onSubmit }
  }
})
</script>
