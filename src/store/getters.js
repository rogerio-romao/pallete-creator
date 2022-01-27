const getters = {
  // used for the mini slots panel
  uniqueColors: state => new Set(state.allColors.hsl),
  // used to display the utility buttons
  fullSchemeSet: state =>
    Object.values(state.slotColors).every(color => color.hsl !== ''),
  // used for the export css and save palette modals
  currentScheme: state => {
    return [
      {
        hsl: state.textColor.hsl,
        rgb: state.textColor.rgb,
        hex: state.textColor.hex
      },
      {
        hsl: state.mainHSL,
        rgb: state.mainSlotColor.rgb,
        hex: state.mainSlotColor.hex
      },
      {
        hsl: state.slotColors.slot2.hsl,
        rgb: state.slotColors.slot2.rgb,
        hex: state.slotColors.slot2.hex
      },
      {
        hsl: state.slotColors.slot3.hsl,
        rgb: state.slotColors.slot3.rgb,
        hex: state.slotColors.slot3.hex
      },
      {
        hsl: state.slotColors.slot4.hsl,
        rgb: state.slotColors.slot4.rgb,
        hex: state.slotColors.slot4.hex
      },
      {
        hsl: state.slotColors.slot5.hsl,
        rgb: state.slotColors.slot5.rgb,
        hex: state.slotColors.slot5.hex
      }
    ]
  }
}

export default getters
