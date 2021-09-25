<template>
  <q-item :to="{ name: route }"
    tag="a"
    clickable
    :active="$route.name === route"
    active-class="bg-grey-3 text-black"
    :disable="disable"
  >
    <q-item-section avatar><q-icon :name="icon" /></q-item-section>
    <q-item-section><q-item-label>{{ label }}</q-item-label></q-item-section>
  </q-item>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'DrawerItem',
  props: {
    route: { type: String, required: true },
    icon: { type: String, required: true },
    label: { type: String, required: true },
    disable: { type: Boolean, default: false }
  }
})
</script>
