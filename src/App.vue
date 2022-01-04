<template>
  <header>
    <nav>
      <main-nav></main-nav>
    </nav>
  </header>
  <main>
    <h1 class="heading1">Build your pallete</h1>
    <colors-pane></colors-pane>
    <h2 v-if="uniqueColors.size" class="heading2">Pick your variations</h2>
    <mini-slots v-if="uniqueColors.size"></mini-slots>
    <h2 class="heading2" @click="setCssVars">Test this pallete</h2>
  </main>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";

import MainNav from "./components/MainNav.vue";
import ColorsPane from "./components/ColorsPane.vue";
import MiniSlots from "./components/MiniSlots.vue";

const store = useStore();
const uniqueColors = computed(() => store.getters.uniqueColors);

const setCssVars = () => {
  const main = computed(() => store.state.mainSlotColor.hex);
  const complementary = computed(() => store.state.slotColors.slot2.hex);
  const light = computed(() => store.state.slotColors.slot3.hex);
  const accent = computed(() => store.state.slotColors.slot4.hex);
  const accentLight = computed(() => store.state.slotColors.slot5.hex);

  document.documentElement.style.setProperty("--clr-main", main.value);
  document.documentElement.style.setProperty(
    "--text-light",
    complementary.value
  );
  document.documentElement.style.setProperty("--clr-light", light.value);
  document.documentElement.style.setProperty("--clr-accent", accent.value);
  document.documentElement.style.setProperty(
    "--clr-accent-light",
    accentLight.value
  );
};
</script>


<style>
@import "./style/app.css";
</style>
