<template>
  <main>
    <!-- Pallete Pane  -->
    <section class="pallete-pane">
      <template v-for="i in 5" :key="i">
        <color-slot
          @setMainColor="setMainColor($event)"
          @addColor="addColor($event)"
          :slotNumber="i"
          :mainHsl="mainHSL"
          :mainSet="isMainSet"
        />
      </template>
    </section>
    <mini-slots :colors="uniqueColors"></mini-slots>
  </main>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import {
  generateComplement,
  generateMono,
  generateTriad,
  generateAnalogous,
  hslToRgb,
  rgbToHex,
} from "../lib/utils";

import ColorSlot from "./ColorSlot.vue";
import MiniSlots from "./MiniSlots.vue";

const mainHSL = ref(null);
const allColors = reactive({
  hsl: [],
  rgb: [],
  hex: [],
});

const setMainColor = (hsl) => {
  allColors.hsl = [];
  allColors.rgb = [];
  allColors.hex = [];
  mainHSL.value = hsl;
  addColor(hsl);
  setComplement();
  setMono();
  setTriad();
  setAnalogous();
};
const isMainSet = computed(() => mainHSL.value !== null);

const addColor = (hsl) => {
  const rgb = hslToRgb(hsl);
  const hex = rgbToHex(rgb);
  allColors.hsl.push(hsl);
  allColors.rgb.push(rgb);
  allColors.hex.push(hex);
};

const setComplement = () => {
  const hsl = generateComplement(mainHSL.value);
  addColor(hsl);
};

const setMono = () => {
  const variations = generateMono(mainHSL.value);
  variations.map((hsl) => addColor(hsl));
};

const setTriad = () => {
  const variations = generateTriad(mainHSL.value);
  variations.map((hsl) => addColor(hsl));
};

const setAnalogous = () => {
  const variations = generateAnalogous(mainHSL.value);
  variations.map((hsl) => addColor(hsl));
};

const uniqueColors = computed(() => {
  return new Set(allColors.hsl);
});
</script>

<style>
</style>