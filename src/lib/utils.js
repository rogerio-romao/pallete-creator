// oxlint-disable max-lines
// oxlint-disable no-magic-numbers

// Generate random HSL color

const MAX_HUE = 360;
const MAX_SATURATION = 100;
const MAX_LIGHTNESS = 100;
const MAX_RGB_VALUE = 255;
const HEX_RADIX = 16;

/**
 * Helper function for converting hue to RGB values, used in the HSL to RGB conversion process.
 * @param {number} p - The first parameter for the hue to RGB conversion, representing a temporary value based on lightness and saturation.
 * @param {number} q - The second parameter for the hue to RGB conversion, representing a temporary value based on lightness and saturation.
 * @param {number} t - The hue value adjusted for the specific RGB channel being calculated (red, green, or blue).
 * @returns {number} The calculated RGB value for the specific channel, normalized to the range [0, 1].
 */
const hue2rgb = (p, q, t) => {
    if (t < 0) {
        // oxlint-disable-next-line no-param-reassign
        t += 1;
    }
    if (t > 1) {
        // oxlint-disable-next-line no-param-reassign
        t -= 1;
    }
    if (t < 1 / 6) {
        return p + (q - p) * 6 * t;
    }
    if (t < 1 / 2) {
        return q;
    }
    if (t < 2 / 3) {
        return p + (q - p) * (2 / 3 - t) * 6;
    }
    return p;
};

/**
 * Generates an HSL color string from the provided hue, saturation, and luminosity values.
 * @param {number} h - the hue value
 * @param {number} s - the saturation value
 * @param {number} l - the luminosity value
 * @returns {string} the HSL color string in the format "hsl(h, s%, l%)"
 */
export const toHslString = (h, s, l) => `hsl(${h}, ${s}%, ${l}%)`;

export const generateHsl = () => {
    const h = Math.floor(Math.random() * MAX_HUE);
    const s = Math.floor(Math.random() * MAX_SATURATION);
    const l = Math.floor(Math.random() * MAX_LIGHTNESS);
    return toHslString(h, s, l);
};

/**
 * Converts an HSL color string to an RGB color string.
 * @param {string} hsl - The HSL color string (e.g., "hsl(120, 50%, 50%)").
 * @returns {string} The RGB color string (e.g., "rgb(64, 191, 64)").
 */
// oxlint-disable-next-line max-statements
export const hslToRgb = (hsl) => {
    let [h, s, l] = hsl.match(/\d+/g)?.map(Number) ?? [];
    if (h === undefined || s === undefined || l === undefined) {
        return 'rgb(0, 0, 0)';
    }
    h /= MAX_HUE;
    s /= MAX_SATURATION;
    l /= MAX_LIGHTNESS;
    let r;
    let g;
    let b;
    if (s === 0) {
        // oxlint-disable-next-line no-multi-assign
        r = g = b = l;
    } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return `rgb(${Math.round(r * MAX_RGB_VALUE)}, ${Math.round(g * MAX_RGB_VALUE)}, ${Math.round(
        b * MAX_RGB_VALUE,
    )})`;
};

/**
 * Converts an RGB color string to an HSL color string.
 * @param {string} rgb - The RGB color string (e.g., "rgb(64, 191, 64)").
 * @returns {string} The HSL color string (e.g., "hsl(120, 50%, 50%)").
 */
// oxlint-disable-next-line max-statements
export const rgbToHsl = (rgb) => {
    let [r, g, b] = rgb.match(/\d+/g)?.map(Number) ?? [];
    if (r === undefined || g === undefined || b === undefined) {
        return 'hsl(0, 0%, 0%)';
    }
    r /= MAX_RGB_VALUE;
    g /= MAX_RGB_VALUE;
    b /= MAX_RGB_VALUE;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h;
    let s;
    const l = (max + min) / 2;
    if (max === min) {
        h = 0;
        s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: {
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            }
            case g: {
                h = (b - r) / d + 2;
                break;
            }
            case b: {
                h = (r - g) / d + 4;
                break;
            }
            default: {
                break;
            }
        }
        h ??= 0;
        h /= 6;
    }
    return `hsl(${Math.round(h * MAX_HUE)}, ${Math.round(s * MAX_SATURATION)}%, ${Math.round(
        l * MAX_LIGHTNESS,
    )}%)`;
};

/**
 * Converts an RGB color string to a HEX color string.
 * @param {string} rgb - The RGB color string (e.g., "rgb(64, 191, 64)").
 * @returns {string} The HEX color string (e.g., "#40bf40").
 */
export const rgbToHex = (rgb) => {
    const [r, g, b] = rgb.match(/\d+/g)?.map(Number) ?? [];
    if (r === undefined || g === undefined || b === undefined) {
        return '#000000';
    }
    const hex = [
        r.toString(HEX_RADIX),
        g.toString(HEX_RADIX),
        b.toString(HEX_RADIX),
    ];
    for (const [index, color] of hex.entries()) {
        if (color.length === 1) {
            hex[index] = `0${color}`;
        }
    }
    return `#${hex.join('')}`;
};

/**
 * Converts a HEX color string to an HSL color string.
 * @param {string} hex - The HEX color string (e.g., "40bf40" or "#40bf40").
 * @returns {string} The HSL color string (e.g., "hsl(120, 50%, 50%)").
 */
