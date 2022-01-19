<template>
  <!-- Individual color Slot  -->
  <div class="slot-container">
    <!-- label edit div  -->
    <div class="label centered">
      <input type="text" :value="labels[slotNumber]" @change="updateLabel" />
    </div>

    <!-- slot  -->
    <div
      class="color-slot"
      @click="pasteColor"
      :style="{
        backgroundColor: slotBg,
      }"
    >
      <!-- text inside slots  -->
      <span :style="{ color: lightOrDark }">{{ format(hsl) }}</span>
      <span :style="{ color: lightOrDark }">{{ hex }}</span>
      <span :style="{ color: lightOrDark }">{{ format(rgb) }}</span>
    </div>

    <!-- controls  -->
    <ColorControls :slotNumber="slotNumber" />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";

import ColorControls from "./ColorControls.vue";

const props = defineProps({
  slotNumber: {
    type: Number,
    default: 1,
  },
});

const store = useStore();
const colorCopied = computed(() => store.state.copiedColor);
const labels = computed(() => store.state.labels);

// Getting values to display in the slot

const hsl = computed(() => {
  return props.slotNumber === 1
    ? store.state.mainSlotColor.hsl
    : store.state.slotColors[`slot${props.slotNumber}`].hsl;
});

const rgb = computed(() => {
  return props.slotNumber === 1
    ? store.state.mainSlotColor.rgb
    : store.state.slotColors[`slot${props.slotNumber}`].rgb;
});

const hex = computed(() => {
  return props.slotNumber === 1
    ? store.state.mainSlotColor.hex
    : store.state.slotColors[`slot${props.slotNumber}`].hex;
});

// Uility to get rid of spaces in the color codes before displaying them

const format = (str) => str.replace(/ /g, "");

// Getting the background color of the slot

const slotBg = computed(() =>
  props.slotNumber === 1
    ? store.state.mainHSL
    : store.state.slotColors[`slot${props.slotNumber}`].hsl
);

// Changes the text color of the slot to make it readable on light or dark backgrounds

const lightOrDark = computed(() => {
  const lum = parseInt(hsl.value.split(",")[2]);
  return lum < 50 ? "white" : "black";
});

// Paste a color from the mini palette to the slot

const pasteColor = () => {
  store.dispatch("PASTE_COLOR", props.slotNumber);
};

// Handles changing the text in the labels

const updateLabel = (e) => {
  store.dispatch("UPDATE_LABEL", {
    slotNumber: props.slotNumber,
    label: e.target.value.trim(),
  });
};
</script>