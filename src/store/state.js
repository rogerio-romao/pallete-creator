// oxlint-disable-next-line max-lines-per-function
export default function state() {
    return {
        // used for showing main slot and setting its properties
        mainHSL: null,
        // used to display the textual values of the main slot
        mainSlotColor: {
            hsl: '',
            rgb: '',
            hex: '',
        },
        // used to display the textual values of the other slots
        slotColors: {
            slot2: {
                hsl: '',
                rgb: '',
                hex: '',
            },
            slot3: {
                hsl: '',
                rgb: '',
                hex: '',
            },
            slot4: {
                hsl: '',
                rgb: '',
                hex: '',
            },
            slot5: {
                hsl: '',
                rgb: '',
                hex: '',
            },
        },
        // default light text, changes when using the dark text button
        textColor: {
            hsl: 'hsl(38, 35%, 62%)',
            rgb: 'rgb(184, 168, 134)',
            hex: '#b8a886',
        },
        // holds all the generated variations, before filtering them to unique values in the getter
        allColors: {
            hsl: [],
            rgb: [],
            hex: [],
        },
        // if a variation is selected for copying, it is stored here
        copiedColor: '',
        // this is the index of the mini slot that is selected, for styling purposes
        copiedColorIndex: null,
        // the labels that appear over the color slots (editable)
        labels: ['Text', 'Main', 'Secondary', 'Accent', 'Light', 'Dark'],
        // holds all local storage saved color schemes
        savedPalettes: [],
    };
}
