import { api } from '../boot/axios'

export default {
  state: {
    loading: false,
    data: [],
    availableData: [],
    availableSeasonData: []
  },
  getters: {
    activeSeasonAggregatedData: (state, _, rootState) =>
      !state.data.length || !rootState.seasons.active || !rootState.seasons.activeCrop ? []
        : state.data.filter(el => el.season === rootState.seasons.active && el.crop === rootState.seasons.activeCrop),
    countryLevelAggregatedDataTimesteps: (_, getters) =>
      getters.activeSeasonAggregatedData.filter(el => el.level === 0).map(el => el.timestep)
  },
  mutations: {
    setAggregatedDataLoadingState: (state, data) => { state.loading = data },
    appendAggregatedData: (state, { season, area, data }) => {
      state.data.push(...data)
      state.availableData.push({ season, area })
    },
    appendEntireSeasonAggregatedData: (state, { season, data }) => {
      state.data = state.data.filter(el => el.season !== season)
      state.data.push(...data)

      state.availableData = state.availableData.filter(el => el.season !== season)
      state.availableSeasonData.push(season)
    }
    // setAreaAggAllData: (state, data) => { state.allData = data },
    // setAreaCountryData: (state, data) => { state.countryData = data }
  },
  actions: {
    getAggregatedData ({ state, commit }, { season, area }) {
      return new Promise((resolve, reject) => {
        if (
          !area &&
          state.availableSeasonData.indexOf(season) === -1
        ) {
          commit('setAggregatedDataLoadingState', true)
          const params = { season }
          api.get('/aggregated-data', { params })
            .then(res => {
              commit('setAggregatedDataLoadingState', false)
              commit('appendEntireSeasonAggregatedData', { season, data: res.data })
              resolve()
            })
            .catch(err => {
              commit('setAggregatedDataLoadingState', false)
              reject(err)
            })
        } else if (
          state.availableSeasonData.indexOf(season) === -1 &&
          state.availableData.findIndex(el => el.season === season && el.area === area) === -1
        ) {
          commit('setAggregatedDataLoadingState', true)
          const params = { season, area }
          api.get('/aggregated-data', { params })
            .then(res => {
              commit('setAggregatedDataLoadingState', false)
              commit('appendAggregatedData', { season, area, data: res.data })
              resolve()
            })
            .catch(err => {
              commit('setAggregatedDataLoadingState', false)
              reject(err)
            })
        } else {
          resolve()
        }
      })
    },
    getAreaAggAllData ({ rootState, commit }) {
      commit('setAggDataLoading', true)
      return new Promise((resolve, reject) => {
        api.get(`/aggregated-data/${rootState.seasons.active}/`)
          .then(res => {
            commit('setAreaAggAllData', res.data)
            commit('setAggDataLoading', false)
            resolve(res.data)
          })
          .catch(err => {
            commit('setAggDataLoading', false)
            reject(err)
          })
      })
    }
  }
}
