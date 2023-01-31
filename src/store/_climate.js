import { timeDay, timeHour } from 'd3-time'
import { timeParse, timeFormat } from 'd3-time-format'

import { api } from '../boot/axios.js'

export default {
  state: () => ({
    loading: false,
    data: [],
    error: ''
  }),
  getters: {
    climateError: state =>
      state.error === 'No traps' ? 'Please complete your trap registration in order to get climate based advisories'
        : '',
    climateData: state => state.data.map(el => ({
      adm1: el.parentNames[0],
      adm2: el.parentNames[1],
      adm3: el.name,
      forecast: el.forecast ? {
        gid: el.forecast.gid,
        prec: el.forecast.prec,
        precTimesteps: el.forecast.prec
          .map((_, i) => timeDay.offset(timeParse('%y%m%d')(el.forecast.date), i))
          .map(t => timeFormat('%b %-d')(t)),
        t2: el.forecast.t2.map((val, i) => [
          timeHour.offset(timeParse('%y%m%d')(el.forecast.date), i).toISOString(),
          val
        ])
      } : null
    }))
  },
  mutations: {
    setError: (state, payload) => { state.error = payload },
    setClimateDataLoadingState: (state, payload) => { state.loading = payload },
    setClimateData: (state, payload) => { state.data = payload }
  },
  actions: {
    getClimateUserData ({ rootState, commit }, payload) {
      return new Promise((resolve, reject) => {
        const
          date = +timeFormat('%y%m%d')(new Date()),
          activeSeason = payload?.season || rootState.seasons.active

        commit('setClimateDataLoadingState', true)
        api
          .get('/climate-data/upazila', {
            params: { date, season: activeSeason }
          })
          .then(res => {
            commit('setError', '')
            commit('setClimateData', res.data)
            commit('setClimateDataLoadingState', false)
            resolve(res.data)
          })
          .catch(err => {
            if ('response' in err) commit('setError', err.response.data)
            commit('setClimateDataLoadingState', false)
            reject(err)
          })
      })
    }
  }
}
