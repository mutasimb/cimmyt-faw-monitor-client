<template>
  <q-step icon="person" color="grey-10" title="Farmer" caption="Fill up the contact information of the farmer">
    <form @submit.prevent="onSubmit">
      <q-input class="q-mb-sm" outlined v-model="farmerName" label="Farmer's name" />
      <q-input class="q-mb-sm" outlined v-model="farmerPhone" label="Farmer's phone number" />
      <div class="text-subtitle1 q-mt-sm">
        User of the phone
        <q-option-group
          class="q-mb-md"
          dense
          v-model="farmerPhoneUser"
          :options="[
            { label: 'Self', value: 'Self' },
            { label: 'Son / Daughter', value: 'Son / Daughter' },
            { label: 'Spouse', value: 'Spouse' },
            { label: 'Sibling', value: 'Sibling' },
            { label: 'Other', value: 'Other' }
          ]"
          color="grey-10"
        />
      </div>
      <q-input class="q-mb-sm" outlined v-model="farmerAddress" label="Farmer's address" />
      <q-checkbox class="q-mb-sm" v-model="farmerLandOwner" label="Owner of the land" color="grey-10" />
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
      farmerName = computed({ get: () => form.value.farmerName, set: val => { commit('mutateForm', ['farmerName', val]) } }),
      farmerPhone = computed({ get: () => form.value.farmerPhone, set: val => { commit('mutateForm', ['farmerPhone', val]) } }),
      farmerPhoneUser = computed({ get: () => form.value.farmerPhoneUser, set: val => { commit('mutateForm', ['farmerPhoneUser', val]) } }),
      farmerAddress = computed({ get: () => form.value.farmerAddress, set: val => { commit('mutateForm', ['farmerAddress', val]) } }),
      farmerLandOwner = computed({ get: () => form.value.farmerLandOwner, set: val => { commit('mutateForm', ['farmerLandOwner', val]) } }),
      disableSubmission = computed(() => !farmerName.value || !farmerPhone.value || !farmerPhoneUser.value || !farmerAddress.value),
      onSubmit = () => { emit('nextStep') },
      onCancel = () => { emit('prevStep') }

    return { farmerName, farmerPhone, farmerPhoneUser, farmerAddress, farmerLandOwner, disableSubmission, onCancel, onSubmit }
  }
})
</script>
