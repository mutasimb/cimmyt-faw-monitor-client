import { api } from '../boot/axios.js'

export default {
  state: {
    loading: false,
    userData: []
    // trapScoutings: []
  },
  mutations: {
    setScoutingsLoadingState: (state, data) => { state.loading = data },
    setScoutingsUserData: (state, data) => { state.userData = data },
    appendScoutingsUserData: (state, data) => { state.userData.push(data) },
    setTrapScoutings: (state, data) => { state.trapScoutings = !data ? [] : data }
  },
  actions: {
    getScoutingsUserData ({ commit }) {
      return new Promise((resolve, reject) => {
        commit('setScoutingsLoadingState', true)

        api.get('/scouting-data/')
          .then(res => {
            commit('setScoutingsUserData', res.data)
            commit('setScoutingsLoadingState', false)
            resolve(res.data)
          })
          .catch(err => {
            commit('setScoutingsLoadingState', false)
            reject(err.response?.data || err.message)
          })
      })
    },
    getTrapScoutings ({ commit }, trapId) {
      commit('setTrapScoutings', [])
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve, reject) => {
        try {
          const getRes = await api.get(`/scouting-data/trap/${trapId}`)
          commit('setTrapScoutings', getRes.data)
          resolve(getRes.data)
        } catch (error) {
          reject(error)
        }
      })
    }
  }
}
