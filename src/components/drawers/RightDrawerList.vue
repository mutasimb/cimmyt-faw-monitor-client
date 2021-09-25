<template>
  <q-list class="q-mt-md">

    <q-separator spaced />
    <q-item clickable @click="onLogOut">
      <q-item-section>
        <q-item-label class="text-right">Sign out</q-item-label>
      </q-item-section>
      <q-item-section avatar>
        <q-icon color="grey-10" name="exit_to_app"/>
      </q-item-section>
    </q-item>

  </q-list>
</template>

<script>
import { defineComponent } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'ComponentRightList',
  setup () {
    const
      { dispatch } = useStore(),
      router = useRouter()

    return {
      onLogOut: () => {
        dispatch('logout')
          .catch(() => {
            router.push({ name: 'home' })
          })
      }
    }
  }
})
</script>
