import DEFAULT_HEX_COLORS from '../lib/colors';

/** @typedef {Object} ColorSlot
 *  @property {string} hex - the hex value of the color
 *  @property {string} hsl - the hsl value of the color
 *  @property {string} rgb - the rgb value of the color
 *  @property {string} type - the type of the color (main, complement, mono, triad, analogous, saturation)
 */

/** @typedef {Object} SavedPalette
 *  @property {string} id - the unique identifier of the saved palette
 *  @property {string} name - the name of the saved palette
 *  @property {ColorSlot[]} scheme - the colors in the saved palette
 *  @property {string} createdAt - the ISO date string of when the palette was created
 */

/**
 * Returns the initial state object for the Vuex store, including all color slots,
 * saved palettes, labels, and UI state for the palette creator application.
 *
 * @returns {{
 *   allColors: Array<{ hex: string, hsl: string, rgb: string, type: string }>,
 *   copiedColor: string,
 *   copiedColorIndex: number | null,
 *   isTestingColorScheme: boolean,
 *   labels: string[],
 *   mainHSL: string | null,
 *   mainSlotColor: ColorSlot,
 *   savedPalettes: SavedPalette[],
 *   theme: 'dark' | 'light',
 *   slotColors: { slot2: ColorSlot, slot3: ColorSlot, slot4: ColorSlot, slot5: ColorSlot },
 *   textColor: ColorSlot
 * }}
 *   The initial state object for the Vuex store.
 */
// oxlint-disable-next-line max-lines-per-function
export default function state() {
    return {
        // holds all the generated variations, before filtering them to unique values in the getter
        /** @type {Array<{ hex: string, hsl: string, rgb: string, type: 'complement' | 'mono' | 'triad' | 'analogous' | 'saturation' | 'main' }>} */
        allColors: [],
        // if a variation is selected for copying, it is stored here
        copiedColor: '',
        // this is the index of the mini slot that is selected, for styling purposes
        /** @type {number | null} */
        copiedColorIndex: null,
        // true while the user is testing a generated palette on the app chrome
        isTestingColorScheme: false,
        // the labels that appear over the color slots (editable)
        labels: ['Text', 'Main', 'Secondary', 'Accent', 'Light', 'Dark'],
        // used for showing main slot and setting its properties
        /** @type {string | null} */
        mainHSL: null,
        // used to display the textual values of the main slot
        mainSlotColor: {
            hex: '',
            hsl: '',
            rgb: '',
            type: 'main',
        },
        // holds all local storage saved color schemes
        /** @type {SavedPalette[]} */
        savedPalettes: [],
        // used to display the textual values of the other slots
        slotColors: {
            slot2: {
                hex: '',
                hsl: '',
                rgb: '',
                type: 'complement',
            },
            slot3: {
                hex: '',
                hsl: '',
                rgb: '',
                type: 'mono',
            },
            slot4: {
                hex: '',
                hsl: '',
                rgb: '',
                type: 'triad',
            },
            slot5: {
                hex: '',
                hsl: '',
                rgb: '',
                type: 'saturation',
            },
        },
        // default light text, changes when using the dark text button
        textColor: {
            hex: DEFAULT_HEX_COLORS.LIGHT_TEXT,
            hsl: 'hsl(240, 5%, 96%)',
            rgb: 'rgb(244, 244, 245)',
            type: 'text',
        },
        // persisted display theme ('dark' | 'light')
        theme: 'dark',
    };
}
