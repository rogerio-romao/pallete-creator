<template>
  <div class="centered">
    <h3 contenteditable="true">{{ labels[slotNumber] }}</h3>
    <div
      class="color-slot"
      @click="pasteColor"
      :style="{
        backgroundColor: rgb || hsl,
      }"
    >
      <span class="rgbValue">{{ rgb }}</span>
      <span class="hexValue">{{ hex }}</span>
      <span class="hslValue">{{ hsl }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect } from "vue";
import { rgbToHex, hslToRgb } from "../lib/utils";

const props = defineProps({
  slotNumber: {
    type: Number,
    default: 1,
  },
  mainHsl: {
    type: String,
    default: "",
  },
  copiedColor: {
    type: String,
    default: "",
  },
  randomColor: {
    type: String,
    default: "",
  },
});

watchEffect(() => {
  if (props.randomColor.length > 0) {
    setRandomColor();
  }
  if (props.mainHsl) {
    setMainSlotColor();
  }
});

const rgb = ref("");
const hex = ref("");
const hsl = ref("");

const setMainSlotColor = () => {
  if (props.slotNumber === 1) {
    hsl.value = props.mainHsl;
    rgb.value = hslToRgb(hsl.value);
    hex.value = rgbToHex(rgb.value);
  }
};

const labels = [null, "Main", "Secondary", "Accent", "Light", "Dark"];

const pasteColor = () => {
  if (!props.copiedColor) return;
  hsl.value = props.copiedColor;
  rgb.value = hslToRgb(hsl.value);
  hex.value = rgbToHex(rgb.value);
};

const setRandomColor = () => {
  if (props.slotNumber === 1) return;
  hsl.value = props.randomColor;
  rgb.value = hslToRgb(hsl.value);
  hex.value = rgbToHex(rgb.value);
};
</script>

<style>
</style>