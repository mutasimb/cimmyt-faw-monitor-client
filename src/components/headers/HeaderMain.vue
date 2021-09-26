<template>
  <q-header :elevated="!isRouteHome" class="bg-white text-grey-10">
    <q-toolbar class="q-py-sm">

      <q-avatar size="48px" class="q-mr-xs"><img src="icons/favicon-128x128.png" /></q-avatar>
      <q-toolbar-title class="text-weight-medium text-grey-10">{{ title }}</q-toolbar-title>

      <template v-if="isRouteHome">

        <q-btn-dropdown no-caps flat label="Partners">
          <q-list>
            <PartnerItem v-for="el in partners" :key="el.label" :partner="el" />
          </q-list>
        </q-btn-dropdown>
        <q-avatar size="60px"><img src="logos/gob.png" /></q-avatar>

      </template>
      <template v-else>

        <q-btn flat no-caps label="Home" class="text-grey-10" @click="onClick" />

      </template>

    </q-toolbar>
  </q-header>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import PartnerItem from './PartnerItem.vue'

export default defineComponent({
  name: 'Header',
  components: { PartnerItem },
  setup () {
    const
      route = useRoute(),
      router = useRouter(),
      isRouteHome = computed(() => route.name === 'home'),
      title = computed(() => route.meta.title)

    return {
      isRouteHome,
      title,
      onClick: () => { router.push({ name: 'home' }) }
    }
  },
  data: () => ({
    partners: [
      { href: 'https://www.usaid.gov/', src: 'logos/usaid.png', label: 'USAID' },
      { href: 'http://dae.gov.bd/', src: 'logos/dae.png', label: 'DAE' },
      { href: 'https://www.cimmyt.org/', src: 'logos/cimmyt.png', label: 'CIMMYT' },
      { href: 'https://csisa.org/', src: 'logos/csisa.png', label: 'CSISA' },
      { href: 'http://www.bwmri.gov.bd/', src: 'logos/bwmri.png', label: 'BWMRI' },
      { href: 'http://www.bari.gov.bd/', src: 'logos/bari.png', label: 'BARI' },
      { href: 'http://www.brri.gov.bd/', src: 'logos/brri.png', label: 'BRRI' }
    ]
  })
})
</script>
