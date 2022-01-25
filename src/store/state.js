export default function state() {
  return {
    mainHSL: null,
    mainSlotColor: {
      hsl: '',
      rgb: '',
      hex: ''
    },
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
    textColor: {
      hsl: 'hsl(34, 78%, 91%)',
      rgb: 'rgb(250, 235, 215)',
      hex: '#faebd7'
    },
    allColors: {
      hsl: [],
      rgb: [],
      hex: []
    },
    copiedColor: '',
    copiedColorIndex: null,
    labels: ['Text', 'Main', 'Secondary', 'Accent', 'Light', 'Dark'],
    savedPalettes: JSON.parse(localStorage.getItem('palettes')) || [],
    siteColors: {
      main: '#1d1702',
      complementary: '#f2edd9',
      light: '#d9def2',
      accent: '#087d65',
      dark: '#997d0a'
    }
  }
}
