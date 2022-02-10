<template>
  <!-- wrapper   -->
  <section class="mini-slots-pane panel">
    <!-- panel collapsed message  -->
    <p v-if="isMiniPaneCollapsed">Click the plus sign to reopen panel.</p>
    <div class="hide" v-if="!isMiniPaneCollapsed">
      <!-- header text  -->
      <div class="panel-header">
        <p>
          Click any variation to copy it, then click on one of the main color
          slots above to paste it. Or click the randomize button above to generate a
          full palette.
        </p>
      </div>

      <!-- all the slots  -->
      <div class="mini-slots-slots">
        <!-- one slot  -->
        <div
          v-for="(color, i) in colors"
          :class="[
            'mini-slot',
            { copied: colorCopied && colorCopiedIndex === i },
          ]"
          :key="i"
          :style="{ backgroundColor: color }"
          @click="copyColor(color, i)"
        ></div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";

const props = defineProps({
  isMiniPaneCollapsed: {
    type: Boolean,
    default: false,
  },
});

const store = useStore();

const colorCopied = computed(() => store.state.copiedColor);
const colorCopiedIndex = computed(() => store.state.copiedColorIndex);
const colors = computed(() => store.getters.uniqueColors);

// Puts the clicked on variation in memory for pasting.

const copyColor = (color, index) => {
  store.dispatch("COPY_COLOR", { color, index });
};
</script>
