<template>
  <!-- NAV  -->
  <MainNav></MainNav>

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
      <p class="description">
        Setting main color resets everything. You can edit color labels and
        adjust color properties with the controls.
      </p>
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
      <MiniSlots
        @copyPallete="showCopyModal = true"
        @savePallete="showSaveModal = true"
      />
    </div>

    <!-- saved palletes -->
    <div v-if="savedPalletes">
      <h2>Saved Palletes</h2>
      <SavedPalletes />
    </div>

    <!-- instructions  -->
    <h2>Instructions</h2>
    <div class="instructions-wrapper">
      <p>
        First generate a main color by using the inputs or the random button.
        The slots will appear and variations will be generated based on color
        theory. When you change the main slot, everything else resets and new
        variations are added. You can click on the variations to select the
        color, then click on one of the pallette slots to paste it. Or press the
        random scheme button to generate a new scheme from the variations. Then
        the colors can be adjusted using the sliders. You can then save the
        scheme or export the css, test the scheme on the page, change color
        names, test dark and light text, etc...
      </p>
    </div>
  </main>
  <!-- END MAIN  -->

  <!-- MODALS  -->

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
import MiniSlots from "./components/MiniSlots.vue";
import CopyModal from "./components/CopyModal.vue";
import SaveModal from "./components/SaveModal.vue";
import UtilityButtons from "./components/UtilityButtons.vue";
import SavedPalletes from "./components/SavedPalletes.vue";

const store = useStore();

const showCopyModal = ref(false);
const showSaveModal = ref(false);

const uniqueColors = computed(() => store.getters.uniqueColors);
const mainHSL = computed(() => store.state.mainHSL);
const savedPalletes = computed(() => store.state.savedPallettes.length);
const showUtilityButtons = computed(() => store.getters.fullSchemeSet);
</script>


<style>
@import "./style/app.css";
</style>
