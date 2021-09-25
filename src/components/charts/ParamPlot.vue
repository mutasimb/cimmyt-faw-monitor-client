<template>
  <div class="plot-wrapper" ref="plotWrapper"><q-resize-observer @resize="onResize"/></div>
</template>

<script>
import { defineComponent, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { plot, frame, dot, line, text, ruleX, ruleY, areaY } from '@observablehq/plot'
import { extent } from 'd3-array'
import { timeWeek } from 'd3-time'
import { timeFormat } from 'd3-time-format'

export default defineComponent({
  name: 'ComponetSinglePlot',
  props: {
    param: { type: String, required: true },
    level: { type: Number, required: true },
    tsData: { type: Array, required: true },
    controls: { type: Object, required: true }
  },
  setup (props) {
    const
      plotWrapper = ref(null),
      h = ref(120),
      w = ref(null),
      mb = ref(50),
      colorBars = '#ff00ff',
      colorMoth = '#d95f0e',
      colorInfestation = '#31a354',
      { state, getters } = useStore(),
      activeSeason = () => getters.activeSeason,
      activeCrop = () => state.seasons.activeCrop,
      timesteps = props.tsData.map(el => el.timestep),
      isFirstBox = () => props.controls.activeParams.indexOf(props.param) === 0,
      isLastBox = () => props.controls.activeParams.length - 1 === props.controls.activeParams.indexOf(props.param),
      paramNames = () => {
        switch (props.param) {
          case 'sfw':
            return { yAxis: 'SFW Infestation (%)' }
          case 'iw':
            return { yAxis: activeCrop() === 'Maize' ? 'IW Infestation (%)' : 'IP Infestation (%)' }
          case 'cob':
            return { yAxis: 'Cob Infestation (%)' }
          case 'moth':
            return { yAxis: 'Moth Count (/ day / trap)' }
          default:
            return null
        }
      },
      domainX = () => extent(timesteps).map((el, i) => timeWeek.offset(el, i === 0 ? -1 : 1)),
      domainY = () => {
        const
          param = props.param === 'moth' ? 'count' : 'infestation',
          possibleMins = [0],
          possibleMaxs = [activeSeason().extents[`u_${param}_${props.level < 3 ? '012' : '3'}`]]

        if (props.level < 3 && props.controls.activeBar) {
          possibleMaxs.push(activeSeason().extents[`u_${param}_${props.controls.activeBar}`])
          possibleMins.push(activeSeason().extents[`l_${param}_${props.controls.activeBar}`])
        }
        if (props.level < 3 && props.controls.showCI) {
          possibleMaxs.push(activeSeason().extents[`u_${param}_ci95`])
          possibleMins.push(activeSeason().extents[`l_${param}_ci95`])
        }

        const
          y1 = Math.min(...possibleMins),
          y2 = Math.max(...possibleMaxs)

        return [y1, y2]
      },
      xPerPixel = width => (domainX()[1] - domainX()[0]) / width,
      yPerPixel = () => (domainY()[1] - domainY()[0]) / h.value,
      chartScaleX = () => ({
        domain: domainX(),
        ticks: timesteps,
        tickFormat: d => isLastBox() ? timeFormat('%b %-d')(d) : '',
        tickRotate: -45,
        label: isLastBox() ? 'Date' : null,
        labelAnchor: 'center',
        labelOffset: isLastBox() ? mb.value : 5
      }),
      chartScaleY = () => ({
        domain: domainY(),
        label: paramNames().yAxis,
        labelAnchor: 'center'
      }),
      areaMark = () => {
        const mark = []

        if (props.controls.showCI) {
          mark.push(areaY(props.tsData, {
            x: 'timestep',
            y1: d => d[props.param] || d[props.param] === 0
              ? d[props.param] - d[props.param + '_' + 'ci'] : null,
            y2: d => d[props.param] || d[props.param] === 0
              ? d[props.param] + d[props.param + '_' + 'ci'] : null,
            fill: props.param === 'moth' ? colorMoth : colorInfestation,
            fillOpacity: 0.35
          }))
        }

        return mark
      },
      mainMarks = () => {
        const
          marks = [],
          trapCounts = text(props.tsData, {
            x: 'timestep',
            y: d => {
              const
                y = d[props.param] + yPerPixel() * 10,
                possibleElevates = []

              if (d.traps > 1 && props.level < 3 && props.controls.activeBar) possibleElevates.push(d[props.param + '_' + props.controls.activeBar])
              if (d.traps > 1 && props.level < 3 && props.controls.showCI) possibleElevates.push(d[props.param + '_' + 'ci'])

              return y + (possibleElevates.length ? Math.max(...possibleElevates) : 0)
            },
            text: d => d.traps > 0 ? `${d.traps}` : null,
            fill: 'blue'
          })

        if (props.controls.showTraps) marks.push(trapCounts)
        marks.push(dot(props.tsData, {
          x: 'timestep',
          y: d => d[props.param],
          r: 3,
          fill: props.param === 'moth' ? colorMoth : colorInfestation
        }))
        marks.push(line(props.tsData, {
          x: 'timestep',
          y: d => d[props.param],
          stroke: props.param === 'moth' ? colorMoth : colorInfestation
        }))

        return marks
      },
      barMarks = width => {
        const marks = []

        if (props.controls.activeBar) {
          marks.push(
            ruleX(props.tsData, {
              x: 'timestep',
              y1: d => d[props.param] || d[props.param] === 0
                ? (d[props.param] - d[props.param + '_' + props.controls.activeBar]) : null,
              y2: d => d[props.param] || d[props.param] === 0
                ? (d[props.param] + d[props.param + '_' + props.controls.activeBar]) : null,
              stroke: colorBars,
              strokeWidth: 1.5
            })
          )
          marks.push(
            ruleY(props.tsData, {
              x1: d => new Date(d.timestep.getTime() - Math.round(xPerPixel(width) * 5)),
              x2: d => new Date(d.timestep.getTime() + Math.round(xPerPixel(width) * 5)),
              y: d => d[props.param] || d[props.param] === 0
                ? (d[props.param] - d[props.param + '_' + props.controls.activeBar]) : null,
              stroke: colorBars,
              strokeWidth: 1
            })
          )
          marks.push(
            ruleY(props.tsData, {
              x1: d => new Date(d.timestep.getTime() - Math.round(xPerPixel(width) * 5)),
              x2: d => new Date(d.timestep.getTime() + Math.round(xPerPixel(width) * 5)),
              y: d => d[props.param] || d[props.param] === 0
                ? (d[props.param] + d[props.param + '_' + props.controls.activeBar]) : null,
              stroke: colorBars,
              strokeWidth: 1
            })
          )
        }

        return marks
      },
      plotSVGElemConstructor = width => plot({
        width,
        height: h.value + (isLastBox() ? mb.value : 5) + (isFirstBox() ? 20 : 0),
        marginTop: isFirstBox() ? 20 : 0,
        marginBottom: isLastBox() ? mb.value : 5,
        grid: true,
        x: chartScaleX(),
        y: chartScaleY(),
        marks: [
          frame(),
          ...areaMark(),
          ...mainMarks(),
          ...barMarks(width - 60)
        ]
      }),
      appendPlot = plotElem => {
        const dataChartsChart = plotWrapper.value
        if (dataChartsChart) dataChartsChart.appendChild(plotElem)
      },
      removePLot = () => {
        const dataChartsChart = plotWrapper.value
        if (dataChartsChart && dataChartsChart.firstElementChild) dataChartsChart.removeChild(dataChartsChart.firstElementChild)
      },
      updatePlot = width => {
        removePLot()
        appendPlot(plotSVGElemConstructor(width > 640 ? 640 : width))
      },
      onResize = ({ width }) => {
        w.value = width
        updatePlot(width)
      }

    watch(() => props.controls.activeParams, () => { updatePlot(w.value) })
    watch(() => props.controls.showTraps, () => { updatePlot(w.value) })
    watch(() => props.controls.activeBar, () => { updatePlot(w.value) })
    watch(() => props.controls.showCI, () => { updatePlot(w.value) })

    return {
      plotWrapper,
      onResize
    }
  }
})
</script>

<style lang="scss">
.plot-wrapper {
  display: flex;
  justify-content: center;
  max-width: 100%;
  .plot {
    font-size: 10px;
    font-family: system-ui, sans-serif;
  }
}
</style>
