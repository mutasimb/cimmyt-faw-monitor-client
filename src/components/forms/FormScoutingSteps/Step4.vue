<template>
  <q-step icon="eco" color="black" title="Infestation Data" caption="Enter the infestation data by scouting the crops around the trap">
    <form @submit.prevent="onSubmit">

      <div class="text-caption q-mt-md">Please select the observed growth stage of the plants in the field</div>
      <q-select outlined v-model="stage" :options="stages" label="Plant Growth Stage" />

      <div class="text-caption q-mt-md">Number of plants in field with Small Fresh Windowpane (SFW) damages</div>
      <q-input outlined v-model.number="sfw" label="Small Fresh Windowpane (SFW) damages count" type="number" :rules="infestationRules" />

      <div class="text-caption q-mt-md">Number of plants in field with {{
        crop === 'Maize' ? 'Infested Whorls (IW)' : 'Infested Plants (IP)'
      }}</div>
      <q-input outlined v-model.number="iw" :label="`${ crop === 'Maize' ? 'Infested Whorls (IW)' : 'Infested Plants (IP)' } count`" type="number" :rules="infestationRules" />

      <template v-if="crop === 'Maize'">
      <div class="text-caption">Number of plants in field with Infested Cobs</div>
      <q-input outlined v-model.number="cob" label="Cob infestation count" type="number" :disable="disableCob" :rules="infestationRules" />
      </template>

      <q-stepper-navigation class="text-right">
        <q-btn flat type="button" color="grey-10" label="Go Back" @click="onCancel" />
        <q-btn style="min-width: 105px;" type="submit" color="grey-10" label="Next" :disable="disableSubmission" />
      </q-stepper-navigation>
    </form>
  </q-step>
</template>

<script>
import { defineComponent, computed, watch } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'ComponentFormScoutingStep4',
  setup (_, { emit }) {
    const
      { state, commit } = useStore(),
      form = computed(() => state.forms.activeForm),
      crop = computed(() => form.value.crop),
      stage = computed({ get: () => form.value.stage, set: val => { commit('mutateForm', ['stage', val]) } }),
      sfw = computed({ get: () => form.value.sfw, set: val => { commit('mutateForm', ['sfw', val]) } }),
      iw = computed({ get: () => form.value.iw, set: val => { commit('mutateForm', ['iw', val]) } }),
      cob = computed({ get: () => form.value.cob, set: val => { commit('mutateForm', ['cob', val]) } }),

      disableCob = computed(() => ['Cob Formation', 'Maturing'].indexOf(stage.value) === -1),
      stages = computed(
        () => !crop.value ? []
          : crop.value !== 'Maize' ? ['Seedling', 'Vegetative', 'Reproductive']
            : ['VE - V2', 'V3 - V5', 'V6 - V8', 'V9 - V12', 'Tassel', 'Silking', 'Cob Formation', 'Maturing']
      ),
      infestationRules = [
        val => val < 0 ? 'Infestation count cannot be less than 0'
          : val.length === 0 ? 'Please enter a valid number'
            : !Number.isInteger(val) ? 'Infestation count cannot be a fraction'
                : val > 50 ? 'Infestation count cannot be greater than 50'
                  : true
      ],
      isParamInvalid = val => val < 0 || (val && val.length === 0) || !Number.isInteger(val) || val > 50,
      disableSubmission = computed(
        () => !crop.value ? true
          : crop.value === 'Maize' && !disableCob.value
            ? isParamInvalid(sfw.value) || isParamInvalid(iw.value) || isParamInvalid(cob.value)
            : isParamInvalid(sfw.value) || isParamInvalid(iw.value)
      ),
      onSubmit = () => { emit('nextStep') },
      onCancel = () => { emit('prevStep') }

    watch(() => stages.value, () => { stage.value = null })

    return { stage, stages, sfw, iw, cob, crop, infestationRules, disableCob, disableSubmission, onSubmit, onCancel }
  }
})
</script>
