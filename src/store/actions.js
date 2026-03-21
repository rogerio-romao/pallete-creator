// oxlint-disable max-lines
// oxlint-disable no-magic-numbers
// oxlint-disable no-console

/** @typedef {ReturnType<typeof import('./state.js').default> & { theme: 'dark' | 'light' }} State */
/** @typedef {import('./state.js').ColorSlot} ColorSlot */
/** @typedef {{ uniqueColors: Array<{ hex: string, hsl: string, rgb: string, type: string }>, colorsByType: Record<string, Array<{ hex: string, hsl: string, rgb: string, type: string }>>, fullSchemeSet: boolean, currentScheme: ColorSlot[] }} Getters */
/** @typedef {{ commit: (mutation: string, payload?: unknown) => void, dispatch: (action: string, payload?: unknown) => void, state: State, getters: Getters }} ActionCtx */

import paletteService from '../services/paletteService';
import DEFAULT_HEX_COLORS, { DEFAULT_LIGHT_COLORS } from '../lib/colors';
import {
    generateAnalogous,
    generateComplement,
    generateHsl,
    generateMono,
    generateSaturations,
    generateTriad,
    getLightness,
    hslToRgb,
    rgbToHex,
} from '../lib/utils';

/**
 * Returns the semantic role for a generated palette slot.
 * @param {number} slotNum - the palette slot number
 * @returns {'secondary' | 'accent' | 'light' | 'dark'} The semantic role for the slot.
 */
