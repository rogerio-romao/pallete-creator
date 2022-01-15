<template>
  <!-- wrapper  -->
  <section class="pallete-pane">
    <!-- individual slot  -->
    <template v-for="i in 5" :key="i">
      <ColorSlot :slotNumber="i" />
    </template>
  </section>
</template>

<script setup>
import ColorSlot from "./ColorSlot.vue";
</script>

<style>
</style>