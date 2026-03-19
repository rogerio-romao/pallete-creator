/** @typedef {ReturnType<typeof import('./state.js').default>} State */
/** @typedef {import('./state.js').ColorSlot} ColorSlot */

/**
 * Vuex getters for the color palette application.
 * These getters provide computed properties based on the state, such as the current color scheme, whether all slots are set, and the unique colors across all generated variations.
 * @module store/getters
 */
const getters = {
    /**
     * Used for the export css and save palette modals
     * @param {State} state - Vuex root state
     * @returns {ColorSlot[]}  The current color scheme as an array of ColorSlot objects, including text color, main slot color, and the colors of slots 2 to 5. Each ColorSlot contains hex, hsl, and rgb values for the respective slot.
     * */
    currentScheme: (state) => [
        {
            hex: state.textColor.hex,
            hsl: state.textColor.hsl,
            rgb: state.textColor.rgb,
        },
        {
            hex: state.mainSlotColor.hex,
            hsl: state.mainHSL ?? state.mainSlotColor.hsl,
            rgb: state.mainSlotColor.rgb,
        },
        {
            hex: state.slotColors.slot2.hex,
            hsl: state.slotColors.slot2.hsl,
            rgb: state.slotColors.slot2.rgb,
        },
        {
            hex: state.slotColors.slot3.hex,
            hsl: state.slotColors.slot3.hsl,
            rgb: state.slotColors.slot3.rgb,
        },
        {
            hex: state.slotColors.slot4.hex,
            hsl: state.slotColors.slot4.hsl,
            rgb: state.slotColors.slot4.rgb,
        },
        {
            hex: state.slotColors.slot5.hex,
            hsl: state.slotColors.slot5.hsl,
            rgb: state.slotColors.slot5.rgb,
        },
    ],

    /**
     * Checks if all color slots (main slot and slots 2 to 5) have their HSL values set. This is used to determine whether to display utility buttons that require a complete color scheme.
     * @param {State} state - Vuex root state
     * @returns {boolean} Whether all slots have a color set
     */
    fullSchemeSet: (state) =>
        Object.values(state.slotColors).every((color) => color.hsl !== ''),

    /**
     * Computes a set of unique HSL color values across all generated variations. This is useful for features that need to know the distinct colors used in the palette, such as displaying all colors.
     * @param {State} state - Vuex root state
     * @returns {Set<string>} Unique HSL color values across all generated variations
     */
    uniqueColors: (state) => new Set(state.allColors.hsl),
};

export default getters;
