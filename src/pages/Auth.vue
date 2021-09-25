<template>
  <q-page class="column flex-center q-pa-md">
    <q-card flat bordered style="min-width: 360px">

      <form v-if="!idUser" @submit.prevent="onIdSubmission">
        <q-card-section>
          <q-input
            outlined
            :label="error ? error : 'User ID'"
            placeholder="Email or phone number"
            type="text"
            v-model="id"
            :error="error != ''"
            @focus="clearError"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn v-if="!loading" flat label="Next" type="submit" :disable="!id"/>
          <q-spinner-dots v-else color="black" size="24px" class="q-mr-sm" />
        </q-card-actions>
      </form>

      <form v-else @submit.prevent="onPasswordSubmission">
        <q-card-section>
          <q-input
            outlined
            :label="error ? error : 'Password'"
            type="password"
            v-model="password"
            :error="error != ''"
            @focus="clearError"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn v-if="!loading" flat label="Verify" type="submit" :disable="!password || !idUser"/>
          <q-spinner-dots v-else color="black" size="24px" class="q-mr-sm" />
        </q-card-actions>
      </form>

    </q-card>
  </q-page>
</template>

<script>
import { defineComponent, ref, computed } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'PageAuth',
  setup () {
    const
      { state, commit, dispatch } = useStore(),
      id = ref(''),
      idUser = ref(null),
      password = ref(''),
      loading = computed(() => state.auth.loading),
      error = computed(() => state.auth.error),
      clearError = () => { commit('setAuthErrorState', '') },
      onIdSubmission = async () => { idUser.value = await dispatch('checkAuthId', { id: id.value }) },
      onPasswordSubmission = () => { dispatch('submitPassword', { user: idUser.value, password: password.value }) }

    return {
      id,
      idUser,
      password,
      loading,
      error,
      clearError,
      onIdSubmission,
      onPasswordSubmission
    }
  }
})
</script>