const getSlotRole = (slotNum) => {
    const slotRoles = ['secondary', 'accent', 'light', 'dark'];
    return /** @type {'secondary' | 'accent' | 'light' | 'dark'} */ (
        slotRoles[slotNum - 2] ?? 'secondary'
    );
};

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
     * @param {{ color: string, fn: (color: string) => string[], type: string }} payload - base color, variation generator function, and variation type
     */
    GENERATE_VARIATIONS({ commit }, { color, fn, type }) {
        const variations = fn(color);
        for (const hsl of variations) {
            const rgb = hslToRgb(hsl);
            const hex = rgbToHex(rgb);
            commit('ADD_COLOR', { hex, hsl, rgb, type });
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
        dispatch('GENERATE_VARIATIONS', {
            color: hsl,
            fn: generateComplement,
            type: 'complement',
        });
        dispatch('GENERATE_VARIATIONS', {
            color: hsl,
            fn: generateMono,
            type: 'mono',
        });
        dispatch('GENERATE_VARIATIONS', {
            color: hsl,
            fn: generateTriad,
            type: 'triad',
        });
        dispatch('GENERATE_VARIATIONS', {
            color: hsl,
            fn: generateAnalogous,
            type: 'analogous',
        });
        dispatch('GENERATE_VARIATIONS', {
            color: hsl,
            fn: generateSaturations,
            type: 'saturation',
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
            dispatch('UPDATE_SLOT_COLOR', {
                hsl: slot.hsl,
                slot: index + 2,
                type: slot.type,
            });
        }
    },

    /**
     * Trigerred when a user clicks on the "Randomize" button to fill the slots with random unique colors from the variations.
     * @param {ActionCtx} ctx - Vuex action context
     */
    // oxlint-disable-next-line max-statements, max-lines-per-function, complexity
    SET_RANDOM_SCHEME({ commit, state, getters }) {
        const groups = getters.colorsByType;
        const all = getters.uniqueColors.filter(
            (e) => e.hsl !== state.mainHSL && e.type !== 'main',
        );
        if (all.length === 0) {
            return;
        }

        const used = new Set([state.mainHSL].filter(Boolean));
        const pickRandom = (
            /** @type {Array<{ hex: string, hsl: string, rgb: string, type: string }>} */ candidates,
        ) => {
            const available = candidates.filter((e) => !used.has(e.hsl));
            if (available.length === 0) {
                return null;
            }
            const pick =
                available[Math.floor(Math.random() * available.length)];
            if (pick) {
                used.add(pick.hsl);
            }
            return pick;
        };

        const EXTREME_LIGHT_THRESHOLD = 75;
        const EXTREME_DARK_THRESHOLD = 25;
        const MIN_LIGHTNESS_DIFF = 20;
        const mainLightness = state.mainHSL ? getLightness(state.mainHSL) : 50;
        const isExtreme =
            mainLightness > EXTREME_LIGHT_THRESHOLD ||
            mainLightness < EXTREME_DARK_THRESHOLD;

        const contrastFilter = (
            /** @type {Array<{ hex: string, hsl: string, rgb: string, type: string }>} */ candidates,
        ) => {
            if (!isExtreme) {
                return candidates;
            }
            const filtered = candidates.filter(
                (e) =>
                    Math.abs(getLightness(e.hsl) - mainLightness) >=
                    MIN_LIGHTNESS_DIFF,
            );
            return filtered.length > 0 ? filtered : candidates;
        };

        // slot2 (Secondary): analogous colors are harmonious and close to the main hue;
        // when main is extreme lightness, prefer analogous with contrast, fall back to any with contrast
        const secondaryPool = isExtreme
            ? contrastFilter(groups['analogous'] ?? [])
            : (groups['analogous'] ?? all);
        const secondary =
            pickRandom(
                secondaryPool.length > 0 ? secondaryPool : contrastFilter(all),
            ) ?? pickRandom(all);

        // slot3 (Accent): complement or triad colors are visually distinct;
        // when main is extreme lightness, prefer contrast-filtered pool, fall back to any with contrast
        const rawAccentPool = [
            ...(groups['complement'] ?? []),
            ...(groups['triad'] ?? []),
        ];
        const accentPool = isExtreme
            ? contrastFilter(rawAccentPool)
            : rawAccentPool;
        const accent =
            pickRandom(
                accentPool.length > 0 ? accentPool : contrastFilter(all),
            ) ?? pickRandom(all);

        // slot4 (Light): prefer colors with lightness >= 70; if none available (or all used), pick lightest unused
        const lightCandidates = all.filter((e) => getLightness(e.hsl) >= 70);
        const lightPool = lightCandidates.length > 0 ? lightCandidates : all;
        const light =
            pickRandom(lightPool) ??
            pickRandom(
                [...all].toSorted(
                    (a, b) => getLightness(b.hsl) - getLightness(a.hsl),
                ),
            );

        // slot5 (Dark): prefer colors with lightness <= 30; if none available (or all used), pick darkest unused
        const darkCandidates = all.filter((e) => getLightness(e.hsl) <= 30);
        const darkPool = darkCandidates.length > 0 ? darkCandidates : all;
        const dark =
            pickRandom(darkPool) ??
            pickRandom(
                [...all].toSorted(
                    (a, b) => getLightness(a.hsl) - getLightness(b.hsl),
                ),
            );

        for (const [slotNum, entry] of [
            [2, secondary],
            [3, accent],
            [4, light],
            [5, dark],
        ]) {
            if (!entry || typeof entry === 'number') {
                // oxlint-disable-next-line no-continue
                continue;
            }
            const rgb = hslToRgb(entry.hsl);
            const hex = rgbToHex(rgb);
            commit('SET_SLOT_COLOR', {
                hex,
                hsl: entry.hsl,
                rgb,
                slot: `slot${slotNum}`,
                type: getSlotRole(Number(slotNum)),
            });
        }
    },

    /**
     * Trigerred when a user changes the text color variant. Commits mutations to set the text color based on the selected variant.
     * @param {ActionCtx} ctx - Vuex action context
     * @param {'light' | 'dark'} type - text color variant to apply
     */
    SET_TEXT_COLOR({ commit, state }, type) {
        const isLight = state.theme === 'light';
        if (type === 'light') {
            commit(
                'SET_TEXT_COLOR',
                isLight
                    ? {
                          hex: DEFAULT_LIGHT_COLORS.LIGHT_TEXT,
                          hsl: 'hsl(216, 56%, 91%)',
                          rgb: 'rgb(220, 230, 245)',
                      }
                    : {
                          hex: DEFAULT_HEX_COLORS.LIGHT,
                          hsl: 'hsl(240, 5%, 96%)',
                          rgb: 'rgb(244, 244, 245)',
                      },
            );
        } else if (type === 'dark') {
            commit(
                'SET_TEXT_COLOR',
                isLight
                    ? {
                          hex: DEFAULT_LIGHT_COLORS.DARK_TEXT,
                          hsl: 'hsl(231, 25%, 20%)',
                          rgb: 'rgb(38, 42, 64)',
                      }
                    : {
                          hex: DEFAULT_HEX_COLORS.DARK,
                          hsl: 'hsl(240, 4%, 35%)',
                          rgb: 'rgb(82, 82, 91)',
                      },
            );
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
     * @param {{ slot: number, hsl: string, type?: string }} payload - target slot number, HSL color, and optional type to set
     */
    UPDATE_SLOT_COLOR({ commit }, { slot, hsl, type }) {
        const rgb = hslToRgb(hsl);
        const hex = rgbToHex(rgb);
        commit('SET_SLOT_COLOR', { hex, hsl, rgb, slot: `slot${slot}`, type });
    },
};

export default actions;
