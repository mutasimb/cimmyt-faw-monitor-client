<template>
  <q-step icon="eco" color="grey-10" title="Field and Trap Specifications" :caption="caption">
    <form @submit.prevent="onSubmit">
      <q-select
        class="q-mb-sm"
        outlined
        :readonly="form.season.crops.length === 1"
        v-model="crop"
        :options="form.season.crops"
        label="Crop in the field"
      />
      <div class="text-subtitle1 q-mt-sm">
        Select Trap Tag
        <q-option-group
          class="q-mb-sm"
          inline
          v-model="tag"
          :options="[
            { label: 'A', value: 'A' },
            { label: 'B', value: 'B' },
            { label: 'C', value: 'C' },
            { label: 'D', value: 'D' },
            { label: 'E', value: 'E' },
            { label: 'F', value: 'F' },
            { label: 'G', value: 'G' },
            { label: 'H', value: 'H' },
            { label: 'I', value: 'I' },
          ].filter((el, i) => i < form.season.nTrap)"
          color="grey-10"
        />
      </div>
      <q-input
        readonly
        class="q-mb-sm"
        outlined
        v-model="installationDate"
        label="Trap installation date and time"
      >
        <template v-slot:prepend>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy transition-show="scale" transition-hide="scale">
              <q-date v-model="installationDate" mask="YYYY-MM-DD HH:mm:ss" today-btn color="grey-10" />
            </q-popup-proxy>
          </q-icon>
        </template>
        <template v-slot:append>
          <q-icon name="access_time" class="cursor-pointer">
            <q-popup-proxy transition-show="scale" transition-hide="scale">
              <q-time v-model="installationDate" mask="YYYY-MM-DD HH:mm:ss" now-btn color="grey-10" />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <q-stepper-navigation class="text-right">
        <q-btn flat type="button" color="grey-10" label="Go Back" @click="onCancel"/>
        <q-btn style="min-width: 105px;" type="submit" color="grey-10" label="Next" :disable="disableSubmission"/>
      </q-stepper-navigation>
    </form>
  </q-step>
</template>

<script>
import { defineComponent, computed, watch } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'ComponentFormTrapStep3',
  setup (_, { emit }) {
    const
      { state, commit } = useStore(),
      form = computed(() => state.forms.activeForm),
      crop = computed({ get: () => form.value.crop, set: val => { commit('mutateForm', ['crop', val]) } }),
      installationDate = computed({ get: () => form.value.installationDate, set: val => { commit('mutateForm', ['installationDate', val]) } }),
      tag = computed({ get: () => form.value.tag, set: val => { commit('mutateForm', ['tag', val]) } }),
      caption = computed(
        () => `Set the trap in the field, and tag the trap${
        !form.value.season ? ''
          : ` with any of the following: ${
            ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
              .filter((el, i) => i < form.value.season.nTrap)
              .map(el => `'${el}'`).join(', ')
          }`
        }`
      ),
      disableSubmission = computed(() => !crop.value || !installationDate.value || !tag.value),
      onSubmit = () => { emit('nextStep') },
      onCancel = () => { emit('prevStep') }

    watch(
      () => form.value.season,
      () => { crop.value = null }
    )

    return { form, crop, installationDate, tag, caption, disableSubmission, onCancel, onSubmit }
  }
})
</script>
