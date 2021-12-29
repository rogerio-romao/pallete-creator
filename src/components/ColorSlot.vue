<template>
  <div class="slot-container">
    <div class="label centered">
      <i class="fas fa-edit edit-label" title="Edit color name" />
      <input type="text" :value="labels[slotNumber]" @change="updateLabel" />
    </div>
    <div
      class="color-slot"
      @click="pasteColor"
      :style="{
        backgroundColor: slotBg,
      }"
    >
      <span :style="{ color: lightOrDark }">{{ rgb }}</span>
      <span :style="{ color: lightOrDark }">{{ hex }}</span>
      <span :style="{ color: lightOrDark }">{{ hsl }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
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

const slotBg = computed(() =>
  props.slotNumber === 1
    ? store.state.mainHSL
    : store.state.slotColors[`slot${props.slotNumber}`].hsl
);

const lightOrDark = computed(() => {
  const lum = parseInt(hsl.value.split(",")[2]);
  return lum < 50 ? "white" : "black";
});

const pasteColor = () => {
  store.dispatch("PASTE_COLOR", props.slotNumber);
};

const updateLabel = (e) => {
  store.dispatch("UPDATE_LABEL", {
    slotNumber: props.slotNumber,
    label: e.target.value.trim(),
  });
};
</script>

<style>
</style>