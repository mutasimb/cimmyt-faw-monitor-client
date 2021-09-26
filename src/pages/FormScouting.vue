<template>
  <q-page class="column justify-center items-center q-pa-md">
    <q-stepper
      v-if="!(!form)"
      v-model="step"
      flat
      bordered
      vertical
      animated
      style="width: 100%; max-width: 599px"
      @transition="transitionHandler"
      @before-transition="beforeTransitionHandler"
    >
      <Step1 :name="1" @nextStep="onNextStep" />
      <Step2 :name="2" @prevStep="onPrevStep" @nextStep="onNextStep" />
      <Step3 :name="3" @prevStep="onPrevStep" @nextStep="onStep3NextStep" />
      <Step4 :name="4" @prevStep="onPrevStep" @nextStep="onNextStep" />
      <Step5 :name="5" @prevStep="onPrevStep" @submit="onSubmission" />
    </q-stepper>
    <div
      v-if="geolocationStatus"
      :class="[
        'text-caption',
        'text-bold',
        'q-px-md',
        geolocationStatus === 'Detecting geolocation ...' ? 'text-positive' : 'text-negtive'
      ]"
      style="width: 100%; max-width: 599px"
    >{{ geolocationStatus }}</div>

    <DialogBox v-model="dialog" :dialogType="dialogType" :messages="messages" @dismiss="onDialogDismiss" :dismissFn="dialogDismissFn"/>
    <DialogScoutingInstructionsBox v-model="scoutingInstructions" @dismiss="onDialogDismiss"/>
  </q-page>
</template>

<script>
import { defineComponent, ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

import Step1 from '../components/forms/FormScoutingSteps/Step1.vue'
import Step2 from '../components/forms/FormScoutingSteps/Step2.vue'
import Step3 from '../components/forms/FormScoutingSteps/Step3.vue'
import Step4 from '../components/forms/FormScoutingSteps/Step4.vue'
import Step5 from '../components/forms/FormScoutingSteps/Step5.vue'
import DialogBox from '../components/forms/FormDialog.vue'
import DialogScoutingInstructionsBox from '../components/forms/FormDialogScoutingInstructions.vue'

export default defineComponent({
  name: 'PageFormScouting',
  components: { Step1, Step2, Step3, Step4, Step5, DialogBox, DialogScoutingInstructionsBox },
  setup () {
    let watchPositionID = null
    const
      { state, getters, commit, dispatch } = useStore(),
      router = useRouter(),

      dialog = ref(false),
      dialogType = ref(''),
      messages = ref([]),
      dialogDismissFn = ref(null),
      scoutingInstructions = ref(false),

      step = ref(1),
      geolocationStatus = ref(''),

      form = computed(() => state.forms.activeForm),

      transitionHandler = newStep => {
        switch (newStep) {
          case 3:
            messages.value = [
              '- Count the number of fall armyworm moths that you find in your trap.'
            ]
            dialogType.value = 'notice'
            dialog.value = true
            break
          case 4:
            scoutingInstructions.value = true
            break
          default:
            break
        }
      },
      beforeTransitionHandler = nextStep => {
        if (nextStep === 2 && form.value.season.crops.length === 1) commit('mutateForm', ['crop', form.value.season.crops[0]])
      },
      onPrevStep = () => { step.value = step.value - 1 },
      onNextStep = () => { step.value = step.value + 1 },
      onDialogDismiss = () => {
        if (scoutingInstructions.value) {
          scoutingInstructions.value = false
        } else {
          dialogDismissFn.value = null
          dialog.value = false
          messages.value = []

          if (dialogType.value === 'success') router.push({ name: 'dashboard' })
          dialogType.value = ''
        }
      },
      onStep3NextStep = () => {
        messages.value = [
          '- Please empty the trap by throwing away the moth bodies and pouring water out of the trap.',
          '- Refill the trap with soapy water so it is prepared for catching more moths until next Monday.'
        ]
        dialogType.value = 'notice'
        dialog.value = true
        dialogDismissFn.value = () => {
          onDialogDismiss()
          onNextStep()
        }
      },
      onSubmission = async () => {
        try {
          const submittedData = await dispatch('submitForm')
          commit('appendScoutingsUserData', submittedData)

          dialogType.value = 'success'
          messages.value = ['You have successfully registered the trap']
          dialog.value = true
        } catch (err) {
          dialogType.value = 'error'
          messages.value = [err]
          dialog.value = true
        }
      }

    onMounted(() => {
      commit('loadForm', 'scouting')

      if (!navigator.geolocation) {
        geolocationStatus.value = 'Geolocation service not available'
      } else {
        geolocationStatus.value = 'Detecting geolocation ...'
        watchPositionID = navigator.geolocation.watchPosition(
          position => {
            geolocationStatus.value = ''
            commit('mutateForm', ['longitude', position.coords.longitude])
            commit('mutateForm', ['latitude', position.coords.latitude])
          },
          () => { geolocationStatus.value = 'Geolocation error' },
          { enableHighAccuracy: true, maximumAge: 0 }
        )
      }

      const selectableEditSeasons = getters.userEditSeasons.map(el => !el.closed)
      if (selectableEditSeasons.length === 1) commit('mutateForm', ['season', selectableEditSeasons[0]])
    })

    onBeforeUnmount(() => {
      navigator.geolocation.clearWatch(watchPositionID)
      commit('nullifyForm')
    })

    return {
      step,
      dialog,
      scoutingInstructions,

      form,
      geolocationStatus,
      dialogType,
      messages,

      transitionHandler,
      beforeTransitionHandler,
      dialogDismissFn,
      onPrevStep,
      onNextStep,
      onStep3NextStep,
      onDialogDismiss,
      onSubmission
    }
  }
})
</script>
