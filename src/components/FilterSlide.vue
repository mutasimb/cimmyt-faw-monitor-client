<template>
  <q-slide-transition>
    <div v-show="show">

      <div class="text-subtitle1 q-mt-sm">Charts:</div>
      <q-option-group
        v-model="selectedAreaOnly"
        :options="[
          { label: 'Display charts for selected area only', value: true },
          { label: 'Display charts for selected area and all of its sub-regions (requires downloding entire season\'s data)', value: false },
        ]"
        color="black"
        @update:model-value="onUpdateSelectedAreaOnly"
      />
      <q-slide-transition>
        <div v-show="!selectedAreaOnly">
          <q-option-group
            v-model="selectedSubAreas"
            inline
            :options="activeCountry.admNames
              .filter((_, i) => i < 3)
              .map((adm, i) => ({ label: adm, value: i+1 }))"
            color="black"
            type="checkbox"
            @update:model-value="onUpdateSelectedSubAreas"
          />
        </div>
      </q-slide-transition>

      <div class="text-subtitle1 q-mt-sm">Parameters to show:</div>
      <q-option-group
        v-model="activeParams"
        inline
        :options="activeSeason.params
          .map(param => ({
            label: param.nameParam + ' (' + param.unit + ')',
            value: param.keyParam
          }))"
        color="black"
        type="checkbox"
        @update:model-value="onUpdateActiveParams"
      />

      <div class="text-subtitle1 q-mt-sm">Chart components:</div>
      <q-option-group
        v-model="activeBar"
        inline
        :options="[
          { label: 'Standard Error', value: 'se' },
          { label: 'Standard Deviation', value: 'sd' },
          { label: 'None', value: '' },
        ]"
        color="black"
        @update:model-value="onUpdateActiveBar"
      />
      <div class="text-caption text-italic">Standard Error / Deviation data are not available for {{ activeCountry.admNames[2] }} level charts</div>

      <q-checkbox
        v-model="showCI"
        label="Show 95% Confidence Intervals"
        color="black"
        @update:model-value="onUpdateShowCI"
      />
      <div class="text-caption text-italic">Confidence Intervals data are not available for {{ activeCountry.admNames[2] }} level charts</div>

      <q-checkbox
        v-model="showTraps"
        label="Show trap counts"
        color="black"
        @update:model-value="onUpdateShowTraps"
      />
    </div>
  </q-slide-transition>
</template>

<script>
import { defineComponent, ref, computed, watch } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  props: {
    show: { type: Boolean, required: true },
    selectedArea: { type: Object }
  },
  setup (_, { emit }) {
    const
      { getters } = useStore(),

      selectedAreaOnly = ref(true),
      selectedSubAreas = ref([1, 2]),
      activeBar = ref('se'),
      showCI = ref(true),
      showTraps = ref(true),

      activeSeason = computed(() => getters.activeSeason),
      activeCountry = computed(() => getters.activeCountry),
      activeParams = ref([...activeSeason.value.params.map(param => param.keyParam)]),

      onUpdateSelectedSubAreas = val => { emit('update:selectedSubAreas', val) },
      onUpdateSelectedAreaOnly = val => { emit('update:selectedAreaOnly', val) },
      onUpdateActiveParams = val => { emit('update:activeParams', val) },
      onUpdateActiveBar = val => { emit('update:activeBar', val) },
      onUpdateShowCI = val => { emit('update:showCI', val) },
      onUpdateShowTraps = val => { emit('update:showTraps', val) }

    watch(activeSeason, val => {
      activeParams.value = [...val.params.map(param => param.keyParam)]
      emit('update:activeParams', [...val.params.map(param => param.keyParam)])
    })

    return {
      selectedAreaOnly,
      selectedSubAreas,
      activeParams,
      activeBar,
      showCI,
      showTraps,

      onUpdateSelectedSubAreas,
      onUpdateSelectedAreaOnly,
      onUpdateActiveParams,
      onUpdateActiveBar,
      onUpdateShowCI,
      onUpdateShowTraps,

      activeSeason,
      activeCountry
    }
  }
})
</script>
