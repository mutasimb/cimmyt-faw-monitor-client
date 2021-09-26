import { api } from '../boot/axios.js'

export default {
  state: {
    loading: true,
    data: []
  },
  getters: {
    activeCountry: (state, _, __, rootGetters) =>
      !rootGetters.activeSeason || !state.data.length ? null
        : state.data.find(el => el._id === rootGetters.activeSeason.country)
  },
  mutations: {
    setCountriesLoadingState: (state, data) => { state.loading = data },
    setCountriesData: (state, data) => { state.data = data }
  },
  actions: {
    getCountries ({ commit }) {
      return new Promise((resolve, reject) => {
        commit('setCountriesLoadingState', true)
        api.get('/countries')
          .then(res => {
            commit('setCountriesData', res.data)
            commit('setCountriesLoadingState', false)
            resolve(res.data)
          })
          .catch(err => {
            commit('setCountriesLoadingState', false)
            reject(err)
          })
      })
    }
  }
}
