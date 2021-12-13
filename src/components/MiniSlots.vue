<template>
  <div class="mini-slots">
    <div
      class="mini-slot"
      v-for="(color, i) in allColors"
      :key="i"
      :style="{ backgroundColor: color }"
    ></div>
  </div>
</template>

<script setup>
const props = defineProps({
  allColors: {
    type: Array,
    default: () => [],
  },
});
</script>

<style>
</style>