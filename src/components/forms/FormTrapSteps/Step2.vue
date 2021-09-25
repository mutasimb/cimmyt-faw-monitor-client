<template>
  <q-step icon="my_location" color="grey-10" title="Field Area" :caption="caption">
    <form @submit.prevent="onSubmit">
      <q-select
        class="q-mb-sm"
        outlined
        v-model="adm_1"
        :options="optionsAdm1"
        option-label="NAME_1"
        option-value="GID_1"
        :label="formCountry.admNames[0]"
        @update:model-value="() => {
          adm_4 = null
          adm_3 = null
          adm_2 = null
        }"
      />
      <q-select
        class="q-mb-sm"
        outlined
        v-model="adm_2"
        :options="optionsAdm2"
        option-label="NAME_2"
        option-value="GID_2"
        :label="formCountry.admNames[1]"
        :disable="!adm_1"
        @update:model-value="() => {
          adm_4 = null
          adm_3 = null
        }"
      />
      <q-select
        class="q-mb-sm"
        outlined
        v-model="adm_3"
        :options="optionsAdm3"
        option-label="NAME_3"
        option-value="GID_3"
        :label="formCountry.admNames[2]"
        :disable="!adm_1 || !adm_2"
        @update:model-value="() => {
          adm_4 = null
        }"
      />
      <q-select v-if="!(formCountry.admNames.length < 4)"
        class="q-mb-sm"
        outlined
        v-model="adm_4"
        :options="optionsAdm4"
        option-label="NAME_4"
        option-value="GID_4"
        :label="formCountry.admNames[3]"
        :disable="!adm_1 || !adm_2 || !adm_3"
      />
      <q-stepper-navigation class="text-right">
        <q-btn flat type="button" color="grey-10" label="Go Back" @click="onCancel" />
        <q-btn style="min-width: 105px;" type="submit" color="grey-10" label="Next" :disable="disableSubmission"/>
      </q-stepper-navigation>
    </form>
  </q-step>
</template>

<script>
// handle user's default season
// handle single season, lock selection

import { defineComponent, computed, watch } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'ComponentFormTrapStep2',
  setup (_, { emit }) {
    const
      { state, commit } = useStore(),
      form = computed(() => state.forms.activeForm),
      // eslint-disable-next-line camelcase
      adm_1 = computed({ get: () => form.value.adm_1, set: val => { commit('mutateForm', ['adm_1', val]) } }),
      // eslint-disable-next-line camelcase
      adm_2 = computed({ get: () => form.value.adm_2, set: val => { commit('mutateForm', ['adm_2', val]) } }),
      // eslint-disable-next-line camelcase
      adm_3 = computed({ get: () => form.value.adm_3, set: val => { commit('mutateForm', ['adm_3', val]) } }),
      // eslint-disable-next-line camelcase
      adm_4 = computed({ get: () => form.value.adm_4, set: val => { commit('mutateForm', ['adm_4', val]) } }),
      countries = computed(() => state.countries.data),
      adm = computed(() => state.forms.adm),
      formCountry = computed(
        () => !form.value.season ? null
          : countries.value.find(el => el._id === form.value.season.country)
      ),
      caption = computed(
        () => `Please choose the ${
          !formCountry.value ? 'area' : formCountry.value.admNames.map(el => `'${el}'`).join(', ')
        } of the field`
      ),
      // eslint-disable-next-line camelcase
      adm_1_json = computed(
        () => !adm_1.value ? []
          : require(`../../../assets/adm/${adm_1.value.GID_1.toLowerCase()}.json`)
      ),
      optionsAdm1 = computed(() => !formCountry.value ? [] : adm.value[formCountry.value.code]),
      optionsAdm2 = computed(
        () => !adm_1_json.value.length ? []
          : adm_1_json.value
            .map(el => ({ GID_2: el.GID_2, NAME_2: el.NAME_2 }))
            .filter((el, i, arr) => arr.map(el1 => el1.GID_2).indexOf(el.GID_2) === i)
      ),
      optionsAdm3 = computed(
        () => !adm_2.value ? []
          : adm_1_json.value
            .filter(el => el.GID_2 === adm_2.value.GID_2)
            .map(el => ({ GID_3: el.GID_3, NAME_3: el.NAME_3 }))
            .filter((el, i, arr) => arr.map(el1 => el1.GID_3).indexOf(el.GID_3) === i)
      ),
      optionsAdm4 = computed(
        () => !adm_3.value || formCountry.value.admNames.length < 4 ? []
          : adm_1_json.value
            .filter(el => el.GID_3 === adm_3.value.GID_3)
            .map(el => ({ GID_4: el.GID_4, NAME_4: el.NAME_4 }))
            .filter((el, i, arr) => arr.map(el1 => el1.GID_4).indexOf(el.GID_4) === i)
      ),
      disableSubmission = computed(
        () => !formCountry.value ? true
          : formCountry.value.admNames.length < 4 ? (!adm_1.value || !adm_2.value || !adm_3.value)
            : (!adm_1.value || !adm_2.value || !adm_3.value || !adm_4.value)
      ),
      onSubmit = () => { emit('nextStep') },
      onCancel = () => { emit('prevStep') }

    watch(() => formCountry.value, () => {
      adm_1.value = null
      adm_2.value = null
      adm_3.value = null
      adm_4.value = null
    })

    return { adm_1, adm_2, adm_3, adm_4, optionsAdm1, optionsAdm2, optionsAdm3, optionsAdm4, caption, formCountry, disableSubmission, onCancel, onSubmit }
  }
})
</script>
