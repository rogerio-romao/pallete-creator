import paletteService from './paletteService';

/** @typedef {import('../store/state.js').ColorSlot} ColorSlot */

/** @type {ColorSlot[]} */
const mockScheme = [
    { hex: 'ff0000', hsl: 'hsl(0, 100%, 50%)', rgb: 'rgb(255, 0, 0)', type: 'main' },
];

// oxlint-disable-next-line max-lines-per-function
describe('paletteService service', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    describe('getAll', () => {
        it('returns empty array when storage is empty', () => {
            expect(paletteService.getAll()).toEqual([]);
        });

        it('returns stored palettes', () => {
            const palettes = [
                { createdAt: '', id: '1', name: 'Test', scheme: mockScheme },
            ];
            localStorage.setItem('palettes', JSON.stringify(palettes));

            expect(paletteService.getAll()).toEqual(palettes);
        });

        it('returns empty array when stored value is invalid JSON', () => {
            localStorage.setItem('palettes', 'not-json');

            expect(paletteService.getAll()).toEqual([]);
        });
    });

    // oxlint-disable-next-line max-lines-per-function
    describe('save', () => {
        it('saves a palette and returns its id', () => {
            const id = paletteService.save({
                name: 'My Palette',
                scheme: mockScheme,
            });

            expectTypeOf(id).toBeString();
            expect(id).not.toBe('');
        });

        it('persists the palette in localStorage', () => {
            paletteService.save({ name: 'My Palette', scheme: mockScheme });

            const [palette] = paletteService.getAll();

            expect(palette).toBeDefined();
            expect(palette?.name).toBe('My Palette');
            expect(palette?.scheme).toEqual(mockScheme);
        });

        it('accumulates multiple saved palettes', () => {
            paletteService.save({ name: 'First', scheme: mockScheme });
            paletteService.save({ name: 'Second', scheme: mockScheme });

            // oxlint-disable-next-line no-magic-numbers
            expect(paletteService.getAll()).toHaveLength(2);
        });

        it('sets createdAt as an ISO date string', () => {
            paletteService.save({ name: 'My Palette', scheme: mockScheme });

            const [palette] = paletteService.getAll();

            expect(palette).toBeDefined();
            expect(() => new Date(palette?.createdAt ?? '')).not.toThrow();
            expect(new Date(palette?.createdAt ?? '').toISOString()).toBe(
                palette?.createdAt,
            );
        });

        it('throws when name is missing', () => {
            expect(() =>
                // @ts-expect-error
                paletteService.save({ scheme: mockScheme }),
            ).toThrow('Palette name is required.');
        });

        it('throws when scheme is missing', () => {
            // @ts-expect-error
            expect(() => paletteService.save({ name: 'My Palette' })).toThrow(
                'Palette scheme is required.',
            );
        });
    });

    describe('delete', () => {
        it('removes the palette with the given id', () => {
            vi.useFakeTimers();
            const id = paletteService.save({
                name: 'To Delete',
                scheme: mockScheme,
            });
            vi.advanceTimersByTime(1);
            paletteService.save({ name: 'To Keep', scheme: mockScheme });
            vi.useRealTimers();

            paletteService.delete(id);

            const [remaining] = paletteService.getAll();
            expect(remaining).toBeDefined();
            expect(remaining?.name).toBe('To Keep');
        });

        it('does nothing when id does not exist', () => {
            paletteService.save({ name: 'Existing', scheme: mockScheme });

            paletteService.delete('nonexistent-id');

            expect(paletteService.getAll()).toHaveLength(1);
        });

        it('results in empty list when last palette is deleted', () => {
            const id = paletteService.save({
                name: 'Only One',
                scheme: mockScheme,
            });

            paletteService.delete(id);

            expect(paletteService.getAll()).toEqual([]);
        });
    });
});
