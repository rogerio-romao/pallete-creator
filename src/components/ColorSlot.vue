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
      <button v-if="showButtons" class="generate-color" @click="setComplement">
        <i class="fas fa-adjust"></i>
      </button>
      <button v-if="showButtons" class="generate-color" @click="setMono">
        <i class="fas fa-tv"></i>
      </button>
      <button v-if="showButtons" class="generate-color" @click="setTriad">
        <i class="fas fa-dice-three"></i>
      </button>
      <button v-if="showButtons" class="generate-color" @click="setAnalogous">
        <i class="fab fa-microsoft"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import {
  generateHsl,
  rgbToHex,
  hslToRgb,
  generateComplement,
  generateMono,
  generateTriad,
  generateAnalogous,
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
  mainSet: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["setMainColor"]);

const rgb = ref("");
const hex = ref("");
const hsl = ref("");

const showButtons = computed(() => props.slotNumber > 1 && props.mainSet);

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

const setMono = () => {
  hsl.value = generateMono(props.mainHsl);
  rgb.value = hslToRgb(hsl.value);
  hex.value = rgbToHex(rgb.value);
};

const setTriad = () => {
  hsl.value = generateTriad(props.mainHsl);
  rgb.value = hslToRgb(hsl.value);
  hex.value = rgbToHex(rgb.value);
};

const setAnalogous = () => {
  hsl.value = generateAnalogous(props.mainHsl);
  rgb.value = hslToRgb(hsl.value);
  hex.value = rgbToHex(rgb.value);
};
</script>

<style>
</style>