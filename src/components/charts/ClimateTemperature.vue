<template>
  <v-chart :style="{ height: '300px' }" :option="options" />
</template>

<script>
import { defineComponent, ref, computed } from 'vue'
import { useStore } from 'vuex'

import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, GridComponent } from 'echarts/components'
import VChart /*, { THEME_KEY } */ from 'vue-echarts'

use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  GridComponent
])

export default defineComponent({
  name: 'BarEchartsRainfall',
  components: {
    VChart
  },
  setup () {
    const
      { getters } = useStore(),
      climateData = computed(() => getters.climateData),
      options = ref({
        title: {
          text: 'Temperature Forecast',
          textStyle: {
            fontFamily: 'Roboto',
            fontWeight: 500
          }
        },
        xAxis: {
          type: 'time',
          name: 'Time',
          nameLocation: 'center',
          nameGap: 30,
          axisLabel: {
            formatter: '{MMM} {d}'
          }
        },
        yAxis: {
          type: 'value',
          name: 'Temperature (\u00B0C)',
          nameLocation: 'center',
          nameGap: 30
        },
        series: [
          {
            data: climateData.value[0].forecast.t2,
            type: 'line',
            smooth: true,
            tooltip: {
              position: 'top',
              valueFormatter: val => `${val}\u00B0C`
            }
          }
        ],
        tooltip: {
          trigger: 'axis'
        }
      })

    return { options }
  }
})
</script>
