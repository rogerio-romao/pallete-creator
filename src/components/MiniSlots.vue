<template>
  <!-- wrapper   -->
  <section class="mini-slots">
    <p v-if="isMiniPaneCollapsed">Click the plus sign to reopen panel.</p>
    <div class="hide" v-if="!isMiniPaneCollapsed">
      <!-- header text  -->
      <div class="mini-slots-header">
        <p>
          Click any variation to copy it, then click on one of the main color
          slots above to paste it. Or click the randomize button to generate a
          full pallete.
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
      <!-- end all slots  -->
      <!-- actions  -->
      <div class="mini-slots-actions">
        <button
          v-if="colors.size"
          class="secondary-button"
          @click="setRandomScheme"
        >
          <i class="fas fa-random" title="Generate random scheme" />
          Pick Random Variations
        </button>
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

const colors = computed(() => store.getters.uniqueColors);
const colorCopied = computed(() => store.state.copiedColor);
const colorCopiedIndex = computed(() => store.state.copiedColorIndex);

const copyColor = (color, index) => {
  store.dispatch("COPY_COLOR", { color, index });
};

const setRandomScheme = () => {
  store.dispatch("SET_RANDOM_SCHEME");
};
</script>

<style>
</style>