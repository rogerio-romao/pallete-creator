<template>
  <section class="mini-slots">
    <div
      v-for="(color, i) in colors"
      :class="['mini-slot', { copied: colorCopied && colorCopiedIndex === i }]"
      :key="i"
      :style="{ backgroundColor: color }"
      @click="copyColor(color, i)"
    ></div>
    <button
      v-if="props.colors.size"
      class="generate-color"
      @click="setRandomScheme"
    >
      <i class="fas fa-random" title="Generate random scheme" />
    </button>
  </section>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  colors: {
    type: Set,
  },
});

const emit = defineEmits(["copyColor", "setRandomScheme"]);
const colorCopied = ref(false);
const colorCopiedIndex = ref(null);

const copyColor = (color, index) => {
  emit("copyColor", color);
  colorCopied.value = true;
  colorCopiedIndex.value = index;
};

const setRandomScheme = () => {
  const randomColors = [];
  for (let i = 0; i < 5; i++) {
    randomColors.push(
      [...props.colors][Math.floor(Math.random() * props.colors.size)]
    );
  }
  emit("setRandomScheme", randomColors);
};
</script>

<style>
</style>