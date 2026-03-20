// This component represents an individual color slot in the palette, displaying
the color and its various formats (HSL, RGB, HEX). It also includes an input for
editing the color label and a set of sliders for adjusting the color values. The
component interacts with the Vuex store to manage state and update colors
accordingly.

<template>
    <!-- Individual color Slot  -->
    <div class="palette-slot">
        <!-- label edit div  -->
        <div class="palette-slot-label centered">
            <label :for="`slot-label-${slotNumber}`" class="sr-only"
                >Color label for slot {{ slotNumber }}</label
            >
            <input
                type="text"
                :value="labels[slotNumber]"
                @change="updateLabel"
                :id="`slot-label-${slotNumber}`"
                data-testid="palette-color-slot-label-input"
            />
        </div>

        <!-- slot  -->
        <div
            class="palette-slot-color"
            data-testid="palette-color-slot"
            @click="pasteColor"
            :style="{
                backgroundColor: slotBg,
            }"
            role="button"
            :aria-label="`Color slot ${slotNumber}: ${hex}. Click to paste color.`"
        >
            <!-- one format at a time  -->
            <span
                v-if="activeFormat === 'hex'"
                :style="{ color: lightOrDark }"
                >{{ hex }}</span
            >
            <span
                v-else-if="activeFormat === 'hsl'"
                :style="{ color: lightOrDark }"
                >{{ format(hsl) }}</span
            >
            <span v-else :style="{ color: lightOrDark }">{{
                format(rgb)
            }}</span>
        </div>

        <!-- format cycle button  -->
        <button
            class="format-toggle"
            :style="{ color: 'var(--text-color)' }"
            @click.stop="cycleFormat"
            :title="`Show ${nextFormat} format`"
            data-testid="format-toggle"
            >{{ activeFormat }}</button
        >

        <!-- controls  -->
        <PaletteColorSliders :slotNumber="slotNumber" />
    </div>
</template>

<script setup>
    import { useStore } from 'vuex';
    import { computed, ref } from 'vue';

    import PaletteColorSliders from './PaletteColorSliders.vue';

    const { slotNumber } = defineProps({
        slotNumber: {
            default: 1,
            type: Number,
        },
    });

    const store = useStore();
    const labels = computed(() => store.state.labels);

    const formats = ['hex', 'hsl', 'rgb'];
    const activeFormat = ref('hex');

    const nextFormat = computed(() => {
        const i = formats.indexOf(activeFormat.value);
        return formats[(i + 1) % formats.length];
    });

    const cycleFormat = () => {
        activeFormat.value = nextFormat.value ?? 'hex';
    };

    // Getting values to display in the slot

    const hsl = computed(() =>
        slotNumber === 1
            ? store.state.mainSlotColor.hsl
            : store.state.slotColors[`slot${slotNumber}`].hsl,
    );

    const rgb = computed(() =>
        slotNumber === 1
            ? store.state.mainSlotColor.rgb
            : store.state.slotColors[`slot${slotNumber}`].rgb,
    );

    const hex = computed(() =>
        slotNumber === 1
            ? store.state.mainSlotColor.hex
            : store.state.slotColors[`slot${slotNumber}`].hex,
    );

    /**
     * Removes all spaces from a color code string before displaying it.
     * @param {string} str - The color code string to format.
     * @returns {string} The formatted color code string without spaces.
     */
    const format = (str) => str.replaceAll(' ', '');

    // Getting the background color of the slot

    const slotBg = computed(() =>
        slotNumber === 1
            ? store.state.mainHSL
            : store.state.slotColors[`slot${slotNumber}`].hsl,
    );

    // Changes the text color of the slot to make it readable on light or dark backgrounds

    const lightOrDark = computed(() => {
        const lum = Number.parseInt(hsl.value.split(',')[2], 10);
        // oxlint-disable-next-line no-magic-numbers
        return lum < 50 ? 'white' : 'black';
    });

    // Paste a color from the mini palette to the slot

    const pasteColor = () => {
        store.dispatch('PASTE_COLOR', slotNumber);
    };

    /**
     * Updates the label for the color slot in the store when the input value changes.
     * @param {Event} e - The change event from the label input.
     */
    const updateLabel = (e) => {
        const input = /** @type {HTMLInputElement} */ (e.target);
        store.dispatch('UPDATE_LABEL', {
            label: input.value.trim(),
            slotNumber,
        });
    };
</script>
