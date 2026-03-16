// oxlint-disable no-console

/** @typedef {import('../store/state.js').SavedPalette} SavedPalette */
/** @typedef {import('../store/state.js').ColorSlot} ColorSlot */

const STORAGE_KEY = 'palettes';

const getPalettes = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Failed to parse palettes from localStorage:', error);
        return [];
    }
};

/**
 * Saves the provided palettes array to localStorage under the defined STORAGE_KEY.
 * @param {SavedPalette[]} palettes - The array of palettes to save to localStorage.
 */
const savePalettes = (palettes) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(palettes));
    } catch (error) {
        console.error('Failed to save palettes to localStorage:', error);
    }
};

/**
 * Service for managing palette operations such as saving, retrieving, and deleting palettes from localStorage.
 */
const paletteService = {
    /**
     * Deletes a palette from localStorage based on its unique identifier.
     * @param {string} id - The unique identifier of the palette to delete.
     */
    delete(id) {
        try {
            /** @type {SavedPalette[]} */
            const palettes = getPalettes();
            const filtered = palettes.filter((p) => p.id !== id);
            savePalettes(filtered);
        } catch (error) {
            console.error('Failed to delete palette from localStorage:', error);
        }
    },

    /**
     * Retrieves all saved palettes from localStorage.
     * @returns {SavedPalette[]} An array of saved palettes retrieved from localStorage.
     */
    getAll() {
        return getPalettes();
    },

    /**
     * Saves a new palette to localStorage.
     * @param {{ name: string, scheme: ColorSlot[] }} payload - The palette name and color scheme to save.
     * @returns {string} The unique identifier of the saved palette.
     */
    save({ name, scheme }) {
        if (!name) {
            throw new Error('Palette name is required.');
        }

        if (!scheme) {
            throw new Error('Palette scheme is required.');
        }

        const palettes = getPalettes();
        const id = Date.now().toString();
        const newPalette = {
            createdAt: new Date().toISOString(),
            id,
            name,
            scheme,
        };
        palettes.push(newPalette);
        savePalettes(palettes);
        return id;
    },
};

export default paletteService;
