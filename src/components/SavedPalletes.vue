<template>
  <section class="saved-pallete-pane panel">
    <p v-if="isSavedPaneCollapsed">Click the plus sign to reopen panel.</p>
    <div class="hide" v-if="!isSavedPaneCollapsed">
      <div class="panel-header">
        <p>
          Any palettes you save will appear here. Clicking on one will load it
          on color slots for editing, or exporting the CSS.
        </p>
      </div>
      <div class="palletes-wrapper">
        <div
          v-for="pallete in palletes"
          :key="pallete.id"
          class="saved-pallete"
          @click="editPallette(pallete.scheme.slice(1))"
        >
          <div class="saved-pallete-header">
            <h4>{{ pallete.name }}</h4>
          </div>
          <div class="saved-pallete-colors">
            <div
              v-for="(color, i) in pallete.scheme.slice(1)"
              :key="i"
              class="saved-pallete-color"
              :style="{ backgroundColor: color.hsl }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();

const props = defineProps({
  isSavedPaneCollapsed: {
    type: Boolean,
    default: false,
  },
});

const palletes = computed(() => store.state.savedPallettes);

const editPallette = (pallete) => {
  store.dispatch("SET_PALLETE_FROM_SAVED", pallete);
};
</script>

<style>
</style>