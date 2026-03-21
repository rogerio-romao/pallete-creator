// oxlint-disable new-cap -- mutations are in ALL_CAPS by convention, they are not constructors and should not be renamed

import mutations from './mutations';
import state from './state';

// oxlint-disable-next-line max-lines-per-function
describe('store mutations', () => {
    /** @type {ReturnType<typeof state>} */
    let testState;

    beforeEach(() => {
        testState = state();
    });

    describe('SET_LABEL', () => {
        it('updates the label at the given slot index', () => {
            mutations.SET_LABEL(testState, { label: 'Primary', slotNumber: 2 });

            expect(testState.labels[2]).toBe('Primary');
        });

        it('does not affect other labels', () => {
            const before = [...testState.labels];
            const slotNumber = 2;
            mutations.SET_LABEL(testState, { label: 'Primary', slotNumber });

            expect(testState.labels.filter((_, i) => i !== slotNumber)).toEqual(
                before.filter((_, i) => i !== slotNumber),
            );
        });
    });

    describe('SET_SAVED_PALETTES', () => {
        it('replaces savedPalettes with the provided array', () => {
            const palettes = [
                {
                    createdAt: '2024-01-01T00:00:00.000Z',
                    id: '1',
                    name: 'Sunset',
                    scheme: [],
                },
            ];
            mutations.SET_SAVED_PALETTES(testState, palettes);

            expect(testState.savedPalettes).toBe(palettes);
        });

        it('clears savedPalettes when given an empty array', () => {
            testState.savedPalettes = [
                {
                    createdAt: '',
                    id: '1',
                    name: 'Old',
                    scheme: [],
                },
            ];
            mutations.SET_SAVED_PALETTES(testState, []);

            expect(testState.savedPalettes).toEqual([]);
        });
    });

    describe('SET_TEXT_COLOR', () => {
        it('replaces textColor with the provided color values', () => {
            const color = {
                hex: '#0f131a',
                hsl: 'hsl(218, 27%, 8%)',
                rgb: 'rgb(15, 19, 26)',
                type: 'text',
            };
            mutations.SET_TEXT_COLOR(testState, color);

            expect(testState.textColor).toBe(color);
        });
    });
});
