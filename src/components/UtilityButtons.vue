<template>
  <div class="utility-buttons" v-if="showPalleteButtons">
    <button class="generate-color" @click="setCssVars">
      Test this pallete
    </button>
    <button class="generate-color" @click="setLightText">Light Text</button>
    <button class="generate-color" @click="setDarkText">Dark Text</button>
    <button class="generate-color" @click="copyPallete">Copy Pallete</button>
    <button class="generate-color" @click="savePallete">Save Pallete</button>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";

const emit = defineEmits(["copyPallete", "savePallete"]);

const store = useStore();

const showPalleteButtons = computed(() => store.getters.fullSchemeSet);

const setLightText = () => {
  document.documentElement.style.setProperty("--text-color", "#faebd7");
  store.dispatch("SET_TEXT_COLOR", "light");
};

const setDarkText = () => {
  document.documentElement.style.setProperty("--text-color", "#0f131a");
  store.dispatch("SET_TEXT_COLOR", "dark");
};

const copyPallete = () => {
  emit("copyPallete");
};

const savePallete = () => {
  emit("savePallete");
};

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
</script>

<style>
</style>