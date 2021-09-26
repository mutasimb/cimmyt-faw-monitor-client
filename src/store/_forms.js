import { api } from '../boot/axios.js'

import { blankForm as trapRegistrationBlank, compute as trapRegistrationCompute } from './forms/trapRegistration.js'
import { blankForm as scoutingBlank, compute as scoutingCompute } from './forms/scouting.js'

import BGD from '../assets/adm/bgd.json'
import MMR from '../assets/adm/mmr.json'

const forms = {
  trapRegistration: {
    blank: trapRegistrationBlank,
    computeFn: trapRegistrationCompute,
    endpoint: '/traps'
  },
  scouting: {
    blank: scoutingBlank,
    computeFn: scoutingCompute,
    endpoint: '/scouting-data'
  }
}

export default {
  state: {
    loading: false,
    activeFormName: null,
    activeForm: null,

    adm: {
      BGD,
      MMR
    }
  },
  getters: {
    form: state => !state.activeFormName ? null
      : forms[state.activeFormName].computeFn(state.activeForm)
  },
  mutations: {
    loadForm: (state, form) => {
      state.activeFormName = form
      state.activeForm = forms[state.activeFormName].blank()
    },
    mutateForm: (state, payload) => {
      const [att, data] = payload
      state.activeForm[att] = data
    },
    nullifyForm: state => {
      state.activeFormName = null
      state.activeForm = null
    },
    setFormLoadingState: (state, data) => {
      state.loading = data
    }
  },
  actions: {
    submitForm ({ state, getters, commit }) {
      return new Promise((resolve, reject) => {
        commit('setFormLoadingState', true)

        api.post(forms[state.activeFormName].endpoint, getters.form)
          .then(res => {
            commit('setFormLoadingState', false)
            resolve(res.data)
          })
          .catch(err => {
            commit('setFormLoadingState', false)
            reject(err.response?.data || err.message)
          })
      })
    }
  }
}
