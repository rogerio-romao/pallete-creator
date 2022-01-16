<template>
  <!-- wrapper  -->
  <section class="pallete-pane">
    <!-- header  -->
    <div class="pallete-pane-header">
      <p class="description">
        Setting main color resets everything. You can edit color labels and
        adjust color properties with the controls.
      </p>
    </div>
    <!-- individual slots  -->
    <div class="pallete-pane-slots">
      <template v-for="i in 5" :key="i">
        <ColorSlot :slotNumber="i" />
      </template>
    </div>
  </section>
</template>

<script setup>
import ColorSlot from "./ColorSlot.vue";
</script>

<style>
</style>