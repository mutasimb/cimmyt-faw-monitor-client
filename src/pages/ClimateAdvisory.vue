<template>
  <q-page class="column justify-start items-center q-pa-md">
    <q-spinner-grid
      v-if="climateLoading"
      color="black"
      size="3em"
      :style="{ position: 'fixed', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }"
    />
    <div v-else-if="!!climateError" class="row q-col-gutter-lg full-width">
      <div class="col">
        <q-card flat bordered class="col-12 q-pa-md">
          <div class="text-h6">Climate Based Advisories</div>
          <div class="text-body1 q-mt-md">{{ climateError }}</div>
        </q-card>
      </div>
    </div>
    <div v-else-if="climateData.length > 0 && !climateData[0].forecast">
      <div class="col">
        <q-card flat bordered class="col-12 q-pa-md">
          <div class="text-h6">Climate Based Advisories for {{ area }}</div>
          <div class="text-body1 q-mt-md">Weather forecast for this upazila is not yet available. Please visit later for advisories for today's monitoring activities.</div>
        </q-card>
      </div>
    </div>
    <template v-else>
      <div class="row q-col-gutter-lg full-width">
        <div class="col">
          <q-card flat bordered class="col-12 q-pa-md">
            <div class="text-h6">Climate Based Advisories for {{ area }}</div>
            <div class="text-body1 q-mt-md">{{ msgAdvisory }}</div>
          </q-card>
        </div>
      </div>
      <div class="row q-col-gutter-lg full-width q-mt-sm">
        <div class="col-12 col-md-6">
          <q-card flat bordered class="col-12 q-pa-md">
            <BarEchartsRainfall />
          </q-card>
        </div>
        <div class="col-12 col-md-6">
          <q-card flat bordered class="col-12 q-pa-md">
            <LineEchartsTemperature />
          </q-card>
        </div>
      </div>
    </template>
  </q-page>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'

import BarEchartsRainfall from '../components/charts/ClimateRainfall.vue'
import LineEchartsTemperature from '../components/charts/ClimateTemperature.vue'

import generateForecastMessage from '../utils/generate-forecast-message.js'

export default defineComponent({
  name: 'PageClimateAdvisory',
  components: {
    BarEchartsRainfall,
    LineEchartsTemperature
  },
  setup () {
    const
      { state, getters } = useStore(),
      climateLoading = computed(() => state.climate.loading),
      climateData = computed(() => getters.climateData),
      climateError = computed(() => getters.climateError),
      area = climateData.value[0]
        ? `${climateData.value[0].adm3} Upazila, ${climateData.value[0].adm2}`
        : '',
      msgAdvisory = climateData.value[0] && climateData.value[0].forecast
        ? generateForecastMessage({
          area: {
            adm2: climateData.value[0].adm2,
            adm3: climateData.value[0].adm3
          },
          prec: climateData.value[0].forecast.prec,
          t2: climateData.value[0].forecast.t2.map(el => el[1])
        })
        : ''

    return { climateLoading, area, msgAdvisory, climateData, climateError }
  }
})
</script>
