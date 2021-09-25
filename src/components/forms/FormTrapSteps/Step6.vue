<template>
  <q-step icon="assignment" color="grey-10" title="Review" caption="Please review the filled up data">

    <div class="text-h6 q-mb-md">Collected form data</div>

    <div class="row row-review no-wrap">
      <div class="text-key text-subtitle2 text-weight-regular">Season</div>
      <div class="text-subtitle2">{{ form.season.name }}</div>
    </div>

    <q-separator spaced />

    <template v-if="isAreaSelected">
    <div class="row row-review">
      <div class="text-key text-subtitle2 text-weight-regular">{{ formCountry.admNames[0] }}</div>
      <div class="text-subtitle2">{{ form.adm_1.NAME_1 }}</div>
    </div>
    <div class="row row-review">
      <div class="text-key text-subtitle2 text-weight-regular">{{ formCountry.admNames[1] }}</div>
      <div class="text-subtitle2">{{ form.adm_2.NAME_2 }}</div>
    </div>
    <div class="row row-review">
      <div class="text-key text-subtitle2 text-weight-regular">{{ formCountry.admNames[2] }}</div>
      <div class="text-subtitle2">{{ form.adm_3.NAME_3 }}</div>
    </div>
    <div class="row row-review" v-if="formCountry.admNames.length > 3">
      <div class="text-key text-subtitle2 text-weight-regular">{{ formCountry.admNames[3] }}</div>
      <div class="text-subtitle2">{{ form.adm_4.NAME_4 }}</div>
    </div>
    </template>

    <q-separator spaced />

    <div class="row row-review">
      <div class="text-key text-subtitle2 text-weight-regular">Crop</div>
      <div class="text-subtitle2">{{ form.crop }}</div>
    </div>
    <div class="row row-review">
      <div class="text-key text-subtitle2 text-weight-regular">Trap tag</div>
      <div class="text-subtitle2">{{ form.tag }}</div>
    </div>
    <div class="row row-review">
      <div class="text-key text-subtitle2 text-weight-regular">Installed on</div>
      <div class="text-subtitle2">{{ installationDate }}</div>
    </div>

    <q-separator spaced />

    <div class="row row-review">
        <div class="text-key text-subtitle2 text-weight-regular">Farmer's name</div>
        <div class="text-subtitle2">{{ form.farmerName }}</div>
    </div>
    <div class="row row-review">
        <div class="text-key text-subtitle2 text-weight-regular">Farmer's phone number</div>
        <div class="text-subtitle2">{{ form.farmerPhone }}</div>
    </div>
    <div class="row row-review">
        <div class="text-key text-subtitle2 text-weight-regular">Farmer's phone user</div>
        <div class="text-subtitle2">{{ form.farmerPhoneUser }}</div>
    </div>
    <div class="row row-review">
      <div class="text-key text-subtitle2 text-weight-regular">Farmer's address</div>
      <div class="text-subtitle2">{{ form.farmerAddress }}</div>
    </div>
    <div class="row row-review">
      <div class="text-key text-subtitle2 text-weight-regular">Farmer owns land</div>
      <div class="text-subtitle2">{{ form.farmerLandOwner ? 'Yes' : 'No' }}</div>
    </div>

    <template v-if="!form.farmerLandOwner">
    <q-separator spaced />

    <div class="row row-review">
      <div class="text-key text-subtitle2 text-weight-regular">Owner's name</div>
      <div class="text-subtitle2">{{ form.landOwnerName }}</div>
    </div>
    <div class="row row-review">
      <div class="text-key text-subtitle2 text-weight-regular">Owner's phone number</div>
      <div class="text-subtitle2">{{ form.landOwnerPhone }}</div>
    </div>
    <div class="row row-review">
      <div class="text-key text-subtitle2 text-weight-regular">Owner's address</div>
      <div class="text-subtitle2">{{ form.landOwnerAddress }}</div>
    </div>
    </template>

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
import { timeParse, timeFormat } from 'd3-time-format'

export default defineComponent({
  name: 'ComponentFormTrapStep4',
  setup (_, { emit }) {
    const
      { state } = useStore(),
      countries = computed(() => state.countries.data),
      form = computed(() => state.forms.activeForm),
      formLoading = computed(() => state.forms.loading),
      formCountry = computed(() => !form.value.season ? null : countries.value.find(el => el._id === form.value.season.country)),

      disableSubmission = computed(() => !form.value.longitude || !form.value.latitude),
      isAreaSelected = computed(() => !formCountry.value ? false
        : formCountry.value.admNames.length > 3 ? !(!form.value.adm_1 || !form.value.adm_2 || !form.value.adm_3 || !form.value.adm_4)
          : !(!form.value.adm_1 || !form.value.adm_2 || !form.value.adm_3)),
      installationDate = computed(() => !form.value.installationDate ? ''
        : timeFormat('%B %-d, %Y at %-I:%M:%S %p')(timeParse('%Y-%m-%d %H:%M:%S')(
          form.value.installationDate
        ))),
      onCancel = () => { emit('prevStep') },
      onSubmit = () => { emit('submit') }

    return { form, formLoading, formCountry, installationDate, isAreaSelected, disableSubmission, onCancel, onSubmit }
  }
})
</script>

<style lang="scss" scoped>
.row-review > .text-key {
  min-width: 160px;
}
</style>
