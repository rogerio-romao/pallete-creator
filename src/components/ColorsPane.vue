<template>
  <div class="main-color-box">
    <p>Set Main Color:</p>
    <button class="generate-color" @click="setMainColor">
      <i class="fas fa-random" title="Generate random color" />
      Random
    </button>
    <form @submit.prevent="submitRgb">
      <div class="input">
        <input
          type="text"
          placeholder="RGB - 255,255,255"
          :pattern="rgbPattern"
          id="rgbInput"
        />
        <button type="submit">
          <i class="fas fa-chevron-circle-right"></i>
        </button>
      </div>
    </form>
    <form @submit.prevent="submitHex">
      <div class="input">
        <input
          type="text"
          placeholder="HEX - #ffffff"
          :pattern="hexPattern"
          id="hexInput"
        />
        <button type="submit">
          <i class="fas fa-chevron-circle-right"></i>
        </button>
      </div>
    </form>
    <form @submit.prevent="submitHsl">
      <div class="input">
        <input
          type="text"
          placeholder="HSL - 360,100,100"
          :pattern="hslPattern"
          id="hslInput"
        />
        <button type="submit">
          <i class="fas fa-chevron-circle-right"></i>
        </button>
      </div>
    </form>
  </div>
  <!-- Pallete Pane  -->
  <section class="pallete-pane" v-if="mainHSL">
    <template class="color-slots" v-for="i in 5" :key="i">
      <color-slot :slotNumber="i" />
    </template>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";

import { hexToHsl, rgbToHsl } from "../lib/utils";

import ColorSlot from "./ColorSlot.vue";

const store = useStore();

const rgbPattern =
  "\\b(1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])\\b,\\s*\\b(1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])\\b,\\s*\\b(1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])\\b";

const hexPattern = "^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$";

const hslPattern =
  "\\b(1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])\\b,\\s*\\b(1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])\\b,\\s*\\b(1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])\\b";

const mainHSL = computed(() => store.state.mainHSL);

const setMainColor = () => {
  store.dispatch("SET_MAIN_COLOR");
};

const addColor = (hsl) => {
  store.dispatch("ADD_COLOR", hsl);
};

const submitRgb = (e) => {
  const rgb = e.target.rgbInput.value;
  if (!rgb) return;
  const hsl = rgbToHsl(rgb);
  store.dispatch("SET_MAIN_COLOR", hsl);
  e.target.rgbInput.value = "";
};

const submitHex = (e) => {
  const hex = e.target.hexInput.value;
  if (!hex) return;
  const hsl = hexToHsl(hex);
  store.dispatch("SET_MAIN_COLOR", hsl);
  e.target.hexInput.value = "";
};

const submitHsl = (e) => {
  if (!e.target.hslInput.value) return;
  const [h, s, l] = e.target.hslInput.value.split(",").map(Number);
  const hsl = `hsl(${h}, ${s}%, ${l}%)`;
  store.dispatch("SET_MAIN_COLOR", hsl);
  e.target.hslInput.value = "";
};
</script>

<style>
</style>