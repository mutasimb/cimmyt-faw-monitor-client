import { api } from '../boot/axios'

export default {
  state: {
    loading: false,
    userData: [],
    sankeyData: []
    // sankeyUsers: 0
    // allTraps: []
  },
  getters: {
    activeSeasonTraps: (state, _, __, rootGetters) =>
      !state.userData.length || !rootGetters.activeSeason || state.loading ? []
        : state.userData.filter(el => el.season === rootGetters.activeSeason._id),
    activeSeasonTrapsSankey: (state, _, __, rootGetters) =>
      !rootGetters.activeSeason || state.loading ? []
        : state.sankeyData.filter(el => el.season === rootGetters.activeSeason._id),
    sankeyCountryLevel: state => !state.sankeyData.length ? null
      : state.sankeyData
        .filter(el => el.level === 1)
        .reduce((acc, el) => ({
          installed: acc.installed + el.installed,
          notInstalled: acc.notInstalled + el.notInstalled,
          total: acc.total + el.total
        }), {
          installed: 0,
          notInstalled: 0,
          total: 0
        })
    // trapAreas: (_, getters) => getters.activeSeasonTraps
    //   .map(el => el.area)
    //   .filter((el, i, arr) => arr.map(el1 => el1.gid).indexOf(el.gid) === i)
  },
  mutations: {
    setTrapsLoadingState: (state, data) => { state.loading = data },
    setTrapsUserData: (state, data) => { state.userData = data },
    setTrapRegistrationProgressData: (state, data) => { state.sankeyData = data },
    // setTrapRegistrationProgressUsers: (state, data) => { state.sankeyUsers = data },
    appendTrapsUserData: (state, data) => { state.userData.push(data) }
    // setAllTraps: (state, data) => { state.allTraps = data.traps }
  },
  actions: {
    getTrapsUserData: ({ commit }) => new Promise((resolve, reject) => {
      commit('setTrapsLoadingState', true)

      api.get('/traps')
        .then(res => {
          commit('setTrapsUserData', res.data)
          commit('setTrapsLoadingState', false)
          resolve(res.data)
        })
        .catch(err => {
          commit('setTrapsLoadingState', false)
          reject(err.response?.data || err.message)
        })
    }),
    getTrapRegistrationProgressData: ({ commit }, { season }) => new Promise((resolve, reject) => {
      commit('setTrapsLoadingState', true)

      api.get('/traps/sankey', { params: { season } })
        .then(res => {
          commit('setTrapRegistrationProgressData', res.data.map(el => ({ season, ...el })))
          // commit('setTrapRegistrationProgressUsers', res.data.users)
          commit('setTrapsLoadingState', false)
          resolve(res.data)
        })
        .catch(err => {
          commit('setTrapsLoadingState', false)
          reject(err.response?.data || err.message)
        })
    })
    // getAllTraps ({ rootState, commit }) {
    //   // eslint-disable-next-line no-async-promise-executor
    //   return new Promise(async (resolve, reject) => {
    //     try {
    //       const getRes = await api.get(`/traps/all/${rootState.seasons.active}`)
    //       // debt massive
    //       // commit('setAllTraps', { season: rootState.seasons.active, traps: getRes.data })
    //       resolve(getRes.data)
    //     } catch (error) {
    //       reject(error)
    //     }
    //   })
    // }
  }
}
