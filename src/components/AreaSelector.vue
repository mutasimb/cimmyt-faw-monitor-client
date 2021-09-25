<template>
  <div class="row justify-between q-col-gutter-md">
    <q-select
      clearable
      outlined
      class="col-12 col-md-4"
      :disable="disable"
      v-model="selectedAdm.adm1"
      :options="optionsAdm1"
      option-label="name"
      option-value="_id"
      :label="`${selectedAdm.adm1 ? country.admNames[0] : 'Select ' + country.admNames[0] + ` (${optionsAdm1.length})`}`"
      @update:model-value="val => {
        selectedAdm.adm2 = null
        selectedAdm.adm3 = null
        onAreaSelect(val, 1)
      }"
    />
    <q-select
      clearable
      outlined
      class="col-12 col-md-4"
      :disable="disable || !selectedAdm.adm1"
      v-model="selectedAdm.adm2"
      :options="optionsAdm2"
      option-label="name"
      option-value="_id"
      :label="`${selectedAdm.adm2 ? country.admNames[1] : 'Select ' + country.admNames[1] + ` (${optionsAdm2.length})`}`"
      @update:model-value="val => {
        selectedAdm.adm3 = null
        onAreaSelect(val, 2)
      }"
    />
    <q-select
      clearable
      outlined
      class="col-12 col-md-4"
      :disable="disable || !selectedAdm.adm2"
      v-model="selectedAdm.adm3"
      :options="optionsAdm3"
      option-label="name"
      option-value="_id"
      :label="`${selectedAdm.adm3 ? country.admNames[2] : 'Select ' + country.admNames[2] + ` (${optionsAdm3.length})`}`"
      @update:model-value="val => {
        onAreaSelect(val, 3)
      }"
    />
  </div>
</template>

<script>
import { defineComponent, reactive, computed, watch } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'AreaSelector',
  setup (_, { emit }) {
    const
      { state, getters } = useStore(),
      selectedAdm = reactive({ adm1: null, adm2: null, adm3: null }),
      country = computed(() => getters.activeCountry),
      optionsAdm1 = computed(() => getters.activeSeasonAreasAdm1),
      optionsAdm2 = computed(() => getters.activeSeasonAreasAdm2
        .filter(el => !selectedAdm.adm1 || el.parentId[0] === selectedAdm.adm1._id)),
      optionsAdm3 = computed(
        () => getters.activeSeasonAreasAdm3.filter(
          el => !selectedAdm.adm1 && !selectedAdm.adm2 ? true
            : !selectedAdm.adm2 ? el.parentId[0] === selectedAdm.adm1._id
                : el.parentId[0] === selectedAdm.adm1._id && el.parentId[1] === selectedAdm.adm2._id
        )
      ),
      activeSeason = computed(() => state.seasons.active),
      disable = computed(() => (
        state.seasons.loading ||
        state.countries.loading ||
        state.areas.loading ||
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
      optionsAdm1,
      optionsAdm2,
      optionsAdm3,
      country,
      disable,
      onAreaSelect: (val, level) => {
        const newSelected = val || (level > 1 ? selectedAdm[`adm${level - 1}`] : null)
        emit('areaSelect', newSelected)
      }
    }
  }
})
</script>
