<template>
  <q-page class="column flex-start items-stretch q-pa-md">
    <q-card flat bordered class="col-12 q-pa-md">
      <SeasonSelector />
    </q-card>

    <q-card :key="activeSeason._id + '_' + activeCrop" flat bordered class="col-12 q-pa-md q-mt-md text-center">
      <q-card-section>
        <q-spinner-grid v-if="loading" size="lg" color="black" />
        <Charts v-else
          :timesteps="timesteps"
          :areaData="displayData"
          :area="{ level: 0, name: activeCountry.name }"
          :country="activeCountry"
          :controls="{
            activeParams: activeSeason.params,
            showTraps: true,
            activeBar: 'se',
            showCI: true
          }"
        />
      </q-card-section>

      <!-- <q-separator /> -->

      <q-card-actions align="right">
        <q-btn outline :to="{ name: 'dashboard-charts' }" >Charts Details</q-btn>
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'

import SeasonSelector from '../components/SeasonSelector.vue'
import Charts from '../components/charts/DataCharts.vue'

export default defineComponent({
  name: 'PageDashboardHome',
  components: {
    SeasonSelector,
    Charts
  },
  setup () {
    const
      { state, getters } = useStore(),
      loading = computed(() => (
        state.seasons.loading ||
        state.countries.loading ||
        state.areas.loading ||
        state.aggData.loading
      )),
      timesteps = computed(() => getters.countryLevelAggregatedDataTimesteps),
      displayData = computed(() => getters.activeSeasonAggregatedData.filter(el => el.level === 0)),
      activeSeason = computed(() => getters.activeSeason),
      activeCrop = computed(() => state.seasons.activeCrop),
      activeCountry = computed(() => getters.activeCountry)

    return { loading, timesteps, displayData, activeSeason, activeCrop, activeCountry }
  }
})
</script>
