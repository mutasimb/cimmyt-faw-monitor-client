<template>
  <q-dialog persistent transition-show="scale" transition-hide="scale">
    <q-card style="max-width: 360px">

      <q-card-section>
        <div class="text-h6 text-positive" v-if="dialogType === 'success'">
          <q-icon name="error" class="q-mr-sm" style="font-size: 2rem;" color="positive" />
          Successful Submission
        </div>
        <div class="text-h6 text-negative" v-if="dialogType === 'error'">
          <q-icon name="error" class="q-mr-sm" style="font-size: 2rem;" color="negative" />
          Unsuccessful Submission
        </div>
        <div class="text-h6" v-else-if="dialogType === 'notice'">
          <q-icon name="error_outline" class="q-mr-sm" style="font-size: 2rem;" />
          Notice
        </div>
      </q-card-section>

      <q-card-section>
        <div v-for="(message, i) in messages" :key="i" class="text-subtitle2" v-html="message" />
      </q-card-section>

      <q-separator light spaced />

      <q-card-actions align="right">
        <q-btn flat @click="onDismiss">Dismiss</q-btn>
      </q-card-actions>

    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'ComponentFormDialog',
  props: {
    dialogType: { type: String, required: true },
    dismissFn: { type: [Function, Object], default: null },
    messages: { type: Array, required: true }
  },
  methods: {
    onDismiss () {
      if (!this.dismissFn) {
        this.$emit('dismiss')
      } else {
        this.dismissFn()
      }
    }
  }
}
</script>
