<template>
  <q-list class="q-mt-md">
    <!-- when not logged in -->

    <template v-if="isActiveLayoutData">
      <q-item-label header>Monitoring: Aggregated Data</q-item-label>
      <ListItem route="data-charts" icon="insert_chart" label="Charts" />
      <!-- <ListItem route="data-bubble-plot" icon="bubble_chart" label="Bubble Plot" /> -->
      <!-- <ListItem path="/data/table" route="data-table" icon="view_list" label="Data Tables" /> -->

      <q-separator spaced />
      <q-item-label header>Monitoring: Field Data</q-item-label>

      <ListItem route="data-traps-progress" icon="checklist" label="Trap Registration Progress" />
    </template>

    <template v-else>
      <!-- when logged in -->

      <ListItem route="dashboard-home" icon="home" label="Home" />

      <template v-if="isDataCollector">
        <q-separator spaced />
        <q-item-label header>Data Collection Forms</q-item-label>

        <ListItem route="form-trap" icon="group_work" label="Trap Registration" />
        <ListItem route="form-scouting" icon="note_add" label="Scouting Data" />
      </template>

      <!-- <template v-if="isDataViewer">

      <q-separator spaced />
      <q-item-label header>Monitoring: Collected Field Data</q-item-label>

      <ListItem route="report-traps" icon="group_work" label="Trap Reports (Coming soon)" :disable="true" />
      <ListItem route="report-users" icon="nature_people" label="Collector Reports (Coming soon)" :disable="true" />
      <ListItem route="report-maps" icon="map" label="Maps (Coming soon)" :disable="true" />

      </template>-->

      <q-separator spaced />
      <q-item-label header>Monitoring: Aggregated Data</q-item-label>

      <ListItem route="dashboard-charts" icon="insert_chart" label="Charts" />
      <!-- <ListItem route="dashboard-bubble-plot" icon="bubble_chart" label="Bubble Plot" /> -->
      <!-- <ListItem route="dashboard-maps" icon="map" label="Maps (Coming soon)" :disable="true" /> -->
      <!-- <ListItem route="dashboard-tables" icon="view_list" label="Tables (Coming soon)" :disable="true" /> -->

      <q-separator spaced />
      <q-item-label header>Monitoring: Field Data</q-item-label>

      <ListItem route="dashboard-traps-progress" icon="checklist" label="Trap Registration Progress" />

      <q-separator spaced />
      <q-item-label header>Climate</q-item-label>

      <ListItem route="climate-advisory" icon="sunny" label="Climate Advisory" />
    </template>
  </q-list>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

import ListItem from './DrawerListItem.vue'

export default defineComponent({
  name: 'ComponentLeftDrawerList',
  components: {
    ListItem
  },
  setup () {
    const
      route = useRoute(),
      { getters } = useStore(),
      isActiveLayoutData = computed(() => route.meta.mode === 'data'),
      isDataCollector = computed(() => getters.isDataCollector),
      isDataViewer = computed(() => getters.isDataViewer)

    return {
      isActiveLayoutData,
      isDataCollector,
      isDataViewer
    }
  }
})
</script>
