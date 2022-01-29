import { api } from '../boot/axios'

export default {
  state: {
    loading: false,
    userData: []
    // allTraps: []
  },
  getters: {
    activeSeasonTraps: (state, _, __, rootGetters) =>
      !state.userData.length || !rootGetters.activeSeason || state.loading ? []
        : state.userData.filter(el => el.season === rootGetters.activeSeason._id)
    // trapAreas: (_, getters) => getters.activeSeasonTraps
    //   .map(el => el.area)
    //   .filter((el, i, arr) => arr.map(el1 => el1.gid).indexOf(el.gid) === i)
  },
  mutations: {
    setTrapsLoadingState: (state, data) => { state.loading = data },
    setTrapsUserData: (state, data) => { state.userData = data },
    appendTrapsUserData: (state, data) => { state.userData.push(data) }
    // setAllTraps: (state, data) => { state.allTraps = data.traps }
  },
  actions: {
    getTrapsUserData: ({ commit }) => {
      return new Promise((resolve, reject) => {
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
      })
    }
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
