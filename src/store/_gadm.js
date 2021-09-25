import { api } from '../boot/axios'

export default {
  state: {
    status: '',
    BGD_adm1: {},
    BGD_adm2: {},
    BGD_adm3: {},
    NPL_adm1: {},
    NPL_adm2: {},
    NPL_adm3: {},
    MMR_adm1: {},
    MMR_adm2: {},
    MMR_adm3: {}
  },
  mutations: {
    setAdm: (state, { countryCode, level, geojson }) => { state[`${countryCode}_adm${level}`] = geojson },
    setGadmStatus: (state, data) => { state.status = data }
  },
  actions: {
    // getAdm ({ commit }, { level, countryCode }) {
    //   // eslint-disable-next-line no-async-promise-executor
    //   return new Promise(async (resolve, reject) => {
    //     try {
    //       const resAdm = await api.get(process.env.API + `/gadm/${countryCode}/${level}`)
    //       commit('setAdm', { countryCode, level, geojson: resAdm.data })
    //       resolve(resAdm.data)
    //     } catch (error) {
    //       reject(error)
    //     }
    //   })
    // },
    getAdm ({ commit }, { countryCode, level }) {
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve, reject) => {
        try {
          const resAdm = await api.get(`/gadm/${countryCode}/${level}`)
          commit('setAdm', { countryCode, level, geojson: resAdm.data })
          localStorage.setItem(`${countryCode}_adm${level}`, JSON.stringify(resAdm.data))
          resolve(resAdm.data)
        } catch (err) {
          console.log(err)
          reject(err)
        }
      })
    }
    // getAdmDeprecated ({ commit, dispatch }, level) {
    //   return new Promise(async (resolve, reject) => {
    //     try {
    //       let storage_adm = localStorage.getItem('adm' + level)
    //       let res_timestamp_adm_new = await axios.get(
    //         process.env.API + '/api/timestamp/adm' + level
    //       )
    //       let { timestamp } = res_timestamp_adm_new.data

    //       if (!storage_adm) {
    //         let geojson_adm_new = await dispatch('getAdmCallGeoJSON', {
    //           level,
    //           timestamp
    //         })
    //         resolve(geojson_adm_new)
    //       } else {
    //         let geojson_adm = JSON.parse(storage_adm)
    //         if (!('timestamp' in geojson_adm)) {
    //           let geojson_adm_new = await dispatch('getAdmCallGeoJSON', {
    //             level,
    //             timestamp
    //           })
    //           resolve(geojson_adm_new)
    //         } else {
    //           let isNewAdmAvailable =
    //             new Date(timestamp) > new Date(geojson_adm.timestamp)
    //           if (isNewAdmAvailable) {
    //             let geojson_adm_new = await dispatch('getAdmCallGeoJSON', {
    //               level,
    //               timestamp
    //             })
    //             resolve(geojson_adm_new)
    //           } else {
    //             commit('setAdm', {
    //               level,
    //               geojson: geojson_adm
    //             })
    //             resolve(geojson_adm)
    //           }
    //         }
    //       }
    //     } catch (err) {
    //       reject(err)
    //     }
    //   })
    // }
  }
}
