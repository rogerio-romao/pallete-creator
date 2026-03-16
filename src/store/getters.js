/** @typedef {ReturnType<typeof import('./state.js').default>} State */
/** @typedef {import('./state.js').ColorSlot} ColorSlot */

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
    // used to display the utility buttons
    /**
     * @param {State} state - Vuex root state
     * @returns {boolean} Whether all slots have a color set
     */
    fullSchemeSet: (state) =>
        Object.values(state.slotColors).every((color) => color.hsl !== ''),
    // used for the mini slots panel
    /**
     * @param {State} state - Vuex root state
     * @returns {Set<string>} Unique HSL color values across all generated variations
     */
    uniqueColors: (state) => new Set(state.allColors.hsl),
};

export default getters;
