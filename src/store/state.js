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
      main: '#435',
      complementary: '#e3ced7',
      light: '#f1f3f6',
      accent: '#1662a6',
      dark: '#50a5f2'
    }
  }
}
