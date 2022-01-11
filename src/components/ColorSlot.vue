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
    <div class="color-controls">
      <fieldset>
        <div class="control-field">
          <label for="hueControl">H</label>
          <input
            type="range"
            name="hue"
            id="hueControl"
            min="0"
            max="360"
            v-model="h"
            @change="updateColor"
          />
        </div>
        <div class="control-field">
          <label for="satControl">S</label>
          <input
            type="range"
            name="sat"
            id="satControl"
            min="0"
            max="100"
            v-model="s"
            @change="updateColor"
          />
        </div>
        <div class="control-field">
          <label for="lumControl">L</label>
          <input
            type="range"
            name="lum"
            id="lumControl"
            min="0"
            max="100"
            v-model="l"
            @change="updateColor"
          />
        </div>
      </fieldset>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watchEffect } from "vue";
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

const h = ref(0);
const s = ref(0);
const l = ref(0);

watchEffect(() => {
  if (hsl.value) {
    h.value = hsl.value.match(/\d+/g).map(Number)[0];
    s.value = hsl.value.match(/\d+/g).map(Number)[1];
    l.value = hsl.value.match(/\d+/g).map(Number)[2];
  } else {
    h.value = 0;
    s.value = 0;
    l.value = 0;
  }
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

const updateColor = () => {
  const newColor = `hsl(${h.value}, ${s.value}%, ${l.value}%)`;
  if (props.slotNumber === 1) {
    store.dispatch("SET_MAIN_COLOR", newColor);
  } else {
    store.dispatch("UPDATE_SLOT_COLOR", {
      slot: props.slotNumber,
      hsl: newColor,
    });
  }
};
</script>

<style>
</style>