<template>
  <!-- NAV  -->
  <MainNav @openInstructionsModal="showInstructionsModal = true" />

  <!-- MAIN  -->
  <main>
    <!-- main color control bar  -->
    <h2>Set Main Color</h2>
    <p class="description">
      Click random color or use the inputs to start your color scheme.
    </p>
    <MainColorBox />

    <!-- color pallete pane  -->
    <div v-if="mainHSL">
      <h2>Build your pallete</h2>
      <ColorsPane />
    </div>

    <!-- utility buttons  -->
    <div v-if="showUtilityButtons">
      <h2>Utilities</h2>
      <UtilityButtons
        @copyPallete="showCopyModal = true"
        @savePallete="showSaveModal = true"
      />
    </div>

    <!-- mini slots / variations  -->
    <div v-if="uniqueColors.size">
      <h2>Pick your variations</h2>
      <MiniSlots />
    </div>

    <!-- saved palletes -->
    <div v-if="savedPalletes">
      <h2>Saved Palletes</h2>
      <SavedPalletes />
    </div>
  </main>
  <!-- END MAIN  -->

  <!-- MODALS  -->

  <!-- instructions modal -->
  <transition name="modal">
    <Instructions
      v-if="showInstructionsModal"
      @close="showInstructionsModal = false"
    />
  </transition>

  <!-- copy modal -->
  <transition name="modal">
    <CopyModal v-if="showCopyModal" @close="showCopyModal = false" />
  </transition>

  <!-- save modal -->
  <transition name="modal">
    <SaveModal v-if="showSaveModal" @close="showSaveModal = false" />
  </transition>
</template>

<script setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";

import MainNav from "./components/MainNav.vue";
import MainColorBox from "./components/MainColorBox.vue";
import ColorsPane from "./components/ColorsPane.vue";
import UtilityButtons from "./components/UtilityButtons.vue";
import MiniSlots from "./components/MiniSlots.vue";
import SavedPalletes from "./components/SavedPalletes.vue";
import Instructions from "./components/InstructionsModal.vue";
import CopyModal from "./components/CopyModal.vue";
import SaveModal from "./components/SaveModal.vue";

const store = useStore();

const showCopyModal = ref(false);
const showSaveModal = ref(false);
const showInstructionsModal = ref(false);

const uniqueColors = computed(() => store.getters.uniqueColors);
const mainHSL = computed(() => store.state.mainHSL);
const savedPalletes = computed(() => store.state.savedPallettes.length);
const showUtilityButtons = computed(() => store.getters.fullSchemeSet);
</script>


<style>
@import "./style/app.css";
</style>
