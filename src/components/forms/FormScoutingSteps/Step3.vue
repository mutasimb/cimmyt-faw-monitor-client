<template>
  <q-step icon="bug_report" color="black" title="Moth Count Data" caption="Enter the moth count from the trap">
    <form @submit.prevent="onSubmit">

      <div class="text-caption q-mt-md">Total number of fall armyworm moths you have counted in the trap</div>
      <q-input
        class="q-mb-sm"
        outlined
        v-model.number="moth"
        type="number"
        label="Moth count"
        :rules="mothRules"
      />

      <q-stepper-navigation class="text-right">
        <q-btn flat type="button" color="grey-10" label="Go Back" @click="onCancel" />
        <q-btn style="min-width: 105px;" type="submit" color="grey-10" label="Next" :disable="isMothInvalid" />
      </q-stepper-navigation>
    </form>
  </q-step>
</template>

<script>
import { defineComponent, ref, computed } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'ComponentFormScoutingStep3',
  setup (_, { emit }) {
    const
      { state, commit } = useStore(),
      disableSubmission = ref(true),
      form = computed(() => state.forms.activeForm),
      moth = computed({ get: () => form.value.moth, set: val => { commit('mutateForm', ['moth', val]) } }),
      isMothInvalid = computed(() => moth.value < 0 || (moth.value && moth.value.length === 0) || !Number.isInteger(moth.value)),
      mothRules = [
        val => val < 0 ? 'Moth count cannot be less than 0'
          : val.length === 0 ? 'Please enter a valid number'
            : !Number.isInteger(val) ? 'Moth count cannot be a fraction'
                : true
      ],
      onSubmit = () => { emit('nextStep') },
      onCancel = () => { emit('prevStep') }

    return { moth, isMothInvalid, mothRules, disableSubmission, onSubmit, onCancel }
  }
})
</script>
