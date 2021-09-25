<template>
  <q-page padding class="row flex-center items-stretch q-pa-md">
    <div class="col-12 col-md-8 column justify-center">
      <div class="text-h5 text-black text-uppercase q-mb-xs">Welcome to the</div>
      <div
        class="text-h2 text-black text-uppercase font-oswald text-weight-medium"
      >Fall Armyworm Monitor</div>
      <div class="text-caption text-italic q-mt-xs">
        A tool to collect population, incidence and severity data and empower
        smart integrated pest management decisions.
      </div>
      <div class="text-body1 text-black q-pr-xl q-mt-lg">
        FAW monitor is a tool for monitoring Fall Armyworm (FAW)
        population dynamics and field incidence in Bangladesh. The
        data represented on this website provide up-to-date information
        on population and incidence, as reported by the Department of
        Agricultural Extension (DAE) and will assist agricultural
        development planners, extension agents, and farmers to make
        informed integrated pest management decisions to mitigate the
        threat posed by Fall Armyworm. The Fall Armyworm Monitor is
        powered by data collected in real-time with association of DAE,
        BWMRI, BARI, BRRI, CSISA and CIMMYT with support from USAID.
        The information and data shown here do not necessarily reflect
        the views of USAID, the United States Government, and shall not
        be used for advertising purposes.
      </div>
      <div class="btns row q-gutter-sm q-mt-lg">
        <q-btn unelevated color="black" label="Data & Charts" @click="() => { $router.push({ name: 'data-charts' }) }" />
        <q-btn outline color="black" label="Partner Sign-in" @click="() => { $router.push({ name: 'auth' }); }" />
      </div>
    </div>
    <!-- <div
      class="col-12 col-md-6 column justify-center col-leaflet desktop-only"
      :class="[showMap ? 'items-stretch' : 'items-center']"
    >
      <LandingMap v-if="showMap" />
      <q-spinner-grid v-else size="2em" color="black" />
    </div> -->
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
// import { mapState } from 'vuex'

// import LandingMap from '../components/LandingMap'
// import InfestationMap from '../components/InfestationMap'

export default defineComponent({
  name: 'PageLanding'
})
// export default {
//   components: {
//     LandingMap,
//     InfestationMap
//   },
//   computed: {
//     ...mapState({
//       adm1: state => state.gadm.BGD_adm1,
//       adm2: state => state.gadm.BGD_adm2,
//       adm3: state => state.gadm.BGD_adm3
//     }),
//       latestDiv: state => state.data.latest.division,
//       latestDis: state => state.data.latest.district,
//       latestUpz: state => state.data.latest.upazila,
//       areaDiv: state => state.areas.divisions,
//       areaDis: state => state.areas.districts,
//       areaUpz: state => state.areas.upazilas,
//       user: state => state.auth.user
//     dataDiv () {
//       return this.latestDiv.length && this.areaDiv.length
//         ? this.latestDiv.map(el => {
//           let { areaCode } = this.areaDiv.find(div => div._id === el._id)
//           return {
//             ...el,
//             GID: areaCode[areaCode.length - 1]
//           }
//         })
//         : []
//     },
//     dataDis () {
//       return this.latestDis.length && this.areaDis.length
//         ? this.latestDis.map(el => {
//           let { areaCode } = this.areaDis.find(dis => dis._id === el._id)
//           return {
//             ...el,
//             GID: areaCode[areaCode.length - 1]
//           }
//         })
//         : []
//     },
//     dataUpz () {
//       return this.latestUpz.length && this.areaUpz.length
//         ? this.latestUpz.map(el => {
//           let { areaCode } = this.areaUpz.find(dis => dis._id === el._id)
//           return {
//             ...el,
//             GID: areaCode[areaCode.length - 1]
//           }
//         })
//         : []
//     },
//     showMap () {
//       return (
//         Object.keys(this.adm1).length > 0 &&
//         Object.keys(this.adm2).length > 0 &&
//         Object.keys(this.adm3).length > 0
//       )
//     }
//   }
// }
</script>
