<template>
  <q-step icon="assignment" color="grey-10" title="Review" caption="Please review the filled up data">

    <div class="text-h6 q-mb-md">Collected form data</div>

    <div class="row row-review no-wrap">
      <div class="text-key text-subtitle2 text-weight-regular">Season</div>
      <div class="text-subtitle2">{{ form.season.name }}</div>
    </div>

    <q-separator spaced />

    <div class="row row-review">
      <div class="text-key text-subtitle2 text-weight-regular">Crop</div>
      <div class="text-subtitle2">{{ form.crop }}</div>
    </div>
    <div class="row row-review">
      <div class="text-key text-subtitle2 text-weight-regular">Area</div>
      <div class="text-subtitle2">{{ [...form.area.parentNames, form.area.name].reverse().join(', ') }}</div>
    </div>
    <div class="row row-review">
      <div class="text-key text-subtitle2 text-weight-regular">Trap</div>
      <div class="text-subtitle2">{{ userTraps.find(el => el._id === form.trap).tag }}</div>
    </div>

    <q-separator spaced />

    <div class="row row-review">
      <div class="text-key text-subtitle2 text-weight-regular">Moth count</div>
      <div class="text-subtitle2">{{ form.moth }}</div>
    </div>

    <q-separator spaced />

    <div class="row row-review">
      <div class="text-key text-subtitle2 text-weight-regular">Growth stage</div>
      <div class="text-subtitle2">{{ form.stage }}</div>
    </div>
    <div class="row row-review">
      <div class="text-key text-subtitle2 text-weight-regular">SFW count</div>
      <div class="text-subtitle2">{{ form.sfw }}</div>
    </div>
    <div class="row row-review">
      <div class="text-key text-subtitle2 text-weight-regular">IW count</div>
      <div class="text-subtitle2">{{ form.iw }}</div>
    </div>
    <div v-if="form.crop === 'Maize' && ['Cob Formation', 'Maturing'].indexOf(form.stage) > -1" class="row row-review">
      <div class="text-key text-subtitle2 text-weight-regular">Cob infestation count</div>
      <div class="text-subtitle2">{{ form.cob }}</div>
    </div>

    <q-stepper-navigation class="text-right">
      <q-btn flat type="button" color="grey-10" label="Go Back" @click="onCancel"/>
      <q-btn
        style="min-width: 105px;"
        type="button"
        color="grey-10"
        :label="formLoading ? null : 'Submit'"
        :disable="disableSubmission || formLoading"
        @click="onSubmit"
      ><q-spinner-dots v-if="formLoading" color="white"/></q-btn>
    </q-stepper-navigation>

  </q-step>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'ComponentFormScoutingStep5',
  setup (_, { emit }) {
    const
      { state } = useStore(),
      form = computed(() => state.forms.activeForm),
      formLoading = computed(() => state.forms.loading),
      userTraps = computed(() => state.traps.userData),
      longitude = computed(() => form.value.longitude),
      latitude = computed(() => form.value.latitude),
      disableSubmission = computed(() => !longitude.value || !latitude.value),
      onCancel = () => { emit('prevStep') },
      onSubmit = () => { emit('submit') }

    return { form, formLoading, userTraps, disableSubmission, onCancel, onSubmit }
  }
})
</script>

<style lang="scss" scoped>
.row-review > .text-key {
  min-width: 160px;
}
</style>
