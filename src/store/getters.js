/** @typedef {ReturnType<typeof import('./state.js').default>} State */
/** @typedef {import('./state.js').ColorSlot} ColorSlot */
/** @typedef {{ uniqueColors: Array<{ hex: string, hsl: string, rgb: string, type: string }>, colorsByType: Record<string, Array<{ hex: string, hsl: string, rgb: string, type: string }>>, fullSchemeSet: boolean, currentScheme: ColorSlot[] }} Getters */

/**
 * Vuex getters for the color palette application.
 * These getters provide computed properties based on the state, such as the current color scheme, whether all slots are set, and the unique colors across all generated variations.
 * @module store/getters
 */
const getters = {
    /**
     * Groups unique color entries by their generation type, excluding the main color.
     * @param {State} _state - Vuex root state
     * @param {Getters} rootGetters - Vuex getters
     * @returns {Record<string, Array<{ hex: string, hsl: string, rgb: string, type: string }>>} - An object where keys are generation types (e.g., 'complement', 'mono') and values are arrays of unique color entries of that type.
     */
    colorsByType: (_state, /** @type {Getters} */ rootGetters) => {
        /** @type {Record<string, Array<{ hex: string, hsl: string, rgb: string, type: string }>>} */
        const groups = {};
        for (const entry of rootGetters.uniqueColors) {
            if (entry.type === 'main') {
                // oxlint-disable-next-line no-continue
                continue;
            }
            (groups[entry.type] ??= []).push(entry);
        }
        return groups;
    },

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
            type: 'text',
        },
        {
            hex: state.mainSlotColor.hex,
            hsl: state.mainHSL ?? state.mainSlotColor.hsl,
            rgb: state.mainSlotColor.rgb,
            type: 'main',
        },
        {
            hex: state.slotColors.slot2.hex,
            hsl: state.slotColors.slot2.hsl,
            rgb: state.slotColors.slot2.rgb,
            type: state.slotColors.slot2.type ?? 'secondary',
        },
        {
            hex: state.slotColors.slot3.hex,
            hsl: state.slotColors.slot3.hsl,
            rgb: state.slotColors.slot3.rgb,
            type: state.slotColors.slot3.type ?? 'accent',
        },
        {
            hex: state.slotColors.slot4.hex,
            hsl: state.slotColors.slot4.hsl,
            rgb: state.slotColors.slot4.rgb,
            type: state.slotColors.slot4.type ?? 'light',
        },
        {
            hex: state.slotColors.slot5.hex,
            hsl: state.slotColors.slot5.hsl,
            rgb: state.slotColors.slot5.rgb,
            type: state.slotColors.slot5.type ?? 'dark',
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
     * Computes a deduplicated, type-grouped array of color entries across all generated variations.
     * Colors are preserved in insertion order (complement, mono, triad, analogous, saturation),
     * which naturally groups them by generation type.
     * @param {State} state - Vuex root state
     * @returns {Array<{ hex: string, hsl: string, rgb: string, type: string }>} An array of unique color entries, where each entry includes hex, hsl, rgb values and its generation type (e.g., 'complement', 'mono').
     */
    uniqueColors: (state) => {
        const seen = new Set();
        const result = [];
        for (const entry of state.allColors) {
            if (!seen.has(entry.hex)) {
                seen.add(entry.hex);
                result.push(entry);
            }
        }
        return result;
    },
};

export default getters;
