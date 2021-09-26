import { store } from 'quasar/wrappers'
import { createStore } from 'vuex'

import forms from './_forms.js'
import auth from './_auth.js'
import seasons from './_seasons.js'
import traps from './_traps.js'
import scoutings from './_scouting_data.js'
import countries from './_countries.js'
import gadm from './_gadm.js'
import areas from './_areas.js'
import aggData from './_aggregated_data.js'

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default store(function (/* { ssrContext } */) {
  const Store = createStore({
    modules: {
      forms,
      auth,
      seasons,
      traps,
      scoutings,
      countries,
      gadm,
      areas,
      aggData
    },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: process.env.DEBUGGING
  })

  return Store
})
