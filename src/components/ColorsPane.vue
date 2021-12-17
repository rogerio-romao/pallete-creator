<template>
  <!-- Pallete Pane  -->
  <section class="pallete-pane">
    <template class="color-slots" v-for="i in 5" :key="i">
      <color-slot
        @setMainColor="setMainColor($event)"
        @addColor="addColor($event)"
        :slotNumber="i"
        :mainHsl="mainHSL"
        :mainSet="isMainSet"
        :copiedColor="copiedColor"
        :randomColor="randomScheme[i - 1]"
      />
    </template>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import {
  generateComplement,
  generateMono,
  generateTriad,
  generateAnalogous,
  generateSaturations,
  hslToRgb,
  rgbToHex,
} from "../lib/utils";

import ColorSlot from "./ColorSlot.vue";

const props = defineProps({
  copiedColor: {
    type: String,
    default: "",
  },
  randomScheme: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["uniqueColors"]);

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
  setSaturations();
  emit("uniqueColors", allColors.hsl);
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
  const variations = generateComplement(mainHSL.value);
  variations.map((hsl) => addColor(hsl));
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

const setSaturations = () => {
  const variations = generateSaturations(mainHSL.value);
  variations.map((hsl) => addColor(hsl));
};

const uniqueColors = computed(() => {
  return new Set(allColors.hsl);
});
</script>

<style>
</style>