import { api } from '../boot/axios'
import setAuthToken from '../utils/setAuthToken'

export default {
  state: {
    token: localStorage.getItem('token'),
    loading: false,
    loadingUser: true,
    user: null,
    error: ''
  },
  getters: {
    isAuthenticated: state => !(!state.user),
    hasViewPermission: (state, _, rootState) => !state.user || !rootState.seasons.active ? false
      : state.user.viewSeasons.indexOf(rootState.seasons.active) > -1,
    hasEditPermission: (state, _, rootState) => !state.user || !rootState.seasons.active ? false
      : state.user.editSeasons.indexOf(rootState.seasons.active) > -1,
    isDataCollector: (state, _, rootState) => state.user.editSeasons.filter(
      el => rootState.seasons.data.findIndex(season => season._id === el) > -1
    ).length > 0,
    isDataViewer: (state, _, rootState) => state.user.viewSeasons.filter(
      el => rootState.seasons.data.findIndex(season => season._id === el) > -1
    ).length > 0
  },
  mutations: {
    setToken (state, data) { state.token = data },
    setUser (state, data) { state.user = data },
    setAuthLoadingState (state, data) { state.loading = data },
    setAuthLoadingUserState (state, data) { state.loadingUser = data },
    setAuthErrorState (state, data) { state.error = data }
  },
  actions: {
    checkAuthId ({ commit }, { id }) {
      return new Promise((resolve, reject) => {
        commit('setAuthLoadingState', true)
        commit('setAuthErrorState', '')

        api.post('/users/exists', { id })
          .then(res => {
            commit('setAuthLoadingState', false)
            commit('setAuthErrorState', '')
            resolve(res.data)
          })
          .catch(err => {
            commit('setAuthLoadingState', false)
            commit('setAuthErrorState', err.response?.data || 'Unknown error')
            reject(err)
          })
      })
    },
    submitPassword ({ rootState, commit, dispatch }, { user, password }) {
      return new Promise((resolve, reject) => {
        commit('setAuthLoadingState', true)
        api.post('/users/auth', { id: user._id, password })
          .then(res => {
            const token = res.data
            setAuthToken(token)
            commit('setUser', user)
            commit('setAuthLoadingState', false)
            if (rootState.seasons.active !== user.defaultSeason) dispatch('selectSeason', { season: user.defaultSeason })
            resolve()
          })
          .catch(err => {
            setAuthToken()
            commit('setUser', null)
            commit('setAuthLoadingState', false)
            reject(err)
          })
      })
    },
    logout ({ dispatch, commit }) {
      return new Promise((resolve, reject) => {
        setAuthToken()
        dispatch('loadUser')
          .catch(() => { reject() })

        commit('setToken', null)
      })
    },
    loadUser ({ commit }) {
      return new Promise((resolve, reject) => {
        commit('setAuthLoadingUserState', true)
        api.get('/users')
          .then(res => {
            commit('setUser', res.data)
            commit('setAuthLoadingUserState', false)
            resolve(res.data)
          })
          .catch(err => {
            commit('setUser', null)
            commit('setAuthLoadingUserState', false)
            reject(err)
          })
      })
    }
  }
}
