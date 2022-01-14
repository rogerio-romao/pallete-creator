<template>
  <MainNav></MainNav>
  <main>
    <h2 class="heading2">Build your pallete</h2>
    <ColorsPane />
    <h2 v-if="uniqueColors.size" class="heading2">Pick your variations</h2>
    <mini-slots v-if="uniqueColors.size"></mini-slots>
    <UtilityButtons
      @copyPallete="showCopyModal = true"
      @savePallete="showSaveModal = true"
    />
    <h2 class="heading2">Saved Palletes</h2>
    <SavedPalletes />
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
import UtilityButtons from "./components/UtilityButtons.vue";
import SavedPalletes from "./components/SavedPalletes.vue";

const store = useStore();
const showCopyModal = ref(false);
const showSaveModal = ref(false);
const uniqueColors = computed(() => store.getters.uniqueColors);
</script>


<style>
@import "./style/app.css";
</style>
