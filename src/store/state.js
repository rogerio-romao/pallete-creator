import DEFAULT_HEX_COLORS from '../lib/colors';

// oxlint-disable-next-line max-lines-per-function
export default function state() {
    return {
        // holds all the generated variations, before filtering them to unique values in the getter
        allColors: {
            hex: [],
            hsl: [],
            rgb: [],
        },
        // if a variation is selected for copying, it is stored here
        copiedColor: '',
        // this is the index of the mini slot that is selected, for styling purposes
        copiedColorIndex: null,
        // the labels that appear over the color slots (editable)
        labels: ['Text', 'Main', 'Secondary', 'Accent', 'Light', 'Dark'],
        // used for showing main slot and setting its properties
        mainHSL: null,
        // used to display the textual values of the main slot
        mainSlotColor: {
            hex: '',
            hsl: '',
            rgb: '',
        },
        // holds all local storage saved color schemes
        savedPalettes: [],
        // used to display the textual values of the other slots
        slotColors: {
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
        },
        // default light text, changes when using the dark text button
        textColor: {
            hex: DEFAULT_HEX_COLORS.LIGHT_TEXT,
            hsl: 'hsl(38, 35%, 62%)',
            rgb: 'rgb(184, 168, 134)',
        },
    };
}
