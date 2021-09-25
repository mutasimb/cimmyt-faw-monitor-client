import { api } from '../boot/axios'

export default {
  state: {
    loading: false,
    data: [],
    availableData: []
  },
  getters: {
    activeSeasonAreas: (state, _, rootState) =>
      !rootState.seasons.active || !rootState.seasons.activeCrop ? []
        : rootState.aggData.data
          .filter(
            el => el.season === rootState.seasons.active &&
              el.crop === rootState.seasons.activeCrop &&
              el.level !== 0
          )
          .map(el => el.adm)
          .filter((el, i, arr) => arr.indexOf(el) === i)
          .map(el => state.data.find(area => area._id === el))
          .sort((a, b) => a.name > b.name ? 1 : -1),
    activeSeasonAreasAdm1: (_, getters) => getters.activeSeasonAreas.filter(el => el.level === 1),
    activeSeasonAreasAdm2: (_, getters) => getters.activeSeasonAreas.filter(el => el.level === 2),
    activeSeasonAreasAdm3: (_, getters) => getters.activeSeasonAreas.filter(el => el.level === 3)
  },
  mutations: {
    setAreasLoadingState: (state, data) => { state.loading = data },
    appendAreas: (state, data) => { state.data.push(...data) },
    addToAvailableAreas: (state, data) => { state.availableData.push(data) }
  },
  actions: {
    getSeasonAreas ({ state, commit }, { season }) {
      return new Promise((resolve, reject) => {
        if (state.availableData.indexOf(season) === -1) {
          commit('setAreasLoadingState', true)
          const params = { season }
          api.get('/areas', { params })
            .then(res => {
              commit('appendAreas', res.data)
              commit('addToAvailableAreas', season)
              commit('setAreasLoadingState', false)
              resolve(res.data)
            })
            .catch(err => {
              commit('setAreasLoadingState', false)
              reject(err)
            })
        } else {
          resolve(state.data.filter(el => el.season === season))
        }
      })
    }
  }
}
