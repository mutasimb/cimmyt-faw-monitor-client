<template>
  <div class="row justify-between q-col-gutter-md">
    <q-select
      clearable
      outlined
      class="col-12 col-md-4"
      :disable="disable || !optionsAdm1.length"
      v-model="selectedAdm.adm1"
      :options="optionsAdm1"
      :label="`${selectedAdm.adm1 ? country.admNames[0] : 'Select ' + country.admNames[0] + ` (${optionsAdm1.length})`}`"
      @update:model-value="() => onAreaSelect(1)"
      @clear="onClear"
    />
    <q-select
      clearable
      outlined
      class="col-12 col-md-4"
      :disable="disable || !optionsAdm2.length || !selectedAdm.adm1"
      v-model="selectedAdm.adm2"
      :options="optionsAdm2"
      :label="`${selectedAdm.adm2 ? country.admNames[1] : 'Select ' + country.admNames[1] + ` (${optionsAdm2.length})`}`"
      @update:model-value="() => onAreaSelect(2)"
      @clear="onClear"
    />
    <q-select
      clearable
      outlined
      class="col-12 col-md-4"
      :disable="disable || !optionsAdm3.length || !selectedAdm.adm2"
      v-model="selectedAdm.adm3"
      :options="optionsAdm3"
      :label="`${selectedAdm.adm3 ? country.admNames[2] : 'Select ' + country.admNames[2] + ` (${optionsAdm3.length})`}`"
      @update:model-value="() => onAreaSelect(3)"
      @clear="onClear"
    />
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs, computed, watch } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'AreaSelectorStatic',
  props: {
    adm1: { type: Array, required: true },
    adm2: { type: Array, required: true },
    adm3: { type: Array, required: true }
  },
  setup (props, { emit }) {
    const
      { state, getters } = useStore(),
      selectedAdm = reactive({ adm1: null, adm2: null, adm3: null }),
      { adm1, adm2, adm3 } = toRefs(props),
      optionsAdm1 = computed(() => !adm1.value || !adm1.value.length ? []
        : adm1.value.map(el => el.adm1)),
      optionsAdm2 = computed(() => !adm2.value || !adm2.value.length ? []
        : adm2.value
          .filter(el => !selectedAdm.adm1 || selectedAdm.adm1 === el.adm1)
          .map(el => el.adm2)),
      optionsAdm3 = computed(() => !adm3.value || !adm3.value.length ? []
        : adm3.value
          .filter(
            el => !selectedAdm.adm1 ? true
              : selectedAdm.adm1 === el.adm1 && (
                !selectedAdm.adm2 || selectedAdm.adm2 === el.adm2
              )
          )
          .map(el => el.adm3)),
      country = computed(() => getters.activeCountry),
      activeSeason = computed(() => state.seasons.active),
      disable = computed(() => (
        state.seasons.loading ||
        state.countries.loading ||
        state.traps.loading ||
        !getters.activeSeason ||
        !getters.activeCountry ||
        !getters.activeSeasonAreas.length
      ))

    watch(activeSeason, () => {
      selectedAdm.adm1 = null
      selectedAdm.adm2 = null
      selectedAdm.adm3 = null
    })

    return {
      selectedAdm,
      country,
      optionsAdm1,
      optionsAdm2,
      optionsAdm3,
      disable,
      onAreaSelect: level => {
        switch (level) {
          case 1:
            selectedAdm.adm2 = null
            selectedAdm.adm3 = null
            break
          case 2:
            selectedAdm.adm3 = null
            break
          default:
            break
        }
        emit('area-select', selectedAdm)
      },
      onClear: () => {
        emit('area-select', selectedAdm)
      }
    }
  }
})
</script>
