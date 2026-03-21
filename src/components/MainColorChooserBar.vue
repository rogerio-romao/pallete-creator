// This component is the main color chooser bar that allows users to select a
main color for their palette. It includes a random color generator button,
inputs for RGB, HEX, and HSL color formats, and a color picker. The component
interacts with the Vuex store to set the main color and generate variations
based on it.

<template>
    <!-- wrapper  -->
    <div class="main-color-bar">
        <!-- random button  -->
        <button
            class="main-button"
            @click="setMainColor"
            data-testid="random-button"
        >
            <i class="fas fa-random" title="Generate random color" />
            Random
        </button>

        <div class="inputs-wrapper">
            <!-- rgb input  -->
            <form @submit.prevent="submitRgb" data-testid="rgb-form">
                <div class="input-wrapper" data-tooltip="RGB — e.g. 255,120,80">
                    <label for="rgbInput" class="input-label">RGB</label>
                    <input
                        type="text"
                        data-testid="rgb-input"
                        placeholder="255,255,255"
                        :pattern="rgbPattern"
                        id="rgbInput"
                        @input="normalizeColorSeparators"
                    />
                    <button type="submit" aria-label="Submit RGB color">
                        <i class="fas fa-chevron-circle-right"></i>
                    </button>
                </div>
            </form>

            <!-- hex input  -->
            <form @submit.prevent="submitHex" data-testid="hex-form">
                <div
                    class="input-wrapper"
                    data-tooltip="HEX — e.g. ff7850 or #ff7850"
                >
                    <label for="hexInput" class="input-label">HEX</label>
                    <input
                        type="text"
                        data-testid="hex-input"
                        placeholder="ffffff"
                        :pattern="hexPattern"
                        id="hexInput"
                    />
                    <button type="submit" aria-label="Submit hex color">
                        <i class="fas fa-chevron-circle-right"></i>
                    </button>
                </div>
            </form>

            <!-- hsl input  -->
            <form @submit.prevent="submitHsl" data-testid="hsl-form">
                <div class="input-wrapper" data-tooltip="HSL — e.g. 190,75,80">
                    <label for="hslInput" class="input-label">HSL</label>
                    <input
                        type="text"
                        data-testid="hsl-input"
                        placeholder="190,75,80"
                        :pattern="hslPattern"
                        id="hslInput"
                        @input="normalizeColorSeparators"
                    />
                    <button type="submit" aria-label="Submit HSL color">
                        <i class="fas fa-chevron-circle-right"></i>
                    </button>
                </div>
            </form>
        </div>

        <!-- color input  -->
        <form @submit.prevent="submitColor" data-testid="color-form" class="color-form">
            <div class="input-wrapper" data-tooltip="Color wheel picker">
                <label for="colorInput" class="input-label">COLOR</label>
                <input
                    type="color"
                    data-testid="color-input"
                    id="colorInput"
                />
                <button type="submit" aria-label="Apply color">
                    <i class="fas fa-chevron-circle-right"></i>
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
    import { useStore } from 'vuex';
    import { generateHsl, hexToHsl, rgbToHsl, toHslString } from '../lib/utils';

    const store = useStore();

    const hexPattern = '^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$';
    const rgbPattern = String.raw`\b(1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])\b,\s*\b(1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])\b,\s*\b(1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])\b`;
    const hslPattern = String.raw`\b(([0-9]|[1-9][0-9]|[1-2][0-9]{2}|3[0-5][0-9]|360))\b,\s*\b([0-9]|[1-9][0-9]|100)\b,\s*\b([0-9]|[1-9][0-9]|100)\b`;

    const COLOR_CHANNEL_COUNT = 3;

    /**
     * Normalizes color input by replacing spaces with commas, capped at 3 values.
     * @param {Event} e - The input event from an RGB or HSL text field.
     */
    const normalizeColorSeparators = (e) => {
        const input = /** @type {HTMLInputElement} */ (e.target);
        const cursorPos = input.selectionStart ?? 0;
        const val = input.value;

        let normalized = val
            .replaceAll(/\s+/g, ',')
            .replaceAll(/,+/g, ',')
            .replace(/^,/, '');

        const parts = normalized.split(',');
        if (parts.length > COLOR_CHANNEL_COUNT) {
            normalized = parts.slice(0, COLOR_CHANNEL_COUNT).join(',');
        }

        if (normalized !== val) {
            input.value = normalized;
            const lengthDiff = normalized.length - val.length;
            input.setSelectionRange(cursorPos + lengthDiff, cursorPos + lengthDiff);
        }
    };

    /**
     * Generates a random HSL color and sets it as the main color in the store.
     */
    const setMainColor = () => {
        const hsl = generateHsl();
        store.dispatch('SET_MAIN_COLOR', hsl);
    };

    /**
     * Handles the submission of the RGB color input, converting it to HSL and setting it as the main color.
     * @param {SubmitEvent} e - The form submission event.
     */
    const submitRgb = (e) => {
        const form = /** @type {HTMLFormElement} */ (e.target);
        const rgbInput = /** @type {HTMLInputElement} */ (
            form.querySelector('#rgbInput')
        );

        const rgb = rgbInput.value;
        if (!rgb) {
            return;
        }

        const hsl = rgbToHsl(rgb);
        store.dispatch('SET_MAIN_COLOR', hsl);

        rgbInput.value = '';
    };

    /**
     * Handles the submission of the hex color input, converting it to HSL and setting it as the main color.
     * @param {SubmitEvent} e - The form submission event.
     */
    const submitHex = (e) => {
        const form = /** @type {HTMLFormElement} */ (e.target);
        const hexInput = /** @type {HTMLInputElement} */ (
            form.querySelector('#hexInput')
        );

        const hex = hexInput.value;
        if (!hex) {
            return;
        }

        const hsl = hexToHsl(hex);
        store.dispatch('SET_MAIN_COLOR', hsl);

        hexInput.value = '';
    };

    /**
     * Handles the submission of the HSL color input, converting it to HSL string and setting it as the main color.
     * @param {SubmitEvent} e - The form submission event.
     */
    const submitHsl = (e) => {
        const form = /** @type {HTMLFormElement} */ (e.target);
        const hslInput = /** @type {HTMLInputElement} */ (
            form.querySelector('#hslInput')
        );

        const val = hslInput.value;
        if (!val) {
            return;
        }

        const [h, s, l] = val.split(',').map(Number);
        const hsl = toHslString(h ?? 0, s ?? 0, l ?? 0);
        store.dispatch('SET_MAIN_COLOR', hsl);

        hslInput.value = '';
    };

    /**
     * Handles the submission of the color input form, setting the main color to the selected value.
     * @param {SubmitEvent} e - The form submission event.
     */
    const submitColor = (e) => {
        const form = /** @type {HTMLFormElement} */ (e.target);
        const colorInput = /** @type {HTMLInputElement} */ (
            form.querySelector('#colorInput')
        );

        // remove the # from the color value
        const color = colorInput.value.slice(1);
        if (!color) {
            return;
        }
        const hsl = hexToHsl(color);
        store.dispatch('SET_MAIN_COLOR', hsl);
    };
</script>
