<template>
  <div>
    <div
      class="color-slot"
      :style="{
        backgroundColor: rgb,
      }"
    >
      <span class="rgbValue">{{ rgb }}</span>
      <span class="hexValue"></span>
      <span class="hslValue"></span>
    </div>
    <div class="slot-buttons">
      <button class="generate-color" @click="setRgb">Random</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { generateRgb } from "../lib/utils";

const emit = defineEmits(["setMainColor"]);

const rgb = ref("");

const setRgb = () => {
  rgb.value = generateRgb();
  this.$emit("setMainColor", rgb.value);
};
</script>

<style>
</style>