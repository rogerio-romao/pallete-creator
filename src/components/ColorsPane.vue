<template>
  <main>
    <!-- Pallete Pane  -->
    <section class="pallete-pane">
      <template v-for="i in 5" :key="i">
        <color-slot
          @setMainColor="setMainColor($event)"
          @addColor="addColor($event)"
          :slotNumber="i"
          :mainHsl="mainHSL"
          :mainSet="mainSet"
        />
      </template>
    </section>
  </main>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import ColorSlot from "./ColorSlot.vue";
const mainHSL = ref(null);
const allColors = reactive([]);
const setMainColor = (hsl) => {
  mainHSL.value = hsl;
};
const mainSet = computed(() => mainHSL.value !== null);
const addColor = (hsl) => {
  allColors.push(...hsl);
};
const uniqueColors = computed(() => {
  return new Set(allColors.slice(1));
});
</script>

<style>
</style>