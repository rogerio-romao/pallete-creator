<template>
  <main>
    <!-- Pallete Pane  -->
    <section class="pallete-pane">
      <template v-for="i in 5" :key="i">
        <color-slot
          @setMainColor="setMainColor($event)"
          :isMainSlot="i === 1"
        />
      </template>
    </section>
  </main>
</template>

<script setup>
import { ref } from "vue";
import ColorSlot from "./ColorSlot.vue";
const mainRed = ref(null);
const mainGreen = ref(null);
const mainBlue = ref(null);
const setMainColor = (rgb) => {
  const [r, g, b] = rgb.match(/\d+/g).map(Number);
  mainRed.value = r;
  mainGreen.value = g;
  mainBlue.value = b;
};
</script>

<style>
</style>