<template>
  <div class="main-color-box">
    <p>Set Main Color:</p>
    <button class="generate-color" @click="setMainColor">
      <i class="fas fa-random" title="Generate random color" />
      Random
    </button>
    <input type="text" placeholder="RGB" />
    <input type="text" placeholder="HEX" />
    <input type="text" placeholder="HSL" />
  </div>
  <!-- Pallete Pane  -->
  <section class="pallete-pane">
    <template class="color-slots" v-for="i in 5" :key="i">
      <color-slot :slotNumber="i" />
    </template>
  </section>
</template>

<script setup>
import { useStore } from "vuex";

import ColorSlot from "./ColorSlot.vue";

const store = useStore();

const setMainColor = () => {
  store.dispatch("SET_MAIN_COLOR");
};

const addColor = (hsl) => {
  store.dispatch("ADD_COLOR", hsl);
};
</script>

<style>
</style>