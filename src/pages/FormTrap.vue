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
      <Step2 :name="2" @nextStep="onNextStep" @prevStep="onPrevStep" />
      <Step3 :name="3" @nextStep="onNextStep" @prevStep="onPrevStep" />
      <Step4 :name="4" @nextStep="onNextStep" @prevStep="onPrevStep" />
      <Step5 :name="5" @nextStep="onNextStep" @prevStep="onPrevStep" :disable="form.farmerLandOwner" />
      <Step6 :name="6" @prevStep="onPrevStep" @submit="onSubmission"/>

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

    <DialogBox v-model="dialog" :dialogType="dialogType" :messages="messages" @dismiss="onDialogDismiss"/>
  </q-page>
</template>

<script>
import { defineComponent, ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

import Step1 from '../components/forms/FormTrapSteps/Step1'
import Step2 from '../components/forms/FormTrapSteps/Step2'
import Step3 from '../components/forms/FormTrapSteps/Step3'
import Step4 from '../components/forms/FormTrapSteps/Step4'
import Step5 from '../components/forms/FormTrapSteps/Step5'
import Step6 from '../components/forms/FormTrapSteps/Step6'
import DialogBox from '../components/forms/FormDialog.vue'

export default defineComponent({
  name: 'PageFormTrap',
  components: { Step1, Step2, Step3, Step4, Step5, Step6, DialogBox },
  setup () {
    let watchPositionID = null
    const
      { state, getters, commit, dispatch } = useStore(),
      router = useRouter(),

      dialog = ref(false),
      dialogType = ref(''),
      messages = ref([]),

      step = ref(1),
      geolocationStatus = ref('Detecting geolocation ...'),

      form = computed(() => state.forms.activeForm),

      transitionHandler = newStep => {
        switch (newStep) {
          case 3:
            messages.value = [
              "- Please note that the 'Installation Date and Time' refers to the date and time for <div class=\"text-bold\" style=\"display: inline; text-decoration: underline;\">when the trap was set up in the field</div>.",
              "- Place a tag on the trap, or write a big 'A', 'B' or 'C' on each of the traps with the help of a marker pen. Then select that tag from the 'Select Trap Tag' options."
            ]
            dialogType.value = 'notice'
            dialog.value = true
            break
          case 4:
            messages.value = [
              "- For various reasons, a farmer may not have a phone number of his own. The 'User of the phone' field refers to the person through whom the farmer can be contacted.",
              "- 'Owner of the land' refers to whether the farmer is the owner of the field of monitoring. If not, please uncheck the box and collect the contact information of the owner of the land."
            ]
            dialogType.value = 'notice'
            dialog.value = true
            break
          default:
            break
        }
      },
      beforeTransitionHandler = nextStep => {
        if (nextStep === 3 && form.value.season.crops.length === 1) commit('mutateForm', ['crop', form.value.season.crops[0]])
      },
      onNextStep = () => { step.value = step.value + (step.value === 4 && form.value.farmerLandOwner ? 2 : 1) },
      onPrevStep = () => { step.value = step.value - (step.value === 6 && form.value.farmerLandOwner ? 2 : 1) },
      onDialogDismiss = () => {
        dialog.value = false
        messages.value = []

        if (dialogType.value === 'success') router.push({ name: 'dashboard' })
        dialogType.value = ''
      },
      onSubmission = async () => {
        try {
          const registeredTrap = await dispatch('submitForm')
          commit('appendTrapsUserData', registeredTrap)

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
      commit('loadForm', 'trapRegistration')

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

    return { step, geolocationStatus, form, dialog, dialogType, messages, beforeTransitionHandler, transitionHandler, onNextStep, onPrevStep, onDialogDismiss, onSubmission }
  }
})
</script>
