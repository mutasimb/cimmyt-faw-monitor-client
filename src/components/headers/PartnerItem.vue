<template>
  <q-item clickable v-close-popup tag="a" :href="partner.href" target="_blank">
    <q-item-section avatar>
      <img :src="partner.src" :style="{ maxHeight: '40px' }" />
    </q-item-section>
    <q-item-section>
      <q-item-label class="text-right">{{ partner.label }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'ComponentPartnerItem',
  props: {
    partner: { type: Object, required: true }
  }
})
</script>
