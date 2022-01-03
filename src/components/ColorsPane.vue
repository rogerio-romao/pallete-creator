<template>
  <div class="main-color-box">
    <p>Set Main Color:</p>
    <button class="generate-color" @click="setMainColor">
      <i class="fas fa-random" title="Generate random color" />
      Random
    </button>
    <form>
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
    <form>
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
    <form>
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
</script>

<style>
</style>