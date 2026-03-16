<template>
    <!-- wrapper  -->
    <div class="main-color-bar">
        <!-- random button  -->
        <button
            class="main-button"
            @click="setMainColor"
            data-test="random-button"
        >
            <i class="fas fa-random" title="Generate random color" />
            Random
        </button>

        <div class="inputs-wrapper">
            <!-- rgb input  -->
            <form @submit.prevent="submitRgb" data-test="rgb-form">
                <div class="input-wrapper">
                    <label for="rgbInput" class="sr-only"
                        >RGB color value</label
                    >
                    <input
                        type="text"
                        data-test="rgb-input"
                        placeholder="RGB - 255,255,255"
                        title="Enter 3 numbers between 0 and 255, separated by commas"
                        :pattern="rgbPattern"
                        id="rgbInput"
                        aria-label="RGB color value"
                    />
                    <button type="submit" aria-label="Submit RGB color">
                        <i class="fas fa-chevron-circle-right"></i>
                    </button>
                </div>
            </form>

            <!-- hex input  -->
            <form @submit.prevent="submitHex" data-test="hex-form">
                <div class="input-wrapper">
                    <label for="hexInput" class="sr-only">Hex color code</label>
                    <input
                        type="text"
                        data-test="hex-input"
                        placeholder="HEX # - ffffff"
                        title="Enter a hex color code, without the #"
                        :pattern="hexPattern"
                        id="hexInput"
                        aria-label="Hex color code"
                    />
                    <button type="submit" aria-label="Submit hex color">
                        <i class="fas fa-chevron-circle-right"></i>
                    </button>
                </div>
            </form>

            <!-- hsl input  -->
            <form @submit.prevent="submitHsl" data-test="hsl-form">
                <div class="input-wrapper">
                    <label for="hslInput" class="sr-only"
                        >HSL color value</label
                    >
                    <input
                        type="text"
                        data-test="hsl-input"
                        placeholder="HSL - 190,75,80"
                        title="Enter H between 0 and 360, then S and L between 0 and 100, separated by commas"
                        :pattern="hslPattern"
                        id="hslInput"
                        aria-label="HSL color value"
                    />
                    <button type="submit" aria-label="Submit HSL color">
                        <i class="fas fa-chevron-circle-right"></i>
                    </button>
                </div>
            </form>
        </div>

        <!-- color input  -->
        <form @submit.prevent="submitColor" data-test="color-form">
            <div class="input-wrapper">
                <label for="colorInput" class="sr-only">Color picker</label>
                <input
                    type="color"
                    data-test="color-input"
                    id="colorInput"
                    title="Click to select from color wheel"
                    aria-label="Color picker"
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

    // Regex patterns for inputs validation

    const hexPattern = '^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$';
    const rgbPattern = String.raw`\b(1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])\b,\s*\b(1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])\b,\s*\b(1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])\b`;
    const hslPattern = String.raw`\b(([0-9]|[1-9][0-9]|[1-2][0-9]{2}|3[0-5][0-9]|360))\b,\s*\b([0-9]|[1-9][0-9]|100)\b,\s*\b([0-9]|[1-9][0-9]|100)\b`;

    /* --- maybe refactor these handlers --- */
    /* ---  vvvvvvvvvv     vvvvvvvvvvv   --- */

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
            form.querySelector('[data-test="rgb-input"]')
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
            form.querySelector('[data-test="hex-input"]')
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
            form.querySelector('[data-test="hsl-input"]')
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
            form.querySelector('[data-test="color-input"]')
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
