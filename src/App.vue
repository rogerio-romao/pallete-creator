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

    <!-- utility buttons  -->
    <div v-if="showUtilityButtons">
      <h2>Utilities</h2>
      <UtilityButtons
        @copyPallete="showCopyModal = true"
        @savePallete="showSaveModal = true"
      />
    </div>

    <!-- color pallete pane  -->
    <div v-if="mainHSL">
      <h2>
        Build your pallete
        <span
          class="collapse"
          title="Click to collapse"
          @click="collapseColorPane"
          v-if="!isColorPaneCollapsed"
        >
          <i class="far fa-minus-square"></i>
        </span>
        <span
          class="collapse"
          title="Click to expand"
          @click="collapseColorPane"
          v-if="isColorPaneCollapsed"
        >
          <i class="far fa-plus-square"></i>
        </span>
      </h2>
      <ColorsPane :isColorPaneCollapsed="isColorPaneCollapsed" />
    </div>

    <!-- mini slots / variations  -->
    <div v-if="uniqueColors.size">
      <h2>
        Pick your variations
        <span
          class="collapse"
          title="Click to collapse"
          @click="collapseMiniPane"
          v-if="!isMiniPaneCollapsed"
        >
          <i class="far fa-minus-square"></i>
        </span>
        <span
          class="collapse"
          title="Click to expand"
          @click="collapseMiniPane"
          v-if="isMiniPaneCollapsed"
        >
          <i class="far fa-plus-square"></i>
        </span>
      </h2>
      <MiniSlots :isMiniPaneCollapsed="isMiniPaneCollapsed" />
    </div>

    <!-- saved palletes -->
    <div v-if="savedPalletes">
      <h2>
        Saved Palletes
        <span
          class="collapse"
          title="Click to collapse"
          @click="collapseSavedPane"
          v-if="!isSavedPaneCollapsed"
        >
          <i class="far fa-minus-square"></i>
        </span>
        <span
          class="collapse"
          title="Click to expand"
          @click="collapseSavedPane"
          v-if="isSavedPaneCollapsed"
        >
          <i class="far fa-plus-square"></i>
        </span>
      </h2>
      <SavedPalletes :isSavedPaneCollapsed="isSavedPaneCollapsed" />
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
import MainColorBox from "./components/MainColorBar.vue";
import ColorsPane from "./components/ColorsPane.vue";
import UtilityButtons from "./components/UtilityButtons.vue";
import MiniSlots from "./components/MiniSlots.vue";
import SavedPalletes from "./components/SavedPalletes.vue";
import Instructions from "./components/InstructionsModal.vue";
import CopyModal from "./components/ExportCssModal.vue";
import SaveModal from "./components/SaveModal.vue";

const store = useStore();

const showCopyModal = ref(false);
const showSaveModal = ref(false);
const showInstructionsModal = ref(false);

const isColorPaneCollapsed = ref(false);
const isMiniPaneCollapsed = ref(false);
const isSavedPaneCollapsed = ref(false);

const uniqueColors = computed(() => store.getters.uniqueColors);
const mainHSL = computed(() => store.state.mainHSL);
const savedPalletes = computed(() => store.state.savedPallettes.length);
const showUtilityButtons = computed(() => store.getters.fullSchemeSet);

const collapseColorPane = () => {
  isColorPaneCollapsed.value = !isColorPaneCollapsed.value;
};

const collapseMiniPane = () => {
  isMiniPaneCollapsed.value = !isMiniPaneCollapsed.value;
};

const collapseSavedPane = () => {
  isSavedPaneCollapsed.value = !isSavedPaneCollapsed.value;
};
</script>


<style>
@import "./style/app.css";
</style>
