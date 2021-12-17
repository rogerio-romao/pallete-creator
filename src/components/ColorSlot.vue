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
      <button v-if="slotNumber === 1" class="generate-color" @click="setHsl">
        <i class="fas fa-random" title="Generate random color" />
      </button>
      <button
        v-if="slotNumber > 1 && mainSet"
        class="generate-color"
        :disabled="copiedColor.length === 0"
        @click="pasteColor"
      >
        <i class="fas fa-paste" title="Paste the copied color" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect } from "vue";
import { generateHsl, rgbToHex, hslToRgb } from "../lib/utils";

const props = defineProps({
  slotNumber: {
    type: Number,
    default: 1,
  },
  mainHsl: {
    type: String,
    default: "",
  },
  mainSet: {
    type: Boolean,
    default: false,
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
const emit = defineEmits(["setMainColor"]);

watchEffect(() => {
  if (props.randomColor.length > 0) {
    setRandomColor();
  }
});

const rgb = ref("");
const hex = ref("");
const hsl = ref("");

const setHsl = () => {
  hsl.value = generateHsl();
  rgb.value = hslToRgb(hsl.value);
  hex.value = rgbToHex(rgb.value);
  if (props.slotNumber === 1) emit("setMainColor", hsl.value);
};

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