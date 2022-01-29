<template>
  <q-page class="column flex-start items-stretch q-pa-md">
    <q-card flat bordered class="col-12 q-pa-md">
      <SeasonSelector />
    </q-card>

    <q-table v-if="hasEditPermission"
      class="q-pa-md q-mt-md"
      style="max-width: 100%"
      flat
      bordered
      hide-pagination
      title="Registered Traps"
      :dense="isDense"
      :rows="seasonTraps"
      :columns="columnsTrap"
      row-key="name"
      no-data-label="You do not have any traps registered."
      :visible-columns="[]"
    />

    <q-table v-if="hasEditPermission"
      class="q-pa-md q-mt-md"
      style="max-width: 100%"
      flat
      bordered
      title="Scouting Data"
      :dense="isDense"
      :rows="seasonScoutings"
      :columns="columnsScouting"
      row-key="name"
      no-data-label="You have not submitted any scouting data for the selected season."
      :visible-columns="[]"
    />

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
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'
import { timeFormat } from 'd3-time-format'

import SeasonSelector from '../components/SeasonSelector.vue'
import Charts from '../components/charts/DataCharts.vue'

const
  columnsTrap = [
    {
      name: 'areaName',
      label: 'Location',
      field: row => row.area,
      align: 'left',
      sortable: true,
      required: true,
      format: val => val.name + ', ' + val.parentNames.slice(1).reverse().join(', ')
    }, {
      name: 'crop',
      label: 'Crop',
      field: 'crop',
      align: 'left',
      sortable: true,
      required: true
    }, {
      name: 'tag',
      label: 'Tag',
      field: 'tag',
      align: 'left',
      sortable: true,
      required: true
    }, {
      name: 'installation',
      label: 'Installed On',
      field: 'installationDate',
      align: 'right',
      sortable: true,
      required: true,
      format: val => timeFormat('%b %-d, %Y at %X')(new Date(val))
    }, {
      name: 'farmer',
      label: 'Farmer',
      field: row => row.farmer.name,
      align: 'left',
      required: true
    }
  ],
  columnsScouting = [
    {
      name: 'submission',
      label: 'Submitted On',
      field: 'submissionTime',
      align: 'right',
      sortable: true,
      required: true,
      format: val => timeFormat('%b %-d, %Y at %X')(new Date(val))
    }, {
      name: 'areaName',
      label: 'Location',
      field: row => row.adm4,
      align: 'left',
      sortable: true,
      required: true,
      format: val => val.name + ', ' + val.parentNames.slice(1).reverse().join(', ')
    }, {
      name: 'crop',
      label: 'Crop',
      field: 'crop',
      align: 'left',
      sortable: true,
      required: true
    }, {
      name: 'tag',
      label: 'Tag',
      field: 'tag',
      align: 'left',
      sortable: true,
      required: true
    }, {
      name: 'stage',
      label: 'Plant Growth Stage',
      field: 'stage',
      align: 'left',
      sortable: true,
      required: true
    }, {
      name: 'moth',
      label: 'Moth',
      field: 'moth',
      align: 'right',
      sortable: true,
      required: true
    }, {
      name: 'sfw',
      label: 'SFW Infestation',
      field: 'sfw',
      align: 'right',
      sortable: true,
      required: true
    }, {
      name: 'iw',
      label: 'IW Infestation',
      field: 'iw',
      align: 'right',
      sortable: true,
      required: true
    }, {
      name: 'cob',
      label: 'Cob Infestation',
      field: 'cob',
      align: 'right',
      sortable: true,
      required: true
    }
  ]

export default defineComponent({
  name: 'PageDashboardHome',
  components: {
    SeasonSelector,
    Charts
  },
  setup () {
    const
      { state, getters } = useStore(),
      $q = useQuasar(),
      loading = computed(() => (
        state.auth.loading ||
        state.seasons.loading ||
        state.countries.loading ||
        state.areas.loading ||
        state.aggData.loading
      )),
      timesteps = computed(() => getters.countryLevelAggregatedDataTimesteps),
      displayData = computed(() => getters.activeSeasonAggregatedData.filter(el => el.level === 0)),
      hasEditPermission = computed(() => getters.hasEditPermission),
      activeSeason = computed(() => getters.activeSeason),
      activeCrop = computed(() => state.seasons.activeCrop),
      activeCountry = computed(() => getters.activeCountry),
      seasonTraps = computed(() => getters.activeSeasonTraps),
      seasonScoutings = computed(
        () => [...getters.activeSeasonScoutings].sort(
          (a, b) => a.submissionTime < b.submissionTime ? 1 : -1
        )),
      isDense = computed(() => $q.screen.lt.md)

    return {
      loading,
      timesteps,
      displayData,
      activeSeason,
      activeCrop,
      activeCountry,
      hasEditPermission,
      isDense,
      seasonTraps,
      seasonScoutings,
      columnsTrap,
      columnsScouting
    }
  }
})
</script>
