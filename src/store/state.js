export default function state() {
  return {
    // used for showing main slot and setting its properties
    mainHSL: null,
    // used to display the textual values of the main slot
    mainSlotColor: {
      hsl: '',
      rgb: '',
      hex: ''
    },
    // used to display the textual values of the other slots
    slotColors: {
      slot2: {
        hsl: '',
        rgb: '',
        hex: ''
      },
      slot3: {
        hsl: '',
        rgb: '',
        hex: ''
      },
      slot4: {
        hsl: '',
        rgb: '',
        hex: ''
      },
      slot5: {
        hsl: '',
        rgb: '',
        hex: ''
      }
    },
    // default light text, changes when using the dark text button
    textColor: {
      hsl: 'hsl(34, 78%, 91%)',
      rgb: 'rgb(250, 235, 215)',
      hex: '#faebd7'
    },
    // holds all the generated variations, before filtering them to unique values in the getter
    allColors: {
      hsl: [],
      rgb: [],
      hex: []
    },
    // if a variation is selected for copying, it is stored here
    copiedColor: '',
    // this is the index of the mini slot that is selected, for styling purposes
    copiedColorIndex: null,
    // the labels that appear over the color slots (editable)
    labels: ['Text', 'Main', 'Secondary', 'Accent', 'Light', 'Dark'],
    // holds all local storage saved color schemes
    savedPalettes: JSON.parse(localStorage.getItem('palettes')) || [],
    // holds the default site color scheme, changeable i the interface
    siteColors: {
      main: '#1d1702',
      complementary: '#f2edd9',
      light: '#d9def2',
      accent: '#087d65',
      dark: '#997d0a'
    },
    isUserSignedIn: false,
    userEmail: ''
  }
}
