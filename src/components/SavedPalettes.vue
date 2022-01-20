<template>
  <!-- panel wrapper  -->
  <section class="saved-palette-pane panel">
    <!-- panel collapsed message  -->
    <p v-if="isSavedPaneCollapsed">Click the plus sign to reopen panel.</p>
    <div class="hide" v-if="!isSavedPaneCollapsed">
      <!-- header text  -->
      <div class="panel-header">
        <p>
          Any palettes you save will appear here. Clicking on one will load it
          on the color slots for editing or exporting the CSS.
        </p>
      </div>

      <!-- palettes container  -->
      <div class="palettes-wrapper">
        <!-- one palette  -->
        <div
          v-for="palette in palettes"
          :key="palette.id"
          class="saved-palette"
          @click="editPalette(palette.scheme.slice(1))"
        >
          <!-- palette info  -->
          <div class="saved-palette-header">
            <h4>{{ palette.name }}</h4>
            <div @click.stop="deletePalette(palette.id)">
              <i class="fas fa-trash-alt"></i>
            </div>
          </div>

          <!-- palette colors  -->
          <div class="saved-palette-colors">
            <div
              v-for="(color, i) in palette.scheme.slice(1)"
              :key="i"
              class="saved-palette-color"
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

const palettes = computed(() => store.state.savedPalettes);

// Puts the clicked on palette on the color slots for editing.

const editPalette = (palette) => {
  store.dispatch("SET_PALETTE_FROM_SAVED", palette);
};

// Deletes the clicked on palette from the saved palletes.

const deletePalette = (id) => {
  const confirm = window.confirm(
    "Are you sure you want to delete this palette? This action cannot be undone."
  );
  if (confirm) {
    store.dispatch("DELETE_PALETTE", id);
  }
};
</script>
