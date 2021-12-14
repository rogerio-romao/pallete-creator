<template>
  <div class="mini-slots">
    <div
      class="mini-slot"
      v-for="(color, i) in colors"
      :key="i"
      :style="{ backgroundColor: color }"
    ></div>
  </div>
</template>

<script setup>
const props = defineProps({
  colors: {
    type: Set,
  },
});
</script>

<style>
</style>