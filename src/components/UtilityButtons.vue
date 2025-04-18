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
            {{ isUserSignedIn ? 'Save Palette' : 'Login to save' }}
        </button>
    </div>
</template>

<script setup>
    import { computed } from 'vue';
    import { useStore } from 'vuex';

    const emit = defineEmits(['copyPalette', 'savePalette', 'openSignInModal']);

    const store = useStore();

    const isUserSignedIn = computed(() => store.state.isUserSignedIn);
    const showButtons = computed(() => store.getters.fullSchemeSet);

    // Text color to light

    const setLightText = () => {
        document.documentElement.style.setProperty('--text-color', '#faebd7');
        store.dispatch('SET_TEXT_COLOR', 'light');
    };

    // Text color to dark

    const setDarkText = () => {
        document.documentElement.style.setProperty('--text-color', '#0f131a');
        store.dispatch('SET_TEXT_COLOR', 'dark');
    };

    const copyPalette = () => {
        emit('copyPalette');
    };

    const savePalette = () => {
        if (isUserSignedIn.value) {
            emit('savePalette');
        } else {
            emit('openSignInModal');
        }
    };

    // Picks a unique random color from the variations and sets it on the main palette pane.

    const setRandomScheme = () => {
        store.dispatch('SET_RANDOM_SCHEME');
    };

    // Back to default colors

    const resetSiteColors = () => {
        const siteColors = store.state.siteColors;
        document.documentElement.style.setProperty(
            '--clr-main',
            siteColors.main
        );
        document.documentElement.style.setProperty(
            '--clr-complementary',
            siteColors.complementary
        );
        document.documentElement.style.setProperty(
            '--clr-light',
            siteColors.light
        );
        document.documentElement.style.setProperty(
            '--clr-accent',
            siteColors.accent
        );
        document.documentElement.style.setProperty(
            '--clr-accent-light',
            siteColors.dark
        );
    };

    // Test this palette on the site

    const setCssVars = () => {
        const main = computed(() => store.state.mainSlotColor.hex);
        const complementary = computed(() => store.state.slotColors.slot2.hex);
        const light = computed(() => store.state.slotColors.slot3.hex);
        const accent = computed(() => store.state.slotColors.slot4.hex);
        const accentLight = computed(() => store.state.slotColors.slot5.hex);

        document.documentElement.style.setProperty('--clr-main', main.value);
        document.documentElement.style.setProperty(
            '--clr-complementary',
            complementary.value
        );
        document.documentElement.style.setProperty('--clr-light', light.value);
        document.documentElement.style.setProperty(
            '--clr-accent',
            accent.value
        );
        document.documentElement.style.setProperty(
            '--clr-accent-light',
            accentLight.value
        );
    };
</script>
