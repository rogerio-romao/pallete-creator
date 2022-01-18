<template>
  <div class="utility-buttons">
    <button class="secondary-button" @click="setCssVars">
      <i class="fas fa-vial"></i>
      Test this pallete
    </button>
    <button class="secondary-button" @click="resetSiteColors">
      <i class="far fa-window-restore"></i>
      Reset site colors
    </button>
    <button class="secondary-button" @click="setLightText">
      <i class="far fa-lightbulb"></i>
      Light Text
    </button>
    <button class="secondary-button" @click="setDarkText">
      <i class="fas fa-lightbulb"></i>
      Dark Text
    </button>
    <button class="secondary-button" @click="copyPallete">
      <i class="far fa-copy"></i>
      Export CSS
    </button>
    <button class="secondary-button" @click="savePallete">
      <i class="fas fa-save"></i>
      Save Pallete
    </button>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";

const emit = defineEmits(["copyPallete", "savePallete"]);

const store = useStore();

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

const resetSiteColors = () => {
  const siteColors = store.state.siteColors;
  document.documentElement.style.setProperty("--clr-main", siteColors.main);
  document.documentElement.style.setProperty(
    "--clr-complementary",
    siteColors.complementary
  );
  document.documentElement.style.setProperty("--clr-light", siteColors.light);
  document.documentElement.style.setProperty("--clr-accent", siteColors.accent);
  document.documentElement.style.setProperty(
    "--clr-accent-light",
    siteColors.dark
  );
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