export const hexToHsl = (hex) => {
    const r = Number.parseInt(hex.slice(0, 2), 16);
    const g = Number.parseInt(hex.slice(2, 4), 16);
    const b = Number.parseInt(hex.slice(4, 6), 16);
    const hsl = rgbToHsl(`rgb(${r},${g},${b})`);
    return hsl;
};

/**
 * Generates an array of complementary HSL color strings based on the input HSL color.
 * @param {string} hsl - The base HSL color string (e.g., "hsl(120, 50%, 50%)").
 * @returns {string[]} An array of complementary HSL color strings.
 */
export const generateComplement = (hsl) => {
    const [h, s, l] = hsl.match(/\d+/g)?.map(Number) ?? [];
    if (h === undefined || s === undefined || l === undefined) {
        return [];
    }
    const h2 = (h + 180) % MAX_HUE;
    const h3 = Math.abs((h - 150) % MAX_HUE);
    const h4 = (h + 150) % MAX_HUE;
    const l2 = (l - 30 + MAX_LIGHTNESS) % MAX_LIGHTNESS;
    return [
        toHslString(h2, s, l),
        toHslString(h, s, l2),
        toHslString(h, 50, 90),
        toHslString(h2, s, l2),
        toHslString(h2, 50, 90),
        toHslString(h3, s, l),
        toHslString(h4, s, l),
    ];
};

/**
 * Generates an array of monochromatic HSL color strings based on the input HSL color.
 * @param {string} hsl - The base HSL color string (e.g., "hsl(120, 50%, 50%)").
 * @returns {string[]} An array of monochromatic HSL color strings.
 */
export const generateMono = (hsl) => {
    const [h, s] = hsl.match(/\d+/g)?.map(Number) ?? [];
    if (h === undefined || s === undefined) {
        return [];
    }
    return [
        toHslString(h, s, 8),
        toHslString(h, s, 20),
        toHslString(h, s, 32),
        toHslString(h, s, 45),
        toHslString(h, s, 58),
        toHslString(h, s, 72),
        toHslString(h, s, 85),
        toHslString(h, s, 95),
    ];
};

/**
 * Generates an array of triad HSL color strings based on the input HSL color.
 * @param {string} hsl - The base HSL color string (e.g., "hsl(120, 50%, 50%)").
 * @returns {string[]} An array of triad HSL color strings.
 */
export const generateTriad = (hsl) => {
    const [h, s, l] = hsl.match(/\d+/g)?.map(Number) ?? [];
    if (h === undefined || s === undefined || l === undefined) {
        return [];
    }
    const h2 = (h + 120) % MAX_HUE;
    const h3 = (h + 240) % MAX_HUE;
    /**
     * Clamps a value between 0 and MAX_LIGHTNESS.
     * @param {number} v - The value to clamp
     * @returns {number} The clamped value
     */
    const clamp = (v) => Math.max(0, Math.min(MAX_LIGHTNESS, v));
    return [
        toHslString(h2, s, l),
        toHslString(h3, s, l),
        toHslString(h2, s, clamp(l - 20)),
        toHslString(h3, s, clamp(l - 20)),
        toHslString(h2, s, clamp(l + 20)),
        toHslString(h3, s, clamp(l + 20)),
    ];
};

/**
 * Generates an array of analogous HSL color strings based on the input HSL color.
 * @param {string} hsl - The base HSL color string (e.g., "hsl(120, 50%, 50%)").
 * @returns {string[]} An array of analogous HSL color strings.
 */
export const generateAnalogous = (hsl) => {
    const [h, s, l] = hsl.match(/\d+/g)?.map(Number) ?? [];
    if (h === undefined || s === undefined || l === undefined) {
        return [];
    }
    const h2 = Math.abs((h - 60) % MAX_HUE);
    const h3 = Math.abs((h - 30) % MAX_HUE);
    const h4 = (h + 30) % MAX_HUE;
    const h5 = (h + 60) % MAX_HUE;
    const h6 = Math.abs((h - 90) % MAX_HUE);
    const h7 = (h + 90) % MAX_HUE;

    return [
        toHslString(h2, s, l),
        toHslString(h3, s, l),
        toHslString(h4, s, l),
        toHslString(h5, s, l),
        toHslString(h6, s, l),
        toHslString(h7, s, l),
    ];
};

/**
 * Generates an array of HSL color strings with varying saturation based on the input HSL color.
 * @param {string} hsl - The base HSL color string (e.g., "hsl(120, 50%, 50%)").
 * @returns {string[]} An array of HSL color strings with different saturations.
 */
export const generateSaturations = (hsl) => {
    const [h, s, l] = hsl.match(/\d+/g)?.map(Number) ?? [];
    if (h === undefined || s === undefined || l === undefined) {
        return [];
    }
    const s2 = Math.abs((s - 10) % MAX_SATURATION);
    const s3 = (s + 10) % MAX_SATURATION;
    const s4 = Math.abs((s - 20) % MAX_SATURATION);
    const s5 = (s + 20) % MAX_SATURATION;
    const s6 = Math.abs((s - 30) % MAX_SATURATION);
    const s7 = (s + 30) % MAX_SATURATION;
    const s8 = Math.abs((s - 40) % MAX_SATURATION);
    const s9 = (s + 40) % MAX_SATURATION;
    return [
        toHslString(h, s2, l),
        toHslString(h, s3, l),
        toHslString(h, s4, l),
        toHslString(h, s5, l),
        toHslString(h, s6, l),
        toHslString(h, s7, l),
        toHslString(h, s8, l),
        toHslString(h, s9, l),
    ];
};
