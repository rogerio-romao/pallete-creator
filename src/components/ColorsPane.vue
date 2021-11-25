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
import { rgbToHsl } from "../lib/utils";
import ColorSlot from "./ColorSlot.vue";
const mainRGB = ref(null);
const mainHSL = ref(null);
const setMainColor = (rgb) => {
  mainRGB.value = rgb;
  mainHSL.value = rgbToHsl(rgb);
};
</script>

<style>
</style>