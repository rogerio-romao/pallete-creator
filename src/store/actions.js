// oxlint-disable no-console

import DEFAULT_HEX_COLORS from '../lib/colors';
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

const actions = {
    // trigerred when user clicks on a mini slot for copying
    COPY_COLOR({ commit }, { color, index }) {
        commit('SET_COPIED_COLOR', color);
        commit('SET_COPIED_COLOR_INDEX', index);
    },
    // deletes a palette from local storage
    DELETE_PALETTE({ dispatch }, id) {
        try {
            paletteService.delete(id);
            dispatch('LOAD_PALETTES');
        } catch (error) {
            console.error('Failed to delete palette:', error);
            throw error;
        }
    },
    // trigerred when user generates a main color
    GENERATE_VARIATIONS({ commit }, { color, fn }) {
        const variations = fn(color);
        for (const hsl of variations) {
            const rgb = hslToRgb(hsl);
            const hex = rgbToHex(rgb);
            commit('ADD_COLOR', { hex, hsl, rgb });
        }
    },
    LOAD_PALETTES({ commit }) {
        try {
            const palettes = paletteService.getAll();
            commit('SET_SAVED_PALETTES', palettes);
        } catch (error) {
            console.error('Failed to load palettes:', error);
            commit('SET_SAVED_PALETTES', []);
        }
    },
    // pastes the selected variation on the specific color slot
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
    // save to local storage
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
    // resets everything, sets the main color and generates variations
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
    // makes the site colors be this scheme
    SET_PALETTE_FROM_SAVED({ dispatch }, palette) {
        const [main, ...others] = palette;
        dispatch('SET_MAIN_COLOR', main.hsl);
        for (const [index, slot] of others.entries()) {
            // oxlint-disable-next-line no-magic-numbers -- slots start at 1 and the first slot is the main color
            dispatch('UPDATE_SLOT_COLOR', { hsl: slot.hsl, slot: index + 2 });
        }
    },
    // fills the slots with random unique colors from the variations
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
    // changes the text colors from light to dark
    SET_TEXT_COLOR({ commit }, type) {
        if (type === 'light') {
            commit('SET_TEXT_COLOR', {
                hex: DEFAULT_HEX_COLORS.LIGHT_TEXT,
                hsl: 'hsl(38, 35%, 62%)',
                rgb: 'rgb(184, 168, 134)',
            });
        } else if (type === 'dark') {
            commit('SET_TEXT_COLOR', {
                hex: DEFAULT_HEX_COLORS.DARK_TEXT,
                hsl: 'hsl(218, 27%, 8%)',
                rgb: 'rgb(15, 19, 26)',
            });
        }
    },
    // updates the label of a specific slot
    UPDATE_LABEL({ commit }, { label, slotNumber }) {
        const formattedLabel = label[0].toUpperCase() + label.slice(1);
        commit('SET_LABEL', { label: formattedLabel, slotNumber });
    },
    // updates the color of a specific slot
    UPDATE_SLOT_COLOR({ commit }, { slot, hsl }) {
        const rgb = hslToRgb(hsl);
        const hex = rgbToHex(rgb);
        commit('SET_SLOT_COLOR', { hex, hsl, rgb, slot: `slot${slot}` });
    },
};

export default actions;
