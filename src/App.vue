<template>
  <!-- NAV  -->
  <MainNav></MainNav>

  <!-- MAIN  -->
  <main>
    <!-- main color control box  -->
    <h2>Set Main Color</h2>
    <MainColorBox />

    <!-- color pallete pane  -->
    <div v-if="mainHSL">
      <h2>Build your pallete</h2>
      <ColorsPane />
    </div>

    <!-- mini slots / variations  -->
    <div v-if="uniqueColors.size">
      <h2>Pick your variations</h2>
      <MiniSlots />
    </div>

    <!-- utility buttons  -->
    <UtilityButtons
      @copyPallete="showCopyModal = true"
      @savePallete="showSaveModal = true"
    />

    <!-- saved palletes -->
    <div v-if="savedPalletes">
      <h2>Saved Palletes</h2>
      <SavedPalletes />
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
</script>


<style>
@import "./style/app.css";
</style>
