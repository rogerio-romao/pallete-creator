<template>
  <div>
    <div
      class="color-slot"
      :style="{
        backgroundColor: rgb || hsl,
      }"
    >
      <span class="rgbValue">{{ rgb }}</span>
      <span class="hexValue">{{ hex }}</span>
      <span class="hslValue">{{ hsl }}</span>
    </div>
    <div class="slot-buttons">
      <button class="generate-color" @click="setHsl">
        <i class="fas fa-random" />
      </button>
      <button
        v-if="props.slotNumber === 2"
        class="generate-color"
        @click="setComplement"
      >
        <i class="fas fa-adjust"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import {
  generateHsl,
  rgbToHex,
  hslToRgb,
  generateComplement,
} from "../lib/utils";

const props = defineProps({
  slotNumber: {
    type: Number,
    default: 1,
  },
  mainHsl: {
    type: String,
    default: "",
  },
});
const emit = defineEmits(["setMainColor"]);

const rgb = ref("");
const hex = ref("");
const hsl = ref("");

const setHsl = () => {
  hsl.value = generateHsl();
  rgb.value = hslToRgb(hsl.value);
  hex.value = rgbToHex(rgb.value);
  if (props.slotNumber === 1) emit("setMainColor", hsl.value);
};

const setComplement = () => {
  hsl.value = generateComplement(props.mainHsl);
  rgb.value = hslToRgb(hsl.value);
  hex.value = rgbToHex(rgb.value);
};
</script>

<style>
</style>