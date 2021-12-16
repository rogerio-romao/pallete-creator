<template>
  <section class="mini-slots">
    <div
      v-for="(color, i) in colors"
      :class="['mini-slot', { copied: colorCopied && colorCopiedIndex === i }]"
      :key="i"
      :style="{ backgroundColor: color }"
      @click="copyColor(color, i)"
    ></div>
  </section>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  colors: {
    type: Set,
  },
});

const emit = defineEmits(["copyColor"]);
const colorCopied = ref(false);
const colorCopiedIndex = ref(null);

const copyColor = (color, index) => {
  emit("copyColor", color);
  colorCopied.value = true;
  colorCopiedIndex.value = index;
};
</script>

<style>
</style>