![palette creator logo](src/assets/logo.png)

# Palette Creator

A color palette tool for designers and developers. Pick a base color, explore variations built on color theory, fine-tune each slot, preview the result live on the UI, and export it as CSS variables — all in one place.

**[palette-creator.surge.sh](https://palette-creator.surge.sh/)**

---

## How to use it

### Start with a color

A random palette is generated when the app loads. From there you have a few options:

- **One Shot** — generates a random color, builds a full scheme, and applies it to the UI in one click. Great for quick inspiration.
- **Random** button — picks a random base color and regenerates all palette slots from it.
- **Inputs** — enter a specific color in HEX, RGB, or HSL. All three are always in sync, so you can work in whichever format you prefer. There's also a color wheel picker.

Setting a new main color resets everything and recalculates the palette from scratch.

### Build your palette

Once you have a base color, the **Variations** panel shows a range of related colors — complementary, analogous, triadic, tints, shades, and more.

- Click a variation to copy it, then click any palette slot to paste it.
- Click a selected variation again to deselect it.
- Hit **Random Variations** to randomize all five slots at once.

### Fine-tune

Each palette slot has its own H / S / L sliders for precise adjustments. You can also:

- Click the format pill (HEX / HSL / RGB) below a slot to cycle through display formats.
- Click a slot's label to rename it — useful when you're building a design system.

### Preview

- **Test this palette** — applies your palette to the app itself so you can see how the colors work in a real UI context.
- **Reset site colors** — brings the app back to its default look.
- **Light Text / Dark Text** — sets the text color for your scheme so you can check readability.
- The sun / moon icon in the nav switches the app between its own light and dark mode, independently of your palette.

### Export and save

- **Export CSS** — copies your palette as CSS custom properties, ready to paste into your project.
- **Save Palette** — stores the palette in your browser's local storage. No account needed. Saved palettes appear below the main panel and can be reloaded or deleted at any time.

---

## Run locally

```bash
pnpm install
pnpm dev
```
