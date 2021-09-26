import { api } from '../boot/axios.js'

export default {
  state: {
    loading: true,
    data: [],
    active: localStorage.selectedSeason || null,
    activeCrop: null
  },
  getters: {
    activeSeason: state =>
      !state.data.length || !state.active ? null
        : state.data.find(el => el._id === state.active),
    userDefaultSeason: (state, _, rootState) =>
      !rootState.auth.user || !state.data.length ? null
        : state.data.find(el => el._id === rootState.auth.user.defaultSeason),
    userEditSeasons: (state, __, rootState) => !rootState.auth.user ? []
      : rootState.auth.user.editSeasons
        .map(el => state.data.find(season => season._id === el))
        .filter(el => typeof el !== 'undefined'),
    activeSeasonStartDate: (_, getters) =>
      !getters.activeSeason ? null
        : new Date(getters.activeSeason.iY, getters.activeSeason.im - 1, getters.activeSeason.id),
    // seasonOptions: state => state.data.map(el => ({ label: el.name, value: el._id }))
    seasonOptions: state => state.data
  },
  mutations: {
    setSeasonsLoadingState (state, data) { state.loading = data },
    setSeasonsData (state, data) { state.data = data },
    setActiveSeason (state, data) {
      state.active = data
      localStorage.setItem('selectedSeason', data)

      if (state.data.length) {
        const activeSeason = state.data.find(el => data === el._id)
        state.activeCrop = activeSeason.crops.length === 1 ? activeSeason.crops[0] : 'Aggregated'
      }
    },
    setActiveCrop (state, data) { state.activeCrop = data }
  },
  actions: {
    getSeasons ({ commit, state }) {
      commit('setSeasonsLoadingState', true)
      return new Promise((resolve, reject) => {
        api.get('/seasons')
          .then(res => {
            const activeSeason = res.data.find(el => el._id === state.active)
            if (activeSeason && activeSeason.crops.length === 1) commit('setActiveCrop', activeSeason.crops[0])
            commit('setSeasonsData', res.data)
            commit('setSeasonsLoadingState', false)
            resolve(res.data)
          })
          .catch(err => {
            commit('setSeasonsLoadingState', false)
            reject(err)
          })
      })
    },
    selectSeason ({ dispatch, commit }, { season }) {
      commit('setActiveSeason', season)
      dispatch('getSeasonAreas', { season })
      dispatch('getAggregatedData', { season })
    }
  }
}
