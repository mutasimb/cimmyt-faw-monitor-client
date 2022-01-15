<template>
  <div class="area-wrapper">
    <div
      class="text-h5 text-left q-mx-auto"
      style="max-width: 640px"
    >{{areaText}}</div>
    <div
      class="text-subtitle2 text-left q-mx-auto"
      style="max-width: 640px"
    >{{ !area.level || area.level === 0 ? 'National' : country.admNames[area.level - 1] }} level aggregated data</div>
    <p v-if="areaData.length === 0"
      class="text-subtitle1 text-left q-mx-auto q-mt-md"
      style="max-width: 640px"
    >No data available to be shown for this area of the selected season!</p>
    <template v-for="(param, i) in controls.activeParams" :key="param['keyParam']">
      <Chart v-if="paramTimeseriesValues[i].length > 0"
        :param="param"
        :level="area.level"
        :tsData="paramTimeseriesValues[i]"
        :controls="controls"
      />
    </template>
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
      paramTimeseriesValues = computed(() => props.controls.activeParams.map(
        activeParam => props.timesteps.map(timestep => {
          const i = selectedAreaTimesteps.value.indexOf(timestep)

          return {
            timestep: isoParse(timestep),
            traps: i > -1
              ? props.areaData[i].traps
              : null,
            [activeParam.keyParam]: i > -1
              ? props.areaData[i][activeParam.keyParam + '_' + activeParam.keyUnit]
              : null,
            [activeParam.keyParam + '_sd']: i > -1
              ? props.areaData[i][activeParam.keyParam + '_sd']
              : null,
            [activeParam.keyParam + '_se']: i > -1
              ? props.areaData[i][activeParam.keyParam + '_se']
              : null,
            [activeParam.keyParam + '_ci']: i > -1
              ? props.areaData[i][activeParam.keyParam + '_ci95']
              : null
          }
        })
      ))

    return {
      areaText,
      paramTimeseriesValues
    }
  }
})
</script>
