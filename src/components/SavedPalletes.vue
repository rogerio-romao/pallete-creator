<template>
  <!-- panel wrapper  -->
  <section class="saved-pallete-pane panel">
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
      <div class="palletes-wrapper">
        <!-- one palette  -->
        <div
          v-for="pallete in palletes"
          :key="pallete.id"
          class="saved-pallete"
          @click="editPallette(pallete.scheme.slice(1))"
        >
          <!-- palette info  -->
          <div class="saved-pallete-header">
            <h4>{{ pallete.name }}</h4>
            <div @click.stop="deletePalette(pallete.id)">
              <i class="fas fa-trash-alt"></i>
            </div>
          </div>
          <!-- palette colors  -->
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

const deletePalette = (id) => {
  const confirm = window.confirm(
    "Are you sure you want to delete this pallete? This action cannot be undone."
  );
  if (confirm) {
    store.dispatch("DELETE_PALLETE", id);
  }
};
</script>

<style>
</style>