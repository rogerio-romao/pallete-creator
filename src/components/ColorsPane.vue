<template>
  <!-- wrapper  -->
  <section class="pallete-pane panel">
    <p v-if="isColorPaneCollapsed">Click the plus sign to reopen panel.</p>
    <div class="hide" v-if="!isColorPaneCollapsed">
      <!-- header  -->
      <div class="panel-header">
        <p>
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
    </div>
  </section>
</template>

<script setup>
import ColorSlot from "./ColorSlot.vue";

const props = defineProps({
  isColorPaneCollapsed: {
    type: Boolean,
    default: false,
  },
});
</script>

<style>
</style>