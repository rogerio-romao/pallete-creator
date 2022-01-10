<template>
  <!-- Main Color Box  -->
  <main-color-box />
  <!-- Pallete Pane  -->
  <section class="pallete-pane" v-if="mainHSL">
    <template class="color-slots" v-for="i in 5" :key="i">
      <color-slot :slotNumber="i" />
    </template>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";

import ColorSlot from "./ColorSlot.vue";
import MainColorBox from "./MainColorBox.vue";

const store = useStore();

const mainHSL = computed(() => store.state.mainHSL);
</script>

<style>
</style>