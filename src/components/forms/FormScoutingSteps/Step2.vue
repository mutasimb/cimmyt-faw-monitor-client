<template>
  <q-step icon="my_location" color="grey-10" title="Field" caption="Please choose the crop, area and the tag of the trap of the field">
    <form @submit.prevent="onSubmit">
      <q-select
        :readonly="form.season.crops.length === 1"
        class="q-mb-sm"
        outlined
        v-model="crop"
        :options="form.season.crops"
        label="Select crop"
      />
      <q-select
        :readonly="trapAreas.length === 1"
        :disable="!trapAreas.length"
        class="q-mb-sm"
        outlined
        v-model="area"
        :options="trapAreas"
        option-value="_id"
        :option-label="opt => [...opt.parentNames, opt.name].reverse().join(', ')"
        :hint="!crop ? 'Please, choose the crop of the field first' : null"
        :error="crop && !trapAreas.length"
        :error-message="crop && !trapAreas.length ? 'You have no registered traps for the selected crop' : null"
        label="Select area"
      />

      <template v-if="crop && area">
        <div class="text-subtitle1 q-mt-md">Select Trap Tag</div>
        <q-option-group
          class="q-mb-sm"
          inline
          v-model="trap"
          :options="traps"
          color="black"
        />
      </template>

      <q-stepper-navigation class="text-right">
        <q-btn flat type="button" color="grey-10" label="Go Back" @click="onCancel" />
        <q-btn style="min-width: 105px;" type="submit" color="grey-10" label="Next" :disable="disableSubmission"/>
      </q-stepper-navigation>
    </form>
  </q-step>
</template>

<script>
import { defineComponent, computed, watch } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'ComponentFormScoutingStep2',
  setup (_, { emit }) {
    const
      { state, commit } = useStore(),
      form = computed(() => state.forms.activeForm),
      crop = computed({ get: () => form.value.crop, set: val => { commit('mutateForm', ['crop', val]) } }),
      area = computed({ get: () => form.value.area, set: val => { commit('mutateForm', ['area', val]) } }),
      trap = computed({ get: () => form.value.trap, set: val => { commit('mutateForm', ['trap', val]) } }),
      userTraps = computed(() => state.traps.userData),
      seasonCropTraps = computed(() => !form.value.season || !crop.value || !userTraps.value.length ? []
        : userTraps.value.filter(el => el.season === form.value.season._id && el.crop === crop.value)),
      trapAreas = computed(() => !seasonCropTraps.value.length ? []
        : seasonCropTraps.value
          .map(el => el.area)
          .filter((el, i, arr) => arr.map(el1 => el1._id).indexOf(el._id) === i)),
      traps = computed(() => {
        if (
          !form.value.season ||
          !userTraps.value.length ||
          !trapAreas.value.length ||
          !crop.value ||
          !area.value
        ) return []

        return userTraps.value
          .filter(el => el.area && '_id' in el.area ? el.area._id === area.value._id : false)
          .map(el => ({ value: el._id, label: el.tag }))
      }),
      disableSubmission = computed(() => !crop.value || !area.value || !trap.value),
      onSubmit = () => { emit('nextStep') },
      onCancel = () => { emit('prevStep') }

    watch(() => trapAreas.value, val => { area.value = val.length === 1 ? val[0] : null })
    watch(() => traps.value, val => { trap.value = val.length === 1 ? val[0].value : null })

    return { form, crop, area, trap, trapAreas, traps, disableSubmission, onCancel, onSubmit }
  }
})
</script>
