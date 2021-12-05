<template>
  <main>
    <!-- Pallete Pane  -->
    <section class="pallete-pane">
      <template v-for="i in 5" :key="i">
        <color-slot
          @setMainColor="setMainColor($event)"
          :slotNumber="i"
          :mainHsl="mainHSL"
          :mainSet="mainSet"
        />
      </template>
    </section>
  </main>
</template>

<script setup>
import { computed, ref } from "vue";
import ColorSlot from "./ColorSlot.vue";
const mainHSL = ref(null);
const setMainColor = (hsl) => {
  mainHSL.value = hsl;
};
const mainSet = computed(() => mainHSL.value !== null);
</script>

<style>
</style>