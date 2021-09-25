<template>
  <q-dialog persistent transition-show="scale" transition-hide="scale">
    <q-card style="max-width: 350px">
      <q-card-section class="column items-start no-wrap">
        <div class="text-h6">
          <q-icon name="error_outline" class="q-mr-sm" style="font-size: 2rem;" />
          Notice
        </div>
      </q-card-section>
      <q-card-section class="column items-stretch no-wrap">
        <q-carousel
          transition-prev="slide-right"
          transition-next="slide-left"
          swipeable
          animated
          v-model="instructionScoutingSlide"
          control-color="green"
          navigation
          padding
          thumbnails
        >
          <q-carousel-slide :name="1" class="q-gutter-sm">
            <div
              class="text-subtitle2"
            >- Now scout the each field for signs of Fall Armyworm damage.</div>
            <div class="text-subtitle2">- If the crop is small, you can use a W pattern.</div>
            <div class="text-subtitle2">- If it is tall, use the ladder pattern.</div>
            <div
              class="text-subtitle2"
            >- Make sure you scout the entire field from end to end, stopping in 5 places within the field and examine 10 plants in a row.</div>
          </q-carousel-slide>
          <q-carousel-slide :name="2" class="q-gutter-sm">
            <div
              class="text-subtitle2"
            >- In each of the 5 places, first write down on a piece of paper the number of plants you observe with pinholes or small fresh windowpanes on young leaves.</div>
            <div
              class="text-subtitle2"
            >- Second, record the number of plants where you see fresh new damage to the whorl.</div>
            <div
              class="text-subtitle2"
            >- Third, later in the season when cobs begin to grow, also count the number of plants with new damage on cobs by Fall Armyworm.</div>
            <div
              class="text-subtitle2"
            >- Note that you may have a single plant with at least two kinds of damage.</div>
          </q-carousel-slide>
          <q-carousel-slide :name="3" class="q-gutter-sm">
            <div
              class="text-subtitle2"
            >You will next add up the number of plants you observed for each kind of damage:</div>
            <div
              class="text-subtitle2"
            >- First, sum the total number of plants you find with pinholes or small fresh windowpanes on young leaves.</div>
            <div
              class="text-subtitle2"
            >- Second, separately sum the number of plants where you see fresh new damage to the whorl.</div>
            <div
              class="text-subtitle2"
            >- Third, if the plants have cobs, separately sum number of plants with cobs that show evidence of new damage by Fall Armyworm.</div>
          </q-carousel-slide>
          <q-carousel-slide :name="4" class="q-gutter-sm">
            <div
              class="text-subtitle2"
            >- Finally, enter these data into the next forms.</div>
          </q-carousel-slide>
        </q-carousel>
        <q-separator light />
        <q-btn
          flat
          class="self-end"
          :disable="instructionScoutingSlide < 4"
          @click="onDismiss"
        >Dismiss</q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'ComponentFormDialogScoutingInstructions',
  setup (_, { emit }) {
    const
      instructionScoutingSlide = ref(1),
      onDismiss = () => {
        instructionScoutingSlide.value = 1
        emit('dismiss')
      }

    return { instructionScoutingSlide, onDismiss }
  }
})
</script>
