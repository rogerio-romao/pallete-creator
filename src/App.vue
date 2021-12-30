<template>
  <header>
    <nav>
      <main-nav></main-nav>
    </nav>
  </header>
  <main>
    <h1 class="heading1">Build your pallete</h1>
    <colors-pane></colors-pane>
    <h2 v-if="uniqueColors.size" class="heading2">Pick your variations</h2>
    <mini-slots v-if="uniqueColors.size"></mini-slots>
  </main>
</template>

<script setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";

import MainNav from "./components/MainNav.vue";
import ColorsPane from "./components/ColorsPane.vue";
import MiniSlots from "./components/MiniSlots.vue";

const store = useStore();
const uniqueColors = computed(() => store.getters.uniqueColors);
</script>


<style>
@import "./style/app.css";
</style>
