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
      <button class="generate-color" @click="setRgb">
        <i class="fas fa-random" />
      </button>
      <button
        v-if="!props.isMainSlot"
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
  generateRgb,
  rgbToHex,
  rgbToHsl,
  generateComplement,
} from "../lib/utils";

const props = defineProps({
  isMainSlot: {
    type: Boolean,
    default: false,
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

const setRgb = () => {
  rgb.value = generateRgb();
  hex.value = rgbToHex(rgb.value);
  hsl.value = rgbToHsl(rgb.value);
  if (props.isMainSlot) emit("setMainColor", rgb.value);
};

const setComplement = () => {
  hsl.value = generateComplement(props.mainHsl);
};
</script>

<style>
</style>