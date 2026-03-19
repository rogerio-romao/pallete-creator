// Utility buttons for testing palette, resetting colors, etc.

<template>
    <!-- wrapper  -->
    <div class="utility-buttons" data-test="utility-buttons">
        <!-- individual buttons  -->
        <button
            class="secondary-button"
            @click="setRandomScheme"
            data-test="random-scheme-button"
        >
            <i class="fas fa-random" title="Generate random scheme" />
            Random Variations
        </button>

        <button
            v-if="showButtons"
            class="secondary-button"
            data-test="test-palette-button"
            @click="setCssVars"
        >
            <i class="fas fa-vial"></i>
            Test this palette
        </button>

        <button
            v-if="showButtons"
            class="secondary-button"
            @click="resetSiteColors"
            data-test="reset-site-colors-button"
        >
            <i class="far fa-window-restore"></i>
            Reset site colors
        </button>

        <button
            v-if="showButtons"
            class="secondary-button"
            data-test="set-light-text-button"
            @click="setLightText"
        >
            <i class="far fa-lightbulb"></i>
            Light Text
        </button>

        <button
            v-if="showButtons"
            class="secondary-button"
            data-test="set-dark-text-button"
            @click="setDarkText"
        >
            <i class="fas fa-lightbulb"></i>
            Dark Text
        </button>

        <button
            v-if="showButtons"
            class="secondary-button"
            data-test="export-css-button"
            @click="copyPalette"
        >
            <i class="far fa-copy"></i>
            Export CSS
        </button>

        <button
            v-if="showButtons"
            class="secondary-button"
            data-test="save-palette-button"
            @click="savePalette"
        >
            <i class="fas fa-save"></i>
            Save Palette
        </button>
    </div>
</template>

<script setup>
    import { computed } from 'vue';
    import { useStore } from 'vuex';

    import DEFAULT_HEX_COLORS from '../lib/colors';

    const emit = defineEmits(['copyPalette', 'savePalette']);

    const store = useStore();

    const showButtons = computed(() => store.getters.fullSchemeSet);

    /** Sets text color to light */
    const setLightText = () => {
        document.documentElement.style.setProperty(
            '--text-color',
            DEFAULT_HEX_COLORS.LIGHT_TEXT,
        );
        store.dispatch('SET_TEXT_COLOR', 'light');
    };

    /** Sets text color to dark */
    const setDarkText = () => {
        document.documentElement.style.setProperty(
            '--text-color',
            DEFAULT_HEX_COLORS.DARK_TEXT,
        );
        store.dispatch('SET_TEXT_COLOR', 'dark');
    };

    /** Copies the current palette to the clipboard */
    const copyPalette = () => {
        emit('copyPalette');
    };

    /** Saves the current palette */
    const savePalette = () => {
        emit('savePalette');
    };

    /** Picks a unique random color from the variations and sets it on the main palette pane */
    const setRandomScheme = () => {
        store.dispatch('SET_RANDOM_SCHEME');
    };

    /** Resets the site colors to default */
    const resetSiteColors = () => {
        document.documentElement.style.setProperty(
            '--clr-main',
            DEFAULT_HEX_COLORS.MAIN,
        );
        document.documentElement.style.setProperty(
            '--clr-complementary',
            DEFAULT_HEX_COLORS.COMPLEMENTARY,
        );
        document.documentElement.style.setProperty(
            '--clr-light',
            DEFAULT_HEX_COLORS.LIGHT,
        );
        document.documentElement.style.setProperty(
            '--clr-accent',
            DEFAULT_HEX_COLORS.ACCENT,
        );
        document.documentElement.style.setProperty(
            '--clr-accent-light',
            DEFAULT_HEX_COLORS.ACCENT_LIGHT,
        );
    };

    /** Sets the CSS variables to the current palette colors, allowing the user to test the palette on the site */
    const setCssVars = () => {
        const main = store.state.mainSlotColor.hex;
        const complementary = store.state.slotColors.slot2.hex;
        const light = store.state.slotColors.slot3.hex;
        const accent = store.state.slotColors.slot4.hex;
        const accentLight = store.state.slotColors.slot5.hex;

        document.documentElement.style.setProperty('--clr-main', main);
        document.documentElement.style.setProperty(
            '--clr-complementary',
            complementary,
        );
        document.documentElement.style.setProperty('--clr-light', light);
        document.documentElement.style.setProperty('--clr-accent', accent);
        document.documentElement.style.setProperty(
            '--clr-accent-light',
            accentLight,
        );
    };
</script>
