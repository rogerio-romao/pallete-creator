<template>
  <div class="saved-pallete-pane">
    <div v-for="pallete in palletes" :key="pallete.id" class="saved-pallete">
      <div class="saved-pallete-header">
        <h4>{{ pallete.name }}</h4>
      </div>
      <div class="saved-pallete-colors">
        <div
          v-for="(color, i) in pallete.scheme.slice(1)"
          :key="i"
          class="saved-pallete-color"
          :style="{ backgroundColor: color.hsl }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();

const palletes = computed(() => store.state.savedPallettes);
</script>

<style>
</style>