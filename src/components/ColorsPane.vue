<template>
  <main>
    <!-- Pallete Pane  -->
    <section class="pallete-pane">
      <template v-for="i in 5" :key="i">
        <color-slot @setMainColor="setMainColor(rgb)" />
      </template>
    </section>
  </main>
</template>

<script setup>
import { ref } from "vue";
import ColorSlot from "./ColorSlot.vue";
const mainRed = ref(null);
const mainGreen = ref(null);
const mainBlue = ref(null);
const setMainColor = (rgb) => {
  console.log(rgb);
};
</script>

<style>
</style>