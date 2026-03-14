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
import { paletteService } from '../services/paletteService';

const actions = {
    // trigerred when user clicks on a mini slot for copying
    COPY_COLOR({ commit }, { color, index }) {
        commit('SET_COPIED_COLOR', color);
        commit('SET_COPIED_COLOR_INDEX', index);
    },
    // deletes a palette from cloud storage (only if owned by current user)
    async DELETE_PALETTE({ dispatch }, id) {
        try {
            await paletteService.delete(id);
            dispatch('LOAD_PALETTES');
        } catch (error) {
            console.error('Failed to delete palette:', error);
            // Optionally, dispatch an error action or commit a mutation here
            throw error;
        }
    },
    // trigerred when user generates a main color
    GENERATE_VARIATIONS({ commit }, { color, fn }) {
        const variations = fn(color);
        variations.forEach((hsl) => {
            const rgb = hslToRgb(hsl);
            const hex = rgbToHex(rgb);
            commit('ADD_COLOR', { hsl, rgb, hex });
        });
    },
    async LOAD_PALETTES({ commit, state }) {
        if (!state.userEmail) {
            commit('SET_SAVED_PALETTES', []);
            return;
        }
        try {
            const palettes = await paletteService.getByUser(state.userEmail);
            commit('SET_SAVED_PALETTES', palettes);
        } catch (e) {
            console.error('Failed to load palettes:', e);
            commit('SET_SAVED_PALETTES', []);
        }
    },
    // pastes the selected variation on the specific color slot
    PASTE_COLOR({ commit, state, dispatch }, slot) {
        if (!state.copiedColor) return;
        const hsl = state.copiedColor;
        const rgb = hslToRgb(hsl);
        const hex = rgbToHex(rgb);
        if (slot === 1) {
            dispatch('SET_MAIN_COLOR', hsl);
        } else {
            commit('SET_SLOT_COLOR', { slot: `slot${slot}`, hsl, rgb, hex });
        }
    },
    // save to cloud
    async SAVE_TO_CLOUD({ commit, state, dispatch }, { name, scheme }) {
        await paletteService.save({
            userEmail: state.userEmail,
            name,
            scheme,
        });
        dispatch('LOAD_PALETTES');
    },
    // resets everything, sets the main color and generates variations
    SET_MAIN_COLOR({ commit, dispatch }, color) {
        const hsl = color || generateHsl();
        const rgb = hslToRgb(hsl);
        const hex = rgbToHex(rgb);
        commit('SET_MAIN_COLOR', { hsl, rgb, hex });
        commit('RESET_ALL_COLORS', { hsl, rgb, hex });
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
    SET_PALETTE_FROM_SAVED({ commit, dispatch }, palette) {
        const [main, ...others] = palette;
        dispatch('SET_MAIN_COLOR', main.hsl);
        others.forEach((slot, index) => {
            dispatch('UPDATE_SLOT_COLOR', { slot: index + 2, hsl: slot.hsl });
        });
    },
    // fills the slots with random unique colors from the variations
    SET_RANDOM_SCHEME({ commit, state, getters }) {
        const unique = [...getters.uniqueColors].filter(
            (hsl) => hsl !== state.mainHSL,
        );
        if (unique.length === 0) return;

        const randomScheme = new Set();
        const maxAttempts = 100;
        let attempts = 0;

        while (randomScheme.size < 4 && attempts < maxAttempts) {
            const hsl = unique[Math.floor(Math.random() * unique.length)];
            if (!randomScheme.has(hsl)) {
                randomScheme.add(hsl);
            }
            attempts++;
        }

        let slot = 2;
        randomScheme.forEach((hsl) => {
            const rgb = hslToRgb(hsl);
            const hex = rgbToHex(rgb);
            commit('SET_SLOT_COLOR', { slot: `slot${slot}`, hsl, rgb, hex });
            slot++;
        });
    },
    // changes the text colors from light to dark
    SET_TEXT_COLOR({ commit }, type) {
        if (type === 'light') {
            commit('SET_TEXT_COLOR', {
                hsl: 'hsl(38, 35%, 62%)',
                rgb: 'rgb(184, 168, 134)',
                hex: '#b8a886',
            });
        } else if (type === 'dark') {
            commit('SET_TEXT_COLOR', {
                hsl: 'hsl(218, 27%, 8%)',
                rgb: 'rgb(15, 19, 26)',
                hex: '#0f131a',
            });
        }
    },
    // login user
    SIGNIN_USER({ commit, dispatch }, email) {
        commit('SET_USER', email);
        dispatch('LOAD_PALETTES');
    },
    // logout user
    SIGNOUT_USER({ commit }) {
        commit('SET_USER', null);
    },
    // updates the label of a specific slot
    UPDATE_LABEL({ commit }, { label, slotNumber }) {
        label = label[0].toUpperCase() + label.slice(1);
        commit('SET_LABEL', { label, slotNumber });
    },
    // updates the color of a specific slot
    UPDATE_SLOT_COLOR({ commit }, { slot, hsl }) {
        const rgb = hslToRgb(hsl);
        const hex = rgbToHex(rgb);
        commit('SET_SLOT_COLOR', { slot: `slot${slot}`, hsl, rgb, hex });
    },
};

export default actions;
