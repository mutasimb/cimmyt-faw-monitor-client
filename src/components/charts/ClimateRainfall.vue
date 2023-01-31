<template>
  <v-chart :style="{ height: '300px' }" :option="options" />
</template>

<script>
import { defineComponent, ref, computed } from 'vue'
import { useStore } from 'vuex'

import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, GridComponent } from 'echarts/components'
import VChart /*, { THEME_KEY } */ from 'vue-echarts'

use([
  CanvasRenderer,
  BarChart,
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
          text: 'Rainfall Forecast',
          textStyle: {
            fontFamily: 'Roboto',
            fontWeight: 500
          }
        },
        xAxis: {
          type: 'category',
          name: 'Date',
          nameLocation: 'center',
          nameGap: 30,
          data: climateData.value[0].forecast.precTimesteps
        },
        yAxis: {
          type: 'value',
          name: 'Daily Total Rainfall (mm)',
          nameLocation: 'center',
          nameGap: 30
        },
        series: [
          {
            data: climateData.value[0].forecast.prec,
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.2)'
            },
            tooltip: {
              position: 'top',
              valueFormatter: val => `${val} mm`
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
