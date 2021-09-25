<template>
  <div class="row justify-between q-col-gutter-md">
    <q-select
      class="col-12 col-md-9"
      filled
      v-model="season"
      :options="seasons"
      option-value="_id"
      option-label="name"
      :label="season ? 'Active Dataset' : 'Choose Data, Season, Country'"
    >
      <template v-slot:selected>
        <div class="text-h6">Season: {{ season.name }}</div>
      </template>
    </q-select>
    <q-select
      class="col-12 col-md-3"
      filled
      v-model="crop"
      :options="crops.length === 1 ? crops : ['Aggregated', ...crops]"
      :readonly="crops.length === 1"
      :label="crop ? 'Selected Crop Data' : 'Choose Crop Data'"
    >
      <template v-slot:selected>
        <div class="text-h6">{{ crop }}</div>
      </template>
    </q-select>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'ComponentSeasonSelector',
  setup () {
    const
      { state, getters, commit, dispatch } = useStore(),

      seasons = computed(() => getters.seasonOptions),
      crops = computed(() => getters.activeSeason.crops),
      season = computed({
        get: () => seasons.value.length === 0 || !state.seasons.active ? null
          : seasons.value.find(el => state.seasons.active === el._id),
        set: val => { dispatch('selectSeason', { season: val._id }) }
      }),
      crop = computed({
        get: () => state.seasons.activeCrop,
        set: val => { commit('setActiveCrop', val) }
      })

    return { seasons, crops, season, crop }
  }
})
</script>
