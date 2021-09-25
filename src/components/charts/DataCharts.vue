<template>
  <div class="area-wrapper">
    <div class="text-h5 text-left q-mx-auto" style="max-width: 640px">{{areaText}}</div>
    <div class="text-subtitle2 text-left q-mx-auto" style="max-width: 640px">{{
      !area.level || area.level === 0 ? 'National' : country.admNames[area.level - 1]
    }} level aggregated data</div>
    <Chart v-for="param in activeParams"
      :key="param"
      :param="param"
      :level="area.level"
      :tsData="paramValues"
      :controls="{ ...controls, activeParams }"
    />
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { isoParse } from 'd3-time-format'

import Chart from './ParamPlot.vue'

export default defineComponent({
  name: 'ComponentCharts',
  components: { Chart },
  props: {
    timesteps: { type: Array, required: true },
    areaData: { type: Array, required: true },
    area: { type: Object, required: true },
    country: { type: Object, required: true },
    controls: { type: Object, required: true }
  },
  setup (props) {
    const
      areaText = computed(() => {
        const { level, name, parentNames } = props.area
        return level === 0
          ? `${name}`
          : level === 1
            ? `${name} ${props.country.admNames[0]}`
            : level === 2
              ? `${name}, ${parentNames[0]} ${props.country.admNames[0]}`
              : `${name} ${props.country.admNames[2]}, ${parentNames[1]}`
      }),
      selectedAreaTimesteps = computed(() => props.areaData.map(el => el.timestep)),
      paramValues = computed(() => props.timesteps.map(el => {
        const i = selectedAreaTimesteps.value.indexOf(el)
        return {
          timestep: isoParse(el),
          traps: i > -1 ? props.areaData[i].traps : null,
          moth: i > -1 ? props.areaData[i].count_pdpt : null,
          moth_sd: i > -1 ? props.areaData[i].count_sd : null,
          moth_se: i > -1 ? props.areaData[i].count_se : null,
          moth_ci: i > -1 ? props.areaData[i].count_ci95 : null,
          sfw: i > -1 ? props.areaData[i].sfw_percent : null,
          sfw_sd: i > -1 ? props.areaData[i].sfw_sd : null,
          sfw_se: i > -1 ? props.areaData[i].sfw_se : null,
          sfw_ci: i > -1 ? props.areaData[i].sfw_ci95 : null,
          iw: i > -1 ? props.areaData[i].iw_percent : null,
          iw_sd: i > -1 ? props.areaData[i].iw_sd : null,
          iw_se: i > -1 ? props.areaData[i].iw_se : null,
          iw_ci: i > -1 ? props.areaData[i].iw_ci95 : null,
          cob: i > -1 ? props.areaData[i].cob_percent : null,
          cob_sd: i > -1 ? props.areaData[i].cob_sd : null,
          cob_se: i > -1 ? props.areaData[i].cob_se : null,
          cob_ci: i > -1 ? props.areaData[i].cob_ci95 : null
        }
      })),
      activeParams = computed(() => props.controls.activeParams.map(el => {
        switch (el) {
          case 1:
            return 'moth'
          case 2:
            return 'sfw'
          case 3:
            return 'iw'
          case 4:
            return 'cob'
          default:
            return ''
        }
      }))

    return {
      areaText,
      paramValues,
      activeParams
    }
  }
})
</script>
