// oxlint-disable max-lines
// oxlint-disable no-magic-numbers

import {
    generateAnalogous,
    generateComplement,
    generateHsl,
    generateMono,
    generateSaturations,
    generateTriad,
    getSaturation,
    hexToHsl,
    hslToRgb,
    isAchromatic,
    isLowSaturation,
    rgbToHex,
    rgbToHsl,
    toHslString,
} from './utils';

// oxlint-disable-next-line max-lines-per-function
describe('utility functions', () => {
    describe('toHslString utility', () => {
        it('formats h,s,l into hsl string', () => {
            expect(toHslString(180, 50, 50)).toBe('hsl(180, 50%, 50%)');
            expect(toHslString(0, 0, 100)).toBe('hsl(0, 0%, 100%)');
            expect(toHslString(360, 100, 0)).toBe('hsl(360, 100%, 0%)');
        });
    });

    describe('generateHsl utility', () => {
        it('returns a valid hsl string', () => {
            expect(generateHsl()).toMatch(/^hsl\(\d+, \d+%, \d+%\)$/);
        });
    });

    describe('hslToRgb utility', () => {
        it('converts hsl to rgb', () => {
            expect(hslToRgb('hsl(0, 0%, 0%)')).toBe('rgb(0, 0, 0)');
            expect(hslToRgb('hsl(0, 0%, 100%)')).toBe('rgb(255, 255, 255)');
            expect(hslToRgb('hsl(0, 100%, 50%)')).toBe('rgb(255, 0, 0)');
            expect(hslToRgb('hsl(120, 100%, 50%)')).toBe('rgb(0, 255, 0)');
            expect(hslToRgb('hsl(240, 100%, 50%)')).toBe('rgb(0, 0, 255)');
        });

        it('handles hue > 240 (triggers t > 1 in hue2rgb)', () => {
            expect(hslToRgb('hsl(300, 100%, 50%)')).toBe('rgb(255, 0, 255)');
        });

        it('returns black for invalid input', () => {
            expect(hslToRgb('invalid')).toBe('rgb(0, 0, 0)');
        });
    });

    describe('rgbToHsl utility', () => {
        it('converts rgb to hsl', () => {
            expect(rgbToHsl('rgb(0, 0, 0)')).toBe('hsl(0, 0%, 0%)');
            expect(rgbToHsl('rgb(255, 255, 255)')).toBe('hsl(0, 0%, 100%)');
            expect(rgbToHsl('rgb(255, 0, 0)')).toBe('hsl(0, 100%, 50%)');
            expect(rgbToHsl('rgb(0, 255, 0)')).toBe('hsl(120, 100%, 50%)');
            expect(rgbToHsl('rgb(0, 0, 255)')).toBe('hsl(240, 100%, 50%)');
        });

        it('handles high-lightness colors (l > 0.5 saturation branch)', () => {
            expect(rgbToHsl('rgb(255, 128, 128)')).toBe('hsl(0, 100%, 75%)');
        });

        it('returns black for invalid input', () => {
            expect(rgbToHsl('invalid')).toBe('hsl(0, 0%, 0%)');
        });
    });

    describe('rgbToHex utility', () => {
        it('converts rgb to hex', () => {
            expect(rgbToHex('rgb(0, 0, 0)')).toBe('#000000');
            expect(rgbToHex('rgb(255, 255, 255)')).toBe('#ffffff');
            expect(rgbToHex('rgb(255, 0, 0)')).toBe('#ff0000');
            expect(rgbToHex('rgb(0, 255, 0)')).toBe('#00ff00');
            expect(rgbToHex('rgb(0, 0, 255)')).toBe('#0000ff');
        });

        it('returns black for invalid input', () => {
            expect(rgbToHex('invalid')).toBe('#000000');
        });
    });

    describe('hexToHsl utility', () => {
        it('converts hex to hsl', () => {
            expect(hexToHsl('000000')).toBe('hsl(0, 0%, 0%)');
            expect(hexToHsl('ffffff')).toBe('hsl(0, 0%, 100%)');
            expect(hexToHsl('ff0000')).toBe('hsl(0, 100%, 50%)');
            expect(hexToHsl('00ff00')).toBe('hsl(120, 100%, 50%)');
            expect(hexToHsl('0000ff')).toBe('hsl(240, 100%, 50%)');
        });
    });

    describe('generateComplement utility', () => {
        it('returns array of 7 colors', () => {
            expect(generateComplement('hsl(180, 50%, 50%)')).toHaveLength(7);
        });

        it('generates complementary hue (180 degrees)', () => {
            const result = generateComplement('hsl(0, 50%, 50%)');

            expect(result[0]).toBe('hsl(180, 50%, 50%)');
        });

        it('returns empty array for invalid input', () => {
            expect(generateComplement('invalid')).toEqual([]);
        });
    });

    describe('generateMono utility', () => {
        it('returns array of 8 colors', () => {
            expect(generateMono('hsl(180, 50%, 50%)')).toHaveLength(8);
        });

        it('varies lightness while keeping hue constant', () => {
            const result = generateMono('hsl(180, 50%, 50%)');

            expect(result[0]).toBe('hsl(180, 50%, 8%)');
            expect(result[7]).toBe('hsl(180, 50%, 95%)');
        });

        it('returns empty array for invalid input', () => {
            expect(generateMono('invalid')).toEqual([]);
        });
    });

    describe('generateTriad utility', () => {
        it('returns array of 6 colors', () => {
            expect(generateTriad('hsl(180, 50%, 50%)')).toHaveLength(6);
        });

        it('generates triadic hues (120 degrees apart)', () => {
            const result = generateTriad('hsl(0, 50%, 50%)');

            expect(result[0]).toBe('hsl(120, 50%, 50%)');
            expect(result[1]).toBe('hsl(240, 50%, 50%)');
        });

        it('clamps lightness below 0 when l - 20 < 0', () => {
            const result = generateTriad('hsl(0, 50%, 10%)');

            expect(result[2]).toBe('hsl(120, 50%, 0%)');
            expect(result[3]).toBe('hsl(240, 50%, 0%)');
        });

        it('clamps lightness above 100 when l + 20 > 100', () => {
            const result = generateTriad('hsl(0, 50%, 90%)');

            expect(result[4]).toBe('hsl(120, 50%, 100%)');
            expect(result[5]).toBe('hsl(240, 50%, 100%)');
        });

        it('returns empty array for invalid input', () => {
            expect(generateTriad('invalid')).toEqual([]);
        });
    });

    describe('generateAnalogous utility', () => {
        it('returns array of 6 colors', () => {
            expect(generateAnalogous('hsl(180, 50%, 50%)')).toHaveLength(6);
        });

        it('generates analogous hues (30 degree steps)', () => {
            const result = generateAnalogous('hsl(180, 50%, 50%)');

            expect(result[0]).toBe('hsl(120, 50%, 50%)');
            expect(result[2]).toBe('hsl(210, 50%, 50%)');
        });

        it('returns empty array for invalid input', () => {
            expect(generateAnalogous('invalid')).toEqual([]);
        });
    });

    describe('generateSaturations utility', () => {
        it('returns array of 8 colors', () => {
            expect(generateSaturations('hsl(180, 50%, 50%)')).toHaveLength(8);
        });

        it('varies saturation while keeping hue and lightness constant', () => {
            const result = generateSaturations('hsl(180, 50%, 50%)');

            for (const color of result) {
                expect(color).toMatch(/^hsl\(180, \d+%, 50%\)$/);
            }
        });

        it('returns empty array for invalid input', () => {
            expect(generateSaturations('invalid')).toEqual([]);
        });
    });

    describe('isLowSaturation utility', () => {
        it('returns true for s=0', () => {
            expect(isLowSaturation(0)).toBeTruthy();
        });

        it('returns true at the threshold s=10', () => {
            expect(isLowSaturation(10)).toBeTruthy();
        });

        it('returns false just above the threshold s=11', () => {
            expect(isLowSaturation(11)).toBeFalsy();
        });

        it('returns false for s=50', () => {
            expect(isLowSaturation(50)).toBeFalsy();
        });
    });

    describe('isAchromatic utility', () => {
        it('returns true for pure black (s=0, l=0)', () => {
            expect(isAchromatic(0, 0)).toBeTruthy();
        });

        it('returns true for pure white (s=0, l=100)', () => {
            expect(isAchromatic(0, 100)).toBeTruthy();
        });

        it('returns true at the dark threshold boundary (s=5, l=8)', () => {
            expect(isAchromatic(5, 8)).toBeTruthy();
        });

        it('returns true at the light threshold boundary (s=5, l=95)', () => {
            expect(isAchromatic(5, 95)).toBeTruthy();
        });

        it('returns false when lightness is mid-range even at s=0', () => {
            expect(isAchromatic(0, 50)).toBeFalsy();
        });

        it('returns false when saturation is above threshold', () => {
            expect(isAchromatic(15, 0)).toBeFalsy();
        });
    });

    // oxlint-disable-next-line max-lines-per-function
    describe('achromatic variation generation', () => {
        const BLACK = 'hsl(0, 0%, 0%)';
        const WHITE = 'hsl(0, 0%, 100%)';
        const HSL_PATTERN = /^hsl\(\d+, \d+%, \d+%\)$/;

        it('generateComplement returns 7 chromatic colors for black', () => {
            const result = generateComplement(BLACK);
            expect(result).toHaveLength(7);
            for (const color of result) {
                expect(color).toMatch(HSL_PATTERN);
                expect(getSaturation(color)).toBeGreaterThan(0);
            }
        });

        it('generateComplement returns 7 chromatic colors for white', () => {
            const result = generateComplement(WHITE);
            expect(result).toHaveLength(7);
            for (const color of result) {
                expect(getSaturation(color)).toBeGreaterThan(0);
            }
        });

        it('generateComplement produces different results on repeated calls', () => {
            const results = new Set(
                Array.from({ length: 10 }, () => generateComplement(BLACK)[0]),
            );
            expect(results.size).toBeGreaterThan(1);
        });

        it('generateTriad returns 6 chromatic colors for black', () => {
            const result = generateTriad(BLACK);
            expect(result).toHaveLength(6);
            for (const color of result) {
                expect(color).toMatch(HSL_PATTERN);
                expect(getSaturation(color)).toBeGreaterThan(0);
            }
        });

        it('generateTriad produces different results on repeated calls', () => {
            const results = new Set(
                Array.from({ length: 10 }, () => generateTriad(BLACK)[0]),
            );
            expect(results.size).toBeGreaterThan(1);
        });

        it('generateAnalogous returns 6 chromatic colors for black', () => {
            const result = generateAnalogous(BLACK);
            expect(result).toHaveLength(6);
            for (const color of result) {
                expect(color).toMatch(HSL_PATTERN);
                expect(getSaturation(color)).toBeGreaterThan(0);
            }
        });

        it('generateAnalogous produces different results on repeated calls', () => {
            const results = new Set(
                Array.from({ length: 10 }, () => generateAnalogous(BLACK)[0]),
            );
            expect(results.size).toBeGreaterThan(1);
        });

        it('generateSaturations returns 8 chromatic colors for black', () => {
            const result = generateSaturations(BLACK);
            expect(result).toHaveLength(8);
            for (const color of result) {
                expect(color).toMatch(HSL_PATTERN);
                expect(getSaturation(color)).toBeGreaterThan(0);
            }
        });

        it('generateSaturations uses normal behavior for mid-lightness low-sat gray', () => {
            const result = generateSaturations('hsl(0, 0%, 50%)');
            expect(result).toHaveLength(8);
            for (const color of result) {
                expect(color).toMatch(/^hsl\(0, \d+%, 50%\)$/);
            }
        });

        it('generateSaturations produces different results on repeated calls for black', () => {
            const results = new Set(
                Array.from({ length: 10 }, () => generateSaturations(BLACK)[0]),
            );
            expect(results.size).toBeGreaterThan(1);
        });
    });
});
