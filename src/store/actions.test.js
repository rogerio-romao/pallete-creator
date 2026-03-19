// oxlint-disable max-lines
// oxlint-disable no-magic-numbers
// oxlint-disable new-cap -- actions are in ALL_CAPS by convention, they are not constructors and should not be renamed

import actions from './actions';
import DEFAULT_HEX_COLORS from '../lib/colors';
import paletteService from '../services/paletteService';

vi.mock(import('../services/paletteService'), () => ({
    default: {
        delete: vi.fn(),
        getAll: vi.fn(),
        save: vi.fn(),
    },
}));

const mockService = vi.mocked(paletteService);

const makeCtx = (overrides = {}) =>
    /** @type {any} */ ({
        commit: vi.fn(),
        dispatch: vi.fn(),
        getters: { uniqueColors: new Set() },
        state: { copiedColor: '', mainHSL: null },
        ...overrides,
    });

// oxlint-disable-next-line max-lines-per-function
describe('store actions', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('COPY_COLOR', () => {
        it('commits SET_COPIED_COLOR and SET_COPIED_COLOR_INDEX', () => {
            const ctx = makeCtx();
            actions.COPY_COLOR(ctx, { color: 'hsl(0, 0%, 50%)', index: 3 });

            expect(ctx.commit).toHaveBeenCalledWith(
                'SET_COPIED_COLOR',
                'hsl(0, 0%, 50%)',
            );
            expect(ctx.commit).toHaveBeenCalledWith(
                'SET_COPIED_COLOR_INDEX',
                3,
            );
        });
    });

    describe('DELETE_PALETTE', () => {
        it('calls paletteService.delete and dispatches LOAD_PALETTES', () => {
            const ctx = makeCtx();
            actions.DELETE_PALETTE(ctx, 'abc123');

            expect(paletteService.delete).toHaveBeenCalledWith('abc123');
            expect(ctx.dispatch).toHaveBeenCalledWith('LOAD_PALETTES');
        });

        it('re-throws when paletteService.delete throws', () => {
            mockService.delete.mockImplementation(() => {
                throw new Error('delete failed');
            });

            const ctx = makeCtx();

            expect(() => actions.DELETE_PALETTE(ctx, 'abc123')).toThrow(
                'delete failed',
            );
        });
    });

    describe('GENERATE_VARIATIONS', () => {
        it('commits ADD_COLOR for each variation returned by fn', () => {
            const ctx = makeCtx();
            const fn = vi
                .fn()
                .mockReturnValue(['hsl(120, 50%, 50%)', 'hsl(240, 50%, 50%)']);

            actions.GENERATE_VARIATIONS(ctx, { color: 'hsl(0, 50%, 50%)', fn });

            expect(fn).toHaveBeenCalledWith('hsl(0, 50%, 50%)');
            expect(ctx.commit).toHaveBeenCalledTimes(2);
            expect(ctx.commit).toHaveBeenCalledWith(
                'ADD_COLOR',
                expect.objectContaining({ hsl: 'hsl(120, 50%, 50%)' }),
            );
            expect(ctx.commit).toHaveBeenCalledWith(
                'ADD_COLOR',
                expect.objectContaining({ hsl: 'hsl(240, 50%, 50%)' }),
            );
        });
    });

    describe('LOAD_PALETTES', () => {
        it('commits SET_SAVED_PALETTES with palettes from service', () => {
            const palettes = [
                { createdAt: '', id: '1', name: 'Test', scheme: [] },
            ];
            mockService.getAll.mockReturnValue(palettes);

            const ctx = makeCtx();
            actions.LOAD_PALETTES(ctx);

            expect(ctx.commit).toHaveBeenCalledWith(
                'SET_SAVED_PALETTES',
                palettes,
            );
        });

        it('commits empty array and re-throws when service throws', () => {
            mockService.getAll.mockImplementation(() => {
                throw new Error('load failed');
            });

            const ctx = makeCtx();

            expect(() => actions.LOAD_PALETTES(ctx)).toThrow('load failed');
            expect(ctx.commit).toHaveBeenCalledWith('SET_SAVED_PALETTES', []);
        });
    });

    describe('PASTE_COLOR', () => {
        it('does nothing when copiedColor is empty', () => {
            const ctx = makeCtx({ state: { copiedColor: '' } });
            actions.PASTE_COLOR(ctx, 2);

            expect(ctx.commit).not.toHaveBeenCalled();
            expect(ctx.dispatch).not.toHaveBeenCalled();
        });

        it('dispatches SET_MAIN_COLOR when slot is 1', () => {
            const ctx = makeCtx({
                state: { copiedColor: 'hsl(30, 50%, 50%)' },
            });
            actions.PASTE_COLOR(ctx, 1);

            expect(ctx.dispatch).toHaveBeenCalledWith(
                'SET_MAIN_COLOR',
                'hsl(30, 50%, 50%)',
            );
            expect(ctx.commit).not.toHaveBeenCalled();
        });

        it('commits SET_SLOT_COLOR when slot is not 1', () => {
            const ctx = makeCtx({
                state: { copiedColor: 'hsl(30, 50%, 50%)' },
            });
            actions.PASTE_COLOR(ctx, 3);

            expect(ctx.commit).toHaveBeenCalledWith(
                'SET_SLOT_COLOR',
                expect.objectContaining({
                    hsl: 'hsl(30, 50%, 50%)',
                    slot: 'slot3',
                }),
            );
        });
    });

    describe('SAVE_PALETTE', () => {
        it('calls paletteService.save and dispatches LOAD_PALETTES', () => {
            const ctx = makeCtx();
            const scheme = [
                { hex: '#fff', hsl: 'hsl(0,0%,100%)', rgb: 'rgb(255,255,255)' },
            ];
            actions.SAVE_PALETTE(ctx, { name: 'My Palette', scheme });

            expect(paletteService.save).toHaveBeenCalledWith({
                name: 'My Palette',
                scheme,
            });
            expect(ctx.dispatch).toHaveBeenCalledWith('LOAD_PALETTES');
        });

        it('re-throws when paletteService.save throws', () => {
            mockService.save.mockImplementation(() => {
                throw new Error('save failed');
            });

            const ctx = makeCtx();

            expect(() =>
                actions.SAVE_PALETTE(ctx, { name: 'My Palette', scheme: [] }),
            ).toThrow('save failed');
        });
    });

    describe('SET_MAIN_COLOR', () => {
        it('commits SET_MAIN_COLOR and RESET_ALL_COLORS with derived values', () => {
            const ctx = makeCtx();
            actions.SET_MAIN_COLOR(ctx, 'hsl(0, 100%, 50%)');

            expect(ctx.commit).toHaveBeenCalledWith(
                'SET_MAIN_COLOR',
                expect.objectContaining({ hsl: 'hsl(0, 100%, 50%)' }),
            );
            expect(ctx.commit).toHaveBeenCalledWith(
                'RESET_ALL_COLORS',
                expect.objectContaining({ hsl: 'hsl(0, 100%, 50%)' }),
            );
        });

        it('dispatches GENERATE_VARIATIONS 5 times', () => {
            const ctx = makeCtx();
            actions.SET_MAIN_COLOR(ctx, 'hsl(0, 100%, 50%)');

            const calls = ctx.dispatch.mock.calls.filter(
                (/** @type {[string]} */ [type]) =>
                    type === 'GENERATE_VARIATIONS',
            );

            expect(calls).toHaveLength(5);
        });

        it('generates a random color when null is passed', () => {
            const ctx = makeCtx();
            actions.SET_MAIN_COLOR(ctx, null);

            expect(ctx.commit).toHaveBeenCalledWith(
                'SET_MAIN_COLOR',
                expect.objectContaining({
                    hex: expect.any(String),
                    hsl: expect.any(String),
                    rgb: expect.any(String),
                }),
            );
        });
    });

    describe('SET_PALETTE_FROM_SAVED', () => {
        it('does nothing when first slot has no hsl', () => {
            const ctx = makeCtx();
            actions.SET_PALETTE_FROM_SAVED(ctx, [
                { hex: '#fff', hsl: '', rgb: '' },
            ]);

            expect(ctx.dispatch).not.toHaveBeenCalled();
        });

        it('dispatches SET_MAIN_COLOR for the first slot', () => {
            const ctx = makeCtx();
            actions.SET_PALETTE_FROM_SAVED(ctx, [
                { hex: '#f00', hsl: 'hsl(0, 100%, 50%)', rgb: 'rgb(255,0,0)' },
            ]);

            expect(ctx.dispatch).toHaveBeenCalledWith(
                'SET_MAIN_COLOR',
                'hsl(0, 100%, 50%)',
            );
        });

        it('dispatches UPDATE_SLOT_COLOR for each additional slot', () => {
            const ctx = makeCtx();
            actions.SET_PALETTE_FROM_SAVED(ctx, [
                { hex: '#f00', hsl: 'hsl(0, 100%, 50%)', rgb: 'rgb(255,0,0)' },
                {
                    hex: '#0f0',
                    hsl: 'hsl(120, 100%, 50%)',
                    rgb: 'rgb(0,255,0)',
                },
                {
                    hex: '#00f',
                    hsl: 'hsl(240, 100%, 50%)',
                    rgb: 'rgb(0,0,255)',
                },
            ]);

            expect(ctx.dispatch).toHaveBeenCalledWith('UPDATE_SLOT_COLOR', {
                hsl: 'hsl(120, 100%, 50%)',
                slot: 2,
            });
            expect(ctx.dispatch).toHaveBeenCalledWith('UPDATE_SLOT_COLOR', {
                hsl: 'hsl(240, 100%, 50%)',
                slot: 3,
            });
        });
    });

    describe('SET_RANDOM_SCHEME', () => {
        it('does nothing when uniqueColors is empty', () => {
            const ctx = makeCtx({
                getters: { uniqueColors: new Set() },
                state: { mainHSL: null },
            });
            actions.SET_RANDOM_SCHEME(ctx);

            expect(ctx.commit).not.toHaveBeenCalled();
        });

        it('commits SET_SLOT_COLOR for 4 slots when enough colors exist', () => {
            const colors = new Set([
                'hsl(0, 50%, 50%)',
                'hsl(60, 50%, 50%)',
                'hsl(120, 50%, 50%)',
                'hsl(180, 50%, 50%)',
                'hsl(240, 50%, 50%)',
            ]);
            const ctx = makeCtx({
                getters: { uniqueColors: colors },
                state: { mainHSL: null },
            });
            actions.SET_RANDOM_SCHEME(ctx);

            const calls = ctx.commit.mock.calls.filter(
                (/** @type {[string]} */ [type]) => type === 'SET_SLOT_COLOR',
            );

            expect(calls).toHaveLength(4);
            for (let i = 0; i < calls.length; i++) {
                const [, payload] = /** @type {[string, any]} */ (calls[i]);
                expect(payload.slot).toBe(`slot${i + 2}`);
            }
        });
    });

    describe('SET_TEXT_COLOR', () => {
        it('commits light text color values for "light"', () => {
            const ctx = makeCtx();
            actions.SET_TEXT_COLOR(ctx, 'light');

            expect(ctx.commit).toHaveBeenCalledWith('SET_TEXT_COLOR', {
                hex: DEFAULT_HEX_COLORS.LIGHT_TEXT,
                hsl: 'hsl(38, 35%, 62%)',
                rgb: 'rgb(184, 168, 134)',
            });
        });

        it('commits dark text color values for "dark"', () => {
            const ctx = makeCtx();
            actions.SET_TEXT_COLOR(ctx, 'dark');

            expect(ctx.commit).toHaveBeenCalledWith('SET_TEXT_COLOR', {
                hex: DEFAULT_HEX_COLORS.DARK_TEXT,
                hsl: 'hsl(218, 27%, 8%)',
                rgb: 'rgb(15, 19, 26)',
            });
        });

        it('does not commit for unknown type', () => {
            const ctx = makeCtx();
            // @ts-expect-error -- testing unknown type
            actions.SET_TEXT_COLOR(ctx, 'unknown');

            expect(ctx.commit).not.toHaveBeenCalled();
        });
    });

    describe('UPDATE_LABEL', () => {
        it('does nothing for an empty string', () => {
            const ctx = makeCtx();
            actions.UPDATE_LABEL(ctx, { label: '', slotNumber: 2 });

            expect(ctx.commit).not.toHaveBeenCalled();
        });

        it('does nothing for a whitespace-only string', () => {
            const ctx = makeCtx();
            actions.UPDATE_LABEL(ctx, { label: '   ', slotNumber: 2 });

            expect(ctx.commit).not.toHaveBeenCalled();
        });

        it('commits SET_LABEL with first character capitalised', () => {
            const ctx = makeCtx();
            actions.UPDATE_LABEL(ctx, { label: 'accent', slotNumber: 3 });

            expect(ctx.commit).toHaveBeenCalledWith('SET_LABEL', {
                label: 'Accent',
                slotNumber: 3,
            });
        });

        it('preserves casing after the first character', () => {
            const ctx = makeCtx();
            actions.UPDATE_LABEL(ctx, { label: 'myLabel', slotNumber: 1 });

            expect(ctx.commit).toHaveBeenCalledWith('SET_LABEL', {
                label: 'MyLabel',
                slotNumber: 1,
            });
        });
    });

    describe('UPDATE_SLOT_COLOR', () => {
        it('commits SET_SLOT_COLOR with hex and rgb derived from hsl', () => {
            const ctx = makeCtx();
            actions.UPDATE_SLOT_COLOR(ctx, {
                hsl: 'hsl(0, 100%, 50%)',
                slot: 4,
            });

            expect(ctx.commit).toHaveBeenCalledWith(
                'SET_SLOT_COLOR',
                expect.objectContaining({
                    hex: expect.any(String),
                    hsl: 'hsl(0, 100%, 50%)',
                    rgb: expect.any(String),
                    slot: 'slot4',
                }),
            );
        });
    });
});
