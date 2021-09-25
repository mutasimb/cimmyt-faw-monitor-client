<template>
  <q-step icon="person_pin" color="grey-10" title="Land Owner" caption="Fill up the contact information of the land owner">
    <form @submit.prevent="onSubmit">
      <q-input class="q-mb-sm" outlined v-model="landOwnerName" label="Land owner's name" />
      <q-input class="q-mb-sm" outlined v-model="landOwnerPhone" label="Land owner's phone number" />
      <q-input class="q-mb-sm" outlined v-model="landOwnerAddress" label="Land owner's address" />
      <q-stepper-navigation class="text-right">
        <q-btn flat type="button" color="grey-10" label="Go Back" @click="onCancel"/>
        <q-btn style="min-width: 105px;" type="submit" color="grey-10" label="Next" :disable="disableSubmission"/>
      </q-stepper-navigation>
    </form>
  </q-step>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'ComponentFormTrapStep4',
  setup (_, { emit }) {
    const
      { state, commit } = useStore(),
      form = computed(() => state.forms.activeForm),
      landOwnerName = computed({ get: () => form.value.landOwnerName, set: val => { commit('mutateForm', ['landOwnerName', val]) } }),
      landOwnerPhone = computed({ get: () => form.value.landOwnerPhone, set: val => { commit('mutateForm', ['landOwnerPhone', val]) } }),
      landOwnerAddress = computed({ get: () => form.value.landOwnerAddress, set: val => { commit('mutateForm', ['landOwnerAddress', val]) } }),
      disableSubmission = computed(() => !landOwnerName.value || !landOwnerPhone.value || !landOwnerAddress.value),
      onSubmit = () => { emit('nextStep') },
      onCancel = () => { emit('prevStep') }

    return { landOwnerName, landOwnerPhone, landOwnerAddress, disableSubmission, onCancel, onSubmit }
  }
})
</script>
