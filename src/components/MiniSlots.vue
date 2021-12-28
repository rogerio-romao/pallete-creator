<template>
  <section class="mini-slots">
    <div
      v-for="(color, i) in colors"
      :class="['mini-slot', { copied: colorCopied && colorCopiedIndex === i }]"
      :key="i"
      :style="{ backgroundColor: color }"
      @click="copyColor(color, i)"
    ></div>
    <button v-if="colors.size" class="generate-color" @click="setRandomScheme">
      <i class="fas fa-random" title="Generate random scheme" />
    </button>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";

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