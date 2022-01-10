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
    <div class="test-buttons" v-if="showPalleteButtons">
      <button class="generate-color" @click="setCssVars">
        Test this pallete
      </button>
      <button class="generate-color" @click="setLightText">Light Text</button>
      <button class="generate-color" @click="setDarkText">Dark Text</button>
      <button class="generate-color" @click="copyPallete">Copy Pallete</button>
      <button class="generate-color" @click="savePallete">Save Pallete</button>
    </div>
  </main>
  <transition name="modal">
    <CopyModal v-if="showCopyModal" @close="showCopyModal = false" />
  </transition>
  <transition name="modal">
    <SaveModal v-if="showSaveModal" @close="showSaveModal = false" />
  </transition>
</template>

<script setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";

import MainNav from "./components/MainNav.vue";
import ColorsPane from "./components/ColorsPane.vue";
import MiniSlots from "./components/MiniSlots.vue";
import CopyModal from "./components/CopyModal.vue";
import SaveModal from "./components/SaveModal.vue";

const showCopyModal = ref(false);
const showSaveModal = ref(false);

const store = useStore();
const uniqueColors = computed(() => store.getters.uniqueColors);
const showPalleteButtons = computed(() => store.getters.fullSchemeSet);

const setCssVars = () => {
  const main = computed(() => store.state.mainSlotColor.hex);
  const complementary = computed(() => store.state.slotColors.slot2.hex);
  const light = computed(() => store.state.slotColors.slot3.hex);
  const accent = computed(() => store.state.slotColors.slot4.hex);
  const accentLight = computed(() => store.state.slotColors.slot5.hex);

  document.documentElement.style.setProperty("--clr-main", main.value);
  document.documentElement.style.setProperty(
    "--clr-complementary",
    complementary.value
  );
  document.documentElement.style.setProperty("--clr-light", light.value);
  document.documentElement.style.setProperty("--clr-accent", accent.value);
  document.documentElement.style.setProperty(
    "--clr-accent-light",
    accentLight.value
  );
};

const setLightText = () => {
  document.documentElement.style.setProperty("--text-color", "#faebd7");
};

const setDarkText = () => {
  document.documentElement.style.setProperty("--text-color", "#0f131a");
};

const copyPallete = () => {
  showCopyModal.value = true;
};

const savePallete = () => {
  showSaveModal.value = true;
};
</script>


<style>
@import "./style/app.css";
</style>
