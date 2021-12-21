<template>
  <q-page class="column flex-start items-stretch q-pa-md">

    <q-card flat bordered class="col-12 q-pa-md">
      <SeasonSelector />

      <div class="text-subtitle2 q-mt-md">Area filters:</div>
      <AreaSelector @areaSelect="selectedArea = $event" />

      <q-toggle class="text-subtitle2 q-mt-md" dense v-model="additionalFilters" color="black" label="Additional filters and chart component controls:" />
      <filter-slide
        :show="additionalFilters"
        :selectedArea="selectedArea"
        @update:selectedAreaOnly="onUpdateSelectedAreaOnly"
        @update:selectedSubAreas="onUpdateSelectedSubAreas"
        @update:activeParamsIndex="onUpdateActiveParamsIndex"
        @update:activeBar="onUpdateActiveBar"
        @update:showCI="onUpdateShowCI"
        @update:showTraps="onUpdateShowTraps"
      />
    </q-card>

    <q-card :key="activeSeason._id + '_' + activeCrop" flat bordered class="col-12 q-pa-md q-mt-md text-center">
      <q-card-section>
        <q-spinner-grid v-if="loading" size="lg" color="black" />

        <template v-else-if="showCharts">
        <Charts v-if="selectedAreaOnly"
          :timesteps="timesteps"
          :areaData="displayAggregatedData"
          :area="selectedArea || { level: 0, name: activeCountry.name }"
          :country="activeCountry"
          :controls="{ activeParams: activeParams.sort(), showTraps, activeBar, showCI }"
        />
        <Charts v-else v-for="displayArea in displayAreas"
          :key="displayArea._id ? displayArea._id : 'country'"
          :timesteps="timesteps"
          :areaData="displayAggregatedData.filter(
            el => displayArea.level === 0
              ? el.level === 0
              : displayArea._id === el.adm
          )"
          :area="displayArea"
          :country="activeCountry"
          :controls="{
            activeParams: activeParams.sort(),
            showTraps,
            activeBar,
            showCI
          }"
        />
        </template>

        <p v-else>Failed to collect data to display</p>
      </q-card-section>
    </q-card>

  </q-page>
</template>

<script>
import { defineComponent, ref, computed, watch } from 'vue'
import { useStore } from 'vuex'

import SeasonSelector from '../components/SeasonSelector'
import AreaSelector from '../components/AreaSelector'
import FilterSlide from '../components/FilterSlide.vue'
import Charts from '../components/charts/DataCharts'

export default defineComponent({
  name: 'PageDataCharts',
  components: {
    SeasonSelector,
    AreaSelector,
    FilterSlide,
    Charts
  },
  setup () {
    const
      { state, getters, dispatch } = useStore(),

      selectedArea = ref(null),
      additionalFilters = ref(false),
      selectedAreaOnly = ref(true),
      selectedSubAreas = ref([1, 2]),
      activeParamsIndex = ref([1, 2, 3, 4]),
      showTraps = ref(true),
      activeBar = ref('se'),
      showCI = ref(true),

      activeSeason = computed(() => getters.activeSeason),
      activeCrop = computed(() => state.seasons.activeCrop),
      displayAggregatedData = computed(
        () => !getters.activeSeasonAggregatedData.length ? []
          : getters.activeSeasonAggregatedData.filter(
            el => selectedAreaOnly.value ? (!selectedArea.value ? el.level === 0 : el.adm === selectedArea.value._id)
              : (!selectedArea.value ? el.level === 0 || selectedSubAreas.value.indexOf(el.level) > -1
                  : el.adm === selectedArea.value._id || (
                    el.level > selectedArea.value.level &&
                      selectedSubAreas.value.indexOf(el.level) > -1 &&
                      getters.activeSeasonAreas.find(elArea => elArea._id === el.adm).parentId.indexOf(selectedArea.value._id) > -1
                  )
                )
          )
      ),
      displayAreas = computed(
        () => selectedAreaOnly.value || !displayAggregatedData.value.length ? []
          : displayAggregatedData.value
            .map(el => el.level === 0 ? null : el.adm)
            .filter((el, i, arr) => arr.indexOf(el) === i)
            .map(el => !el ? { level: 0, name: activeCountry.value.name }
              : getters.activeSeasonAreas.find(elAreas => elAreas._id === el))
            .sort(
              (a, b) => a.level > b.level ? 1
                : a.level < b.level ? -1
                  : a.name > b.name ? 1
                    : -1)
      ),
      timesteps = computed(() => getters.countryLevelAggregatedDataTimesteps),
      activeCountry = computed(() => getters.activeCountry),
      loading = computed(() => (
        state.seasons.loading ||
        state.countries.loading ||
        state.areas.loading ||
        state.aggData.loading
      )),
      showCharts = computed(() => (
        getters.activeSeason &&
        getters.activeCountry &&
        displayAggregatedData.value.length
      )),
      activeParams = computed(
        () => activeCrop.value === 'Maize' ? activeParamsIndex.value
          : activeParamsIndex.value.filter(el => el < 4)
      ),
      onUpdateSelectedAreaOnly = event => {
        selectedAreaOnly.value = event
        if (!event) dispatch('getAggregatedData', { season: activeSeason.value._id })
      },
      onUpdateSelectedSubAreas = event => { selectedSubAreas.value = event },
      onUpdateActiveParamsIndex = event => { activeParamsIndex.value = event },
      onUpdateActiveBar = event => { activeBar.value = event },
      onUpdateShowCI = event => { showCI.value = event },
      onUpdateShowTraps = event => { showTraps.value = event }

    watch(selectedArea, val => {
      dispatch('getAggregatedData', { season: activeSeason.value._id, area: val ? val._id : 'country' })
    })
    watch(activeSeason, () => {
      selectedArea.value = null
    })

    return {
      selectedArea,
      additionalFilters,
      selectedAreaOnly,
      selectedSubAreas,
      activeParamsIndex,
      activeParams,
      showTraps,
      activeBar,
      showCI,
      activeSeason,
      activeCrop,
      displayAggregatedData, // areaAggData,
      displayAreas,
      timesteps, // countryDataTimesteps,
      activeCountry,
      loading,
      showCharts,
      onUpdateSelectedAreaOnly,
      onUpdateSelectedSubAreas,
      onUpdateActiveParamsIndex,
      onUpdateActiveBar,
      onUpdateShowCI,
      onUpdateShowTraps
    }
  }
})
</script>
