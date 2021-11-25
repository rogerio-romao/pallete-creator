<template>
  <div>
    <div
      class="color-slot"
      :style="{
        backgroundColor: rgb,
      }"
    >
      <span class="rgbValue">{{ rgb }}</span>
      <span class="hexValue">{{ hex }}</span>
      <span class="hslValue">{{ hsl }}</span>
    </div>
    <div class="slot-buttons">
      <button class="generate-color" @click="setRgb">Random</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { generateRgb, rgbToHex, rgbToHsl } from "../lib/utils";

const props = defineProps({
  isMainSlot: {
    type: Boolean,
    default: false,
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
</script>

<style>
</style>