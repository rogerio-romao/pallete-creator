/** @typedef {ReturnType<typeof import('./state.js').default>} State */
/** @typedef {import('./state.js').ColorSlot} ColorSlot */
/** @typedef {import('./state.js').SavedPalette} SavedPalette */
/** @typedef {'slot2' | 'slot3' | 'slot4' | 'slot5'} SlotKey */

/**
 * Vuex mutations for the color palette application.
 * These mutations are responsible for updating the state in response to actions, such as adding new colors, resetting colors when a new main color is created, setting copied colors, updating labels, and managing saved palettes.
 * @module store/mutations
 */
const mutations = {
    /**
     * Adds generated color variations to the state (allColors).
     * @param {State} state - The Vuex state object.
     * @param {ColorSlot} colors - The color values to add.
     */
    ADD_COLOR(state, colors) {
        const { hsl, rgb, hex } = colors;
        state.allColors.hsl.push(hsl);
        state.allColors.rgb.push(rgb);
        state.allColors.hex.push(hex);
    },

    /**
     * Resets all color slots and sets the main color when a new main color is created.
     * @param {State} state - The Vuex state object.
     * @param {ColorSlot} colors - The new main color values.
     */
    RESET_ALL_COLORS(state, colors) {
        const { hsl, rgb, hex } = colors;
        state.allColors = {
            hex: [hex],
            hsl: [hsl],
            rgb: [rgb],
        };
        state.slotColors = {
            slot2: {
                hex: '',
                hsl: '',
                rgb: '',
            },
            slot3: {
                hex: '',
                hsl: '',
                rgb: '',
            },
            slot4: {
                hex: '',
                hsl: '',
                rgb: '',
            },
            slot5: {
                hex: '',
                hsl: '',
                rgb: '',
            },
        };
    },

    /**
     * Sets the copied color from mini slots to the state.
     * @param {State} state - The Vuex state object.
     * @param {string} color - The copied color value.
     */
    SET_COPIED_COLOR(state, color) {
        state.copiedColor = color;
    },

    /**
     * Sets the copied color index from mini slots to the state.
     * @param {State} state - The Vuex state object.
     * @param {number|null} index - The index of the copied color, or null if none is selected.
     */
    SET_COPIED_COLOR_INDEX(state, index) {
        state.copiedColorIndex = index;
    },

    /**
     * Sets the edited color label for a specific slot in the state.
     * @param {State} state - The Vuex state object.
     * @param {{ label: string, slotNumber: number }} payload - The label and the slot number to update.
     */
    SET_LABEL(state, { label, slotNumber }) {
        state.labels[slotNumber] = label;
    },

    /**
     * Sets the main color slot and updates the main color values in the state.
     * @param {State} state - The Vuex state object.
     * @param {ColorSlot} colors - The new main color values.
     */
    SET_MAIN_COLOR(state, colors) {
        const { hsl, rgb, hex } = colors;
        state.mainHSL = hsl;
        state.mainSlotColor.hsl = hsl;
        state.mainSlotColor.rgb = rgb;
        state.mainSlotColor.hex = hex;
    },

    /**
     * Saves the palettes to the state after a local storage operation.
     * @param {State} state - The Vuex state object.
     * @param {SavedPalette[]} palettes - The array of saved palettes.
     */
    SET_SAVED_PALETTES(state, palettes) {
        state.savedPalettes = palettes;
    },

    /**
     * Sets the color values for a specific slot in the state.
     * @param {State} state - The Vuex state object.
     * @param {{ slot: SlotKey, hsl: string, rgb: string, hex: string }} payload - The slot identifier and color values.
     */
    SET_SLOT_COLOR(state, { slot, hsl, rgb, hex }) {
        state.slotColors[slot].hsl = hsl;
        state.slotColors[slot].rgb = rgb;
        state.slotColors[slot].hex = hex;
    },

    /**
     * Sets the text color in the state.
     * @param {State} state - The Vuex state object.
     * @param {ColorSlot} colors - The color values for the text color.
     */
    SET_TEXT_COLOR(state, colors) {
        state.textColor = colors;
    },
};

export default mutations;
