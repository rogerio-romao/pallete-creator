// oxlint-disable no-console

/** @typedef {ReturnType<typeof import('./state.js').default>} State */
/** @typedef {import('./state.js').ColorSlot} ColorSlot */
/** @typedef {{ uniqueColors: Set<string>, fullSchemeSet: boolean, currentScheme: ColorSlot[] }} Getters */
/** @typedef {{ commit: (mutation: string, payload?: unknown) => void, dispatch: (action: string, payload?: unknown) => void, state: State, getters: Getters }} ActionCtx */

import paletteService from '../services/paletteService';
import {
    generateAnalogous,
    generateComplement,
    generateHsl,
    generateMono,
    generateSaturations,
    generateTriad,
    hslToRgb,
    rgbToHex,
} from '../lib/utils';

const MIN_SCHEME_SIZE = 4;

/**
 * Vuex actions for the palette creator app. These actions handle user interactions and async operations, committing mutations to update the state accordingly.
 * @module store/actions
 */
const actions = {
    /**
     * Trigerred when a user clicks the "Copy" button on a color slot. Commits mutations to clear the copied color from the state.
     * @param {ActionCtx} ctx - Vuex action context
     */
    CLEAR_COPIED_COLOR({ commit }) {
        commit('SET_COPIED_COLOR', '');
        commit('SET_COPIED_COLOR_INDEX', null);
    },
    /**
     * Trigerred when a user clicks on a mini slot to copy its color value. Commits mutations to set the copied color and its index in the state.
     * @param {ActionCtx} ctx - Vuex action context
     * @param {{ color: string, index: number }} payload - color to copy and its slot index
     */
    COPY_COLOR({ commit }, { color, index }) {
        commit('SET_COPIED_COLOR', color);
        commit('SET_COPIED_COLOR_INDEX', index);
    },

    /**
     * Trigerred when a user clicks the delete button on a saved palette. Calls the paletteService to delete the palette and dispatches an action to reload the palettes in the state.
     * @param {ActionCtx} ctx - Vuex action context
     * @param {string} id - palette id to delete
     */
    DELETE_PALETTE({ dispatch }, id) {
        try {
            paletteService.delete(id);
            dispatch('LOAD_PALETTES');
        } catch (error) {
            console.error('Failed to delete palette:', error);
            throw error;
        }
    },

    /**
     * Trigerred when a user generates a main color. Dispatches actions to reset the color slots and generate variations based on the new main color.
     * @param {ActionCtx} ctx - Vuex action context
     * @param {{ color: string, fn: (color: string) => string[] }} payload - base color and variation generator function
     */
    GENERATE_VARIATIONS({ commit }, { color, fn }) {
        const variations = fn(color);
        for (const hsl of variations) {
            const rgb = hslToRgb(hsl);
            const hex = rgbToHex(rgb);
            commit('ADD_COLOR', { hex, hsl, rgb });
        }
    },

    /**
     * Trigerred when a user loads the saved palettes, and on app start. Calls the paletteService to fetch all palettes and commits them to the state.
     * @param {ActionCtx} ctx - Vuex action context
     */
    LOAD_PALETTES({ commit }) {
        try {
            const palettes = paletteService.getAll();
            // this will trigger a re-render of the saved palettes list in the UI
            commit('SET_SAVED_PALETTES', palettes);
        } catch (error) {
            console.error('Failed to load palettes:', error);
            // if loading fails, we clear the saved palettes to avoid showing stale data
            commit('SET_SAVED_PALETTES', []);
            throw error;
        }
    },

    /**
     * Trigerred when a user clicks on a color slot to paste the copied color value. Commits mutations to set the target slot color based on the copied color in the state.
     * @param {ActionCtx} ctx - Vuex action context
     * @param {number} slot - slot number to paste into
     */
    PASTE_COLOR({ commit, state, dispatch }, slot) {
        if (!state.copiedColor) {
            return;
        }

        const hsl = state.copiedColor;
        const rgb = hslToRgb(hsl);
        const hex = rgbToHex(rgb);

        if (slot === 1) {
            dispatch('SET_MAIN_COLOR', hsl);
        } else {
            commit('SET_SLOT_COLOR', { hex, hsl, rgb, slot: `slot${slot}` });
        }
    },

    /**
     * Trigerred when a user saves a palette. Calls the paletteService to save the palette to local storage and dispatches an action to reload the palettes in the state.
     * @param {ActionCtx} ctx - Vuex action context
     * @param {{ name: string, scheme: ColorSlot[] }} payload - palette name and color scheme to save
     */
    SAVE_PALETTE({ dispatch }, { name, scheme }) {
        try {
            paletteService.save({
                name,
                scheme,
            });
            dispatch('LOAD_PALETTES');
        } catch (error) {
            console.error('Failed to save palette:', error);
            throw error;
        }
    },

    /**
     * Trigerred when a user generates a new main color. Commits mutations to set the main color and reset the color slots, then dispatches actions to generate variations based on the new main color.
     * @param {ActionCtx} ctx - Vuex action context
     * @param {string | null} color - HSL color string, or null to generate a random one
     */
    SET_MAIN_COLOR({ commit, dispatch }, color) {
        const hsl = color || generateHsl();
        const rgb = hslToRgb(hsl);
        const hex = rgbToHex(rgb);

        commit('SET_MAIN_COLOR', { hex, hsl, rgb });
        commit('RESET_ALL_COLORS', { hex, hsl, rgb });
        dispatch('GENERATE_VARIATIONS', { color: hsl, fn: generateComplement });
        dispatch('GENERATE_VARIATIONS', { color: hsl, fn: generateMono });
        dispatch('GENERATE_VARIATIONS', { color: hsl, fn: generateTriad });
        dispatch('GENERATE_VARIATIONS', { color: hsl, fn: generateAnalogous });
        dispatch('GENERATE_VARIATIONS', {
            color: hsl,
            fn: generateSaturations,
        });
    },

    /**
     * Trigerred when a user clicks on a saved palette to load it into the main view. Dispatches actions to set the main color and slot colors based on the colors in the saved palette.
     * @param {ActionCtx} ctx - Vuex action context
     * @param {ColorSlot[]} palette - saved palette slots to restore
     */
    SET_PALETTE_FROM_SAVED({ dispatch }, palette) {
        const [main, ...others] = palette;
        if (!main?.hsl) {
            return;
        }

        dispatch('SET_MAIN_COLOR', main.hsl);
        for (const [index, slot] of others.entries()) {
            // oxlint-disable-next-line no-magic-numbers -- the first slot is text color and the second slot is the main color, so the generated variations start from slot 2
            dispatch('UPDATE_SLOT_COLOR', { hsl: slot.hsl, slot: index + 2 });
        }
    },

    /**
     * Trigerred when a user clicks on the "Randomize" button to fill the slots with random unique colors from the variations.
     * @param {ActionCtx} ctx - Vuex action context
     */
    // oxlint-disable-next-line max-statements
    SET_RANDOM_SCHEME({ commit, state, getters }) {
        const unique = [...getters.uniqueColors].filter(
            (hsl) => hsl !== state.mainHSL,
        );
        if (unique.length === 0) {
            return;
        }

        const randomScheme = new Set();
        const maxAttempts = 100;
        let attempts = 0;

        // We want to ensure we get a full scheme of unique colors, but there might not be enough unique colors to fill all the slots. To avoid an infinite loop, we set a maximum number of attempts to find unique colors.
        while (randomScheme.size < MIN_SCHEME_SIZE && attempts < maxAttempts) {
            const hsl = unique[Math.floor(Math.random() * unique.length)];
            if (!randomScheme.has(hsl)) {
                randomScheme.add(hsl);
            }
            attempts += 1;
        }

        let slot = 2;
        for (const hsl of randomScheme) {
            const rgb = hslToRgb(hsl);
            const hex = rgbToHex(rgb);
            commit('SET_SLOT_COLOR', { hex, hsl, rgb, slot: `slot${slot}` });
            slot += 1;
        }
    },

    /**
     * Trigerred when a user changes the text color variant. Commits mutations to set the text color based on the selected variant.
     * @param {ActionCtx} ctx - Vuex action context
     * @param {'light' | 'dark'} type - text color variant to apply
     */
    SET_TEXT_COLOR({ commit, state }, type) {
        if (type === 'light') {
            commit('SET_TEXT_COLOR', state.slotColors.slot4);
        } else if (type === 'dark') {
            commit('SET_TEXT_COLOR', state.slotColors.slot5);
        } else {
            // This should never happen since the UI only allows selecting between 'light' and 'dark', but we log a warning just in case.
            console.warn('Unknown text color type:', type);
        }
    },

    /**
     * Trigerred when a user updates the label of a specific slot. Commits mutations to set the new label for the target slot.
     * @param {ActionCtx} ctx - Vuex action context
     * @param {{ label: string, slotNumber: number }} payload - new label text and target slot number
     */
    UPDATE_LABEL({ commit }, { label, slotNumber }) {
        if (label.trim() === '') {
            return;
        }

        const formattedLabel = label.charAt(0).toUpperCase() + label.slice(1);
        commit('SET_LABEL', { label: formattedLabel, slotNumber });
    },

    /**
     * Trigerred when a user updates the color of a specific slot. Commits mutations to set the new color values for the target slot based on the provided HSL color.
     * @param {ActionCtx} ctx - Vuex action context
     * @param {{ slot: number, hsl: string }} payload - target slot number and HSL color to set
     */
    UPDATE_SLOT_COLOR({ commit }, { slot, hsl }) {
        const rgb = hslToRgb(hsl);
        const hex = rgbToHex(rgb);
        commit('SET_SLOT_COLOR', { hex, hsl, rgb, slot: `slot${slot}` });
    },
};

export default actions;
