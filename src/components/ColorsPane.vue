<template>
  <main>
    <!-- Pallete Pane  -->
    <section class="pallete-pane">
      <template v-for="i in 5" :key="i">
        <color-slot
          @setMainColor="setMainColor($event)"
          :slotNumber="i"
          :mainHsl="mainHSL"
          :mainRgb="mainRGB"
        />
      </template>
    </section>
  </main>
</template>

<script setup>
import { ref } from "vue";
import { hslToRgb } from "../lib/utils";
import ColorSlot from "./ColorSlot.vue";
const mainHSL = ref(null);
const mainRGB = ref(null);
const setMainColor = (hsl) => {
  mainHSL.value = hsl;
  mainRgb.value = hslToRgb(hsl);
};
</script>

<style>
</style>