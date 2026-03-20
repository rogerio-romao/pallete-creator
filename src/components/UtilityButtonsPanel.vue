// Utility buttons for testing palette, resetting colors, etc.

<template>
    <!-- wrapper  -->
    <div class="utility-buttons" data-test="utility-buttons">
        <!-- individual buttons  -->
        <button
            class="secondary-button"
            @click="setRandomScheme"
            data-test="random-scheme-button"
            data-tooltip="Randomize all 5 slots"
        >
            <i class="fas fa-random" title="Generate random scheme" />
            Random Variations
        </button>

        <button
            v-if="showButtons"
            class="secondary-button"
            data-test="test-palette-button"
            data-tooltip="Apply this palette to the UI so you can preview it live"
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
            data-tooltip="Restore the UI to its default colors"
        >
            <i class="far fa-window-restore"></i>
            Reset site colors
        </button>

        <button
            v-if="showButtons"
            class="secondary-button"
            data-test="set-light-text-button"
            data-tooltip="Set text color to light"
            @click="setLightText"
        >
            <i class="far fa-lightbulb"></i>
            Light Text
        </button>

        <button
            v-if="showButtons"
            class="secondary-button"
            data-test="set-dark-text-button"
            data-tooltip="Set text color to dark"
            @click="setDarkText"
        >
            <i class="fas fa-lightbulb"></i>
            Dark Text
        </button>

        <button
            v-if="showButtons"
            class="secondary-button"
            data-test="export-css-button"
            data-tooltip="Copy the palette as CSS variables to your clipboard"
            @click="copyPalette"
        >
            <i class="far fa-copy"></i>
            Export CSS
        </button>

        <button
            v-if="showButtons"
            class="secondary-button"
            data-test="save-palette-button"
            data-tooltip="Save this palette to local storage"
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

    import DEFAULT_HEX_COLORS, { DEFAULT_LIGHT_COLORS } from '../lib/colors';

    const emit = defineEmits(['copyPalette', 'savePalette']);

    const store = useStore();

    const showButtons = computed(() => store.getters.fullSchemeSet);

    /** Sets text color to the default light color for the current theme */
    const setLightText = () => {
        const hex =
            store.state.theme === 'light'
                ? DEFAULT_LIGHT_COLORS.LIGHT
                : DEFAULT_HEX_COLORS.LIGHT;
        document.documentElement.style.setProperty('--text-color', hex);
        store.dispatch('SET_TEXT_COLOR', 'light');
    };

    /** Sets text color to the default dark color for the current theme */
    const setDarkText = () => {
        const hex =
            store.state.theme === 'light'
                ? DEFAULT_LIGHT_COLORS.DARK
                : DEFAULT_HEX_COLORS.DARK;
        document.documentElement.style.setProperty('--text-color', hex);
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

    /** Resets the site colors to default by removing inline overrides */
    const resetSiteColors = () => {
        for (const v of [
            '--clr-main',
            '--clr-secondary',
            '--clr-accent',
            '--clr-light',
            '--clr-dark',
        ]) {
            document.documentElement.style.removeProperty(v);
        }
        store.commit('SET_IS_TESTING', false);
    };

    /** Sets the CSS variables to the current palette colors, allowing the user to test the palette on the site */
    const setCssVars = () => {
        const main = store.state.mainSlotColor.hex;
        const secondary = store.state.slotColors.slot2.hex;
        const accent = store.state.slotColors.slot3.hex;
        const light = store.state.slotColors.slot4.hex;
        const dark = store.state.slotColors.slot5.hex;

        document.documentElement.style.setProperty('--clr-main', main);
        document.documentElement.style.setProperty(
            '--clr-secondary',
            secondary,
        );
        document.documentElement.style.setProperty('--clr-accent', accent);
        document.documentElement.style.setProperty('--clr-light', light);
        document.documentElement.style.setProperty('--clr-dark', dark);
        store.commit('SET_IS_TESTING', true);
    };
</script>
