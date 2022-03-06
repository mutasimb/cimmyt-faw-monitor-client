<template>
  <VChart :style="{ height, minHeight: '640px' }" :option="options"/>
</template>

<script>
import { defineComponent, ref, toRefs, computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { SankeyChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent
  // LegendComponent
} from 'echarts/components'
import VChart /*, { THEME_KEY } */ from 'vue-echarts'

use([
  CanvasRenderer,
  SankeyChart,
  TitleComponent,
  TooltipComponent
  // LegendComponent
])

export default defineComponent({
  name: 'SankeyEcharts',
  components: {
    VChart
  },
  props: {
    title: { type: String, required: true },
    count: { type: Number, required: true },
    nodes: { type: Array, required: true },
    links: { type: Array, required: true }
  },
  // provide: {
  //   [THEME_KEY]: 'light'
  // },
  setup (props) {
    const
      { title, count, nodes, links } = toRefs(props),
      height = computed(() => `${15 * count.value}px`),
      options = ref({
        title: {
          text: title.value,
          left: 'center',
          textStyle: {
            fontFamily: 'Roboto',
            fontWeight: 500
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: d => `${d.data.sourceName} > ${d.data.targetName}: ${d.data.value} traps are expected`
        },
        series: [
          {
            type: 'sankey',
            label: {
              formatter: d => d.name
            },
            data: nodes,
            links: links,
            emphasis: { focus: 'adjacency' },
            levels: [
              {
                depth: 0,
                lineStyle: { color: 'source', opacity: 0.6 }
              },
              {
                depth: 1,
                lineStyle: { color: 'source', opacity: 0.6 }
              },
              {
                depth: 2,
                lineStyle: { color: 'source', opacity: 0.6 }
              },
              {
                depth: 3,
                lineStyle: { color: 'source', opacity: 0.6 }
              }
            ],
            lineStyle: { curveness: 0.5 }
          }
        ]
      })

    return { options, height }
  }
})
</script>
