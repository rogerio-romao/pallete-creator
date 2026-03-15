import { describe, expect, it } from 'vitest';
import {
    generateAnalogous,
    generateComplement,
    generateHsl,
    generateMono,
    generateSaturations,
    generateTriad,
    hexToHsl,
    hslToRgb,
    rgbToHex,
    rgbToHsl,
    toHslString,
} from './utils';

describe('toHslString', () => {
    it('formats h,s,l into hsl string', () => {
        expect(toHslString(180, 50, 50)).toBe('hsl(180, 50%, 50%)');
        expect(toHslString(0, 0, 100)).toBe('hsl(0, 0%, 100%)');
        expect(toHslString(360, 100, 0)).toBe('hsl(360, 100%, 0%)');
    });
});

describe('generateHsl', () => {
    it('returns a valid hsl string', () => {
        const result = generateHsl();
        expect(result).toMatch(/^hsl\(\d+, \d+%, \d+%\)$/);
    });
});

describe('hslToRgb', () => {
    it('converts hsl to rgb', () => {
        expect(hslToRgb('hsl(0, 0%, 0%)')).toBe('rgb(0, 0, 0)');
        expect(hslToRgb('hsl(0, 0%, 100%)')).toBe('rgb(255, 255, 255)');
        expect(hslToRgb('hsl(0, 100%, 50%)')).toBe('rgb(255, 0, 0)');
        expect(hslToRgb('hsl(120, 100%, 50%)')).toBe('rgb(0, 255, 0)');
        expect(hslToRgb('hsl(240, 100%, 50%)')).toBe('rgb(0, 0, 255)');
    });
});

describe('rgbToHsl', () => {
    it('converts rgb to hsl', () => {
        expect(rgbToHsl('rgb(0, 0, 0)')).toBe('hsl(0, 0%, 0%)');
        expect(rgbToHsl('rgb(255, 255, 255)')).toBe('hsl(0, 0%, 100%)');
        expect(rgbToHsl('rgb(255, 0, 0)')).toBe('hsl(0, 100%, 50%)');
        expect(rgbToHsl('rgb(0, 255, 0)')).toBe('hsl(120, 100%, 50%)');
        expect(rgbToHsl('rgb(0, 0, 255)')).toBe('hsl(240, 100%, 50%)');
    });
});

describe('rgbToHex', () => {
    it('converts rgb to hex', () => {
        expect(rgbToHex('rgb(0, 0, 0)')).toBe('#000000');
        expect(rgbToHex('rgb(255, 255, 255)')).toBe('#ffffff');
        expect(rgbToHex('rgb(255, 0, 0)')).toBe('#ff0000');
        expect(rgbToHex('rgb(0, 255, 0)')).toBe('#00ff00');
        expect(rgbToHex('rgb(0, 0, 255)')).toBe('#0000ff');
    });
});

describe('hexToHsl', () => {
    it('converts hex to hsl', () => {
        expect(hexToHsl('000000')).toBe('hsl(0, 0%, 0%)');
        expect(hexToHsl('ffffff')).toBe('hsl(0, 0%, 100%)');
        expect(hexToHsl('ff0000')).toBe('hsl(0, 100%, 50%)');
        expect(hexToHsl('00ff00')).toBe('hsl(120, 100%, 50%)');
        expect(hexToHsl('0000ff')).toBe('hsl(240, 100%, 50%)');
    });
});

describe('generateComplement', () => {
    it('returns array of 7 colors', () => {
        const result = generateComplement('hsl(180, 50%, 50%)');
        expect(result).toHaveLength(7);
    });

    it('generates complementary hue (180 degrees)', () => {
        const result = generateComplement('hsl(0, 50%, 50%)');
        expect(result[0]).toBe('hsl(180, 50%, 50%)');
    });
});

describe('generateMono', () => {
    it('returns array of 8 colors', () => {
        const result = generateMono('hsl(180, 50%, 50%)');
        expect(result).toHaveLength(8);
    });

    it('varies lightness while keeping hue constant', () => {
        const result = generateMono('hsl(180, 50%, 50%)');
        expect(result[0]).toBe('hsl(180, 50%, 8%)');
        expect(result[7]).toBe('hsl(180, 50%, 95%)');
    });
});

describe('generateTriad', () => {
    it('returns array of 6 colors', () => {
        const result = generateTriad('hsl(180, 50%, 50%)');
        expect(result).toHaveLength(6);
    });

    it('generates triadic hues (120 degrees apart)', () => {
        const result = generateTriad('hsl(0, 50%, 50%)');
        expect(result[0]).toBe('hsl(120, 50%, 50%)');
        expect(result[1]).toBe('hsl(240, 50%, 50%)');
    });
});

describe('generateAnalogous', () => {
    it('returns array of 6 colors', () => {
        const result = generateAnalogous('hsl(180, 50%, 50%)');
        expect(result).toHaveLength(6);
    });

    it('generates analogous hues (30 degree steps)', () => {
        const result = generateAnalogous('hsl(180, 50%, 50%)');
        expect(result[0]).toBe('hsl(120, 50%, 50%)');
        expect(result[2]).toBe('hsl(210, 50%, 50%)');
    });
});

describe('generateSaturations', () => {
    it('returns array of 8 colors', () => {
        const result = generateSaturations('hsl(180, 50%, 50%)');
        expect(result).toHaveLength(8);
    });

    it('varies saturation while keeping hue and lightness constant', () => {
        const result = generateSaturations('hsl(180, 50%, 50%)');
        for (const color of result) {
            expect(color).toMatch(/^hsl\(180, \d+%, 50%\)$/);
        }
    });
});
