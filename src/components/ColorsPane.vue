<template>
  <section class="pallete-pane">
    <template class="color-slots" v-for="i in 5" :key="i">
      <ColorSlot :slotNumber="i" />
    </template>
  </section>
</template>

<script setup>
import { computed } from "vue";
import ColorSlot from "./ColorSlot.vue";
</script>

<style>
</style>