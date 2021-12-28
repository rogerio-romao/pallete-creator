<template>
  <div class="centered">
    <h3 contenteditable="true" class="label">
      {{ labels[slotNumber] }}
      <i class="fas fa-edit edit-label" title="Edit color name" />
    </h3>
    <div
      class="color-slot"
      @click="pasteColor"
      :style="{
        backgroundColor: slotBg,
      }"
    >
      <span class="rgbValue">{{ rgb }}</span>
      <span class="hexValue">{{ hex }}</span>
      <span class="hslValue">{{ hsl }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect, computed } from "vue";
import { rgbToHex, hslToRgb } from "../lib/utils";
import { useStore } from "vuex";

const props = defineProps({
  slotNumber: {
    type: Number,
    default: 1,
  },
});

const store = useStore();
const colorCopied = computed(() => store.state.copiedColor);
const labels = computed(() => store.state.labels);

const hsl = ref("");
const rgb = ref("");
const hex = ref("");

const slotBg = computed(() =>
  props.slotNumber === 1
    ? store.state.mainHSL
    : store.state.slotColors[`slot${props.slotNumber}`].hsl
);

const pasteColor = () => {
  store.dispatch("PASTE_COLOR", props.slotNumber);
};
</script>

<style>
</style>