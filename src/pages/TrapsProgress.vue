<template>
  <q-page class="column flex-start items-stretch q-pa-md">

    <q-card flat bordered class="col-12 q-pa-md">
      <SeasonSelector />

      <div class="text-subtitle2 q-mt-md">Area filters:</div>
      <AreaSelector
        :adm1="activeSeasonSankey.filter(el => el.level === 1)"
        :adm2="activeSeasonSankey.filter(el => el.level === 2)"
        :adm3="activeSeasonSankey.filter(el => el.level === 3)"
        @area-select="onAreaSelect"
      />

    </q-card>

    <q-card flat bordered class="col-12 q-pa-md q-mt-md text-center">
      <q-card-section>
        <q-spinner-grid v-if="loading" size="lg" color="black" />

        <p v-else-if="activeSeason.closed">Sorry! The selected season has already been over.</p>

        <p v-else-if="!activeSeasonSankey.length">Sorry! No data available to display.</p>

        <Sankey v-else-if="title && countAdmN > 0"
          :key="key"
          :title="title"
          :count="countAdmN"
          :nodes="nodes"
          :links="links"
        />

        <p v-else>Sorry! Failed to collect data to display.</p>
      </q-card-section>
    </q-card>

  </q-page>
</template>

<script>
import { defineComponent, reactive, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { range } from 'd3-array'

import SeasonSelector from '../components/SeasonSelector.vue'
import AreaSelector from '../components/AreaSelectorStatic.vue'
import Sankey from '../components/charts/Sankey.vue'

const color = depth =>
  depth === 3 ? '#08519c'
    : depth === 2 ? '#2171b5'
      : depth === 1 ? '#4292c6'
        : depth === 0 ? '#6baed6'
          : '#bdbdbd'

export default defineComponent({
  name: 'PageDataTrapsProgress',
  components: {
    SeasonSelector,
    AreaSelector,
    Sankey
  },
  setup () {
    const
      { state, getters, dispatch } = useStore(),
      selectedAdm = reactive({ adm1: null, adm2: null, adm3: null }),
      key = computed(
        () => !selectedAdm.adm1 && !selectedAdm.adm2 && !selectedAdm.adm3 ? 'Country'
          : !selectedAdm.adm2 && !selectedAdm.adm3 ? `${selectedAdm.adm1}`
              : !selectedAdm.adm3 ? `${selectedAdm.adm1}::${selectedAdm.adm2}`
                  : `${selectedAdm.adm1}::${selectedAdm.adm2}::${selectedAdm.adm3}`
      ),
      loading = computed(() => state.traps.loading),
      activeSeason = computed(() => state.seasons.active),
      activeCountry = computed(() => getters.activeCountry),
      activeSeasonSankey = computed(() => state.traps.sankeyData),
      countAdmN = computed(
        () => loading.value || !activeSeasonSankey.value ? 0
          : nodes.value.filter(
            el => el.depth === (activeCountry.value.admNames.length - 1)
          ).length
      ),
      title = computed(
        () => !getters.sankeyCountryLevel
          ? ''
          : !selectedAdm.adm1 && !selectedAdm.adm2 && !selectedAdm.adm3
              ? `Traps in ${activeCountry.value.name} (installed / total expected): ${getters.sankeyCountryLevel.installed} / ${getters.sankeyCountryLevel.total}`
              : !selectedAdm.adm2 && !selectedAdm.adm3
                  ? `Traps in ${selectedAdm.adm1} ${activeCountry.value.admNames[0]} (installed / total expected): ${
                    activeSeasonSankey.value.find(el => el.adm1 === selectedAdm.adm1).installed
                  } / ${
                    activeSeasonSankey.value.find(el => el.adm1 === selectedAdm.adm1).total
                  }`
                  : !selectedAdm.adm3
                      ? `Traps in ${selectedAdm.adm2} ${activeCountry.value.admNames[1]} (installed / total expected): ${
                        activeSeasonSankey.value.find(el => el.adm2 === selectedAdm.adm2).installed
                      } / ${
                        activeSeasonSankey.value.find(el => el.adm2 === selectedAdm.adm2).total
                      }`
                      : `Traps in ${selectedAdm.adm3} ${activeCountry.value.admNames[2]} (installed / total expected): ${
                        activeSeasonSankey.value.find(el => el.adm3 === selectedAdm.adm3).installed
                      } / ${
                        activeSeasonSankey.value.find(el => el.adm3 === selectedAdm.adm3).total
                      }`
      ),
      nodes = computed(
        () => loading.value || !activeSeasonSankey.value ? []
          : range(activeCountry.value.admNames.length)
            .reduce((acc, i) => [
              ...acc,
              ...activeSeasonSankey.value
                .filter(
                  el => el.level === (i + 1) && (
                    !('adm1' in el) || !selectedAdm.adm1 || selectedAdm.adm1 === el.adm1
                  ) && (
                    !('adm2' in el) || !selectedAdm.adm2 || selectedAdm.adm2 === el.adm2
                  ) && (
                    !('adm3' in el) || !selectedAdm.adm3 || selectedAdm.adm3 === el.adm3
                  ))
                .map(el => {
                  const returnable = {
                    id: range(i + 1).map((_, level) => el[`adm${level + 1}`]).join('::'),
                    name: activeCountry.value.admNames.length === i + 1
                      ? el.name
                      : el[`adm${i + 1}`] + ' ' + activeCountry.value.admNames[i],
                    value: el.total,
                    depth: i,
                    itemStyle: { color: el.installed === el.total ? color(i) : '#bdbdbd' },
                    tooltip: {
                      formatter: d => {
                        let returnable = ''
                        if (d.data.depth === 0 || d.data.depth === 1) {
                          returnable += `<strong>${d.data.name}</strong><br/>`
                        } else if (d.data.depth === 2) {
                          returnable += activeCountry.value.admNames.length === 3
                            ? `<strong>${d.data.name}</strong> (${d.data.adm3} ${activeCountry.value.admNames[2]})<br/>`
                            : `<strong>${d.data.name}, ${d.data.adm2}</strong><br/>`
                        } else {
                          returnable +=
                            `<strong>${d.data.name}</strong><br/>` +
                            `(${d.data.adm4} ${activeCountry.value.admNames[3]}, ${d.data.adm3} ${activeCountry.value.admNames[2]}, ${d.data.adm2})<br/>` +
                            `Phone: ${d.data.phone}<br/>`
                        }

                        return returnable +
                          `Total traps installed: ${d.data.installed}<br/>` +
                          `Total traps expected: ${d.data.value}`
                      }
                    },
                    installed: el.installed,
                    notInstalled: el.notInstalled
                  }
                  if ('phone' in el) returnable.phone = el.phone
                  range(i + 1).forEach(el1 => {
                    returnable['adm' + (el1 + 1)] = el['adm' + (el1 + 1)]
                  })

                  return returnable
                })
            ], [])
      ),
      links = computed(
        () => loading.value || !activeSeasonSankey.value ? []
          : range(activeCountry.value.admNames.length - 1)
            .reduce((acc, i) => [
              ...acc,
              ...activeSeasonSankey.value
                .filter(el => el.level === (i + 2) && (
                  !('adm1' in el) || !selectedAdm.adm1 || selectedAdm.adm1 === el.adm1
                ) && (
                  !('adm2' in el) || !selectedAdm.adm2 || selectedAdm.adm2 === el.adm2
                ) && (
                  !('adm3' in el) || !selectedAdm.adm3 || selectedAdm.adm3 === el.adm3
                ))
                .map(el => ({
                  source: range(i + 1).map(level => el[`adm${level + 1}`]).join('::'),
                  sourceName: el['adm' + (i + 1)],
                  target: range(i + 2).map(level => el[`adm${level + 1}`]).join('::'),
                  targetName: el['adm' + (i + 2)],
                  value: el.total,
                  installed: el.installed,
                  notInstalled: el.notInstalled,
                  color: el.installed === el.total ? '#31a354' : '#bdbdbd'
                  // source: range(i + 1).map(level => el[`adm${level + 1}`]).join('::'),
                  // target: range(i + 2).map(level => el[`adm${level + 1}`]).join('::'),
                  // value: el.total,
                  // installed: el.installed,
                  // notInstalled: el.notInstalled,
                  // color: el.installed === el.total ? '#31a354' : '#bdbdbd'
                }))
            ], [])
      )

    dispatch('getTrapRegistrationProgressData', { season: state.seasons.active })

    watch(activeSeason, val => {
      dispatch('getTrapRegistrationProgressData', { season: state.seasons.active })
    })

    return {
      loading,
      countAdmN,
      key,
      activeSeason,
      activeSeasonSankey,
      nodes,
      links,
      title,
      onAreaSelect: obj => {
        selectedAdm.adm1 = obj.adm1
        selectedAdm.adm2 = obj.adm2
        selectedAdm.adm3 = obj.adm3
      }
    }
  }
})
</script>
