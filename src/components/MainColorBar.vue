<template>
  <!-- wrapper  -->
  <div class="main-color-bar">
    <!-- random button  -->
    <button class="main-button" @click="setMainColor" data-test="random-button">
      <i class="fas fa-random" title="Generate random color" />
      Random
    </button>

    <div class="inputs-wrapper">
      <!-- rgb input  -->
      <form @submit.prevent="submitRgb" data-test="rgb-form">
        <div class="input-wrapper">
          <input
            type="text"
            data-test="rgb-input"
            placeholder="RGB - 255,255,255"
            title="Enter 3 numbers between 0 and 255, separated by commas"
            :pattern="rgbPattern"
            id="rgbInput"
          />
          <button type="submit">
            <i class="fas fa-chevron-circle-right"></i>
          </button>
        </div>
      </form>

      <!-- hex input  -->
      <form @submit.prevent="submitHex" data-test="hex-form">
        <div class="input-wrapper">
          <input
            type="text"
            data-test="hex-input"
            placeholder="HEX # - ffffff"
            title="Enter a hex color code, without the #"
            :pattern="hexPattern"
            id="hexInput"
          />
          <button type="submit">
            <i class="fas fa-chevron-circle-right"></i>
          </button>
        </div>
      </form>

      <!-- hsl input  -->
      <form @submit.prevent="submitHsl" data-test="hsl-form">
        <div class="input-wrapper">
          <input
            type="text"
            data-test="hsl-input"
            placeholder="HSL - 190,75,80"
            title="Enter H between 0 and 360, then S and L between 0 and 100, separated by commas"
            :pattern="hslPattern"
            id="hslInput"
          />
          <button type="submit">
            <i class="fas fa-chevron-circle-right"></i>
          </button>
        </div>
      </form>
    </div>

    <!-- color input  -->
    <form @submit.prevent="submitColor" data-test="color-form">
      <div class="input-wrapper">
        <input
          type="color"
          data-test="color-input"
          id="colorInput"
          title="Click to select from color wheel"
        />
        <button type="submit">
          <i class="fas fa-chevron-circle-right"></i>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import { generateHsl, hexToHsl, rgbToHsl } from "../lib/utils";

const store = useStore();

// Regex patterns for inputs validation

const hexPattern = "^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$";
const rgbPattern =
  "\\b(1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])\\b,\\s*\\b(1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])\\b,\\s*\\b(1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])\\b";
const hslPattern =
  "\\b(1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])\\b,\\s*\\b(1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])\\b,\\s*\\b(1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])\\b";

/* --- maybe refactor these handlers --- */
/* ---  vvvvvvvvvv     vvvvvvvvvvv   --- */

const setMainColor = () => {
  const hsl = generateHsl();
  store.dispatch("SET_MAIN_COLOR", hsl);
};

const submitRgb = (e) => {
  const rgbInput = e.target.querySelector('[data-test="rgb-input"]')
  const rgb = rgbInput.value
  if (!rgb) return;
  const hsl = rgbToHsl(rgb);
  store.dispatch("SET_MAIN_COLOR", hsl);
  rgbInput.value = "";
};

const submitHex = (e) => {
  const hexInput = e.target.querySelector('[data-test="hex-input"]')
  const hex = hexInput.value
  if (!hex) return;
  const hsl = hexToHsl(hex);
  store.dispatch("SET_MAIN_COLOR", hsl);
  hexInput.value = "";
};

const submitHsl = (e) => {
  const hslInput = e.target.querySelector('[data-test="hsl-input"]')
  const val = hslInput.value
  if (!val) return;
  const [h, s, l] = val.split(",").map(Number);
  const hsl = `hsl(${h}, ${s}%, ${l}%)`;
  store.dispatch("SET_MAIN_COLOR", hsl);
  hslInput.value = "";
};

const submitColor = (e) => {
  const colorInput = e.target.querySelector('[data-test="color-input"]')
  const color = colorInput.value.slice(1) // remove the # from the color
  if (!color) return;
  const hsl = hexToHsl(color);
  store.dispatch("SET_MAIN_COLOR", hsl);
};
</script>