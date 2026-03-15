// oxlint-disable no-console

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

const savePalettes = (palettes) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(palettes));
    } catch (error) {
        console.error('Failed to save palettes to localStorage:', error);
    }
};

export const paletteService = {
    getAll() {
        return getPalettes();
    },

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
            id,
            name,
            scheme,
            createdAt: new Date().toISOString(),
        };
        palettes.push(newPalette);
        savePalettes(palettes);
        return id;
    },

    delete(id) {
        try {
            const palettes = getPalettes();
            const filtered = palettes.filter((p) => p.id !== id);
            savePalettes(filtered);
        } catch (error) {
            console.error('Failed to delete palette from localStorage:', error);
        }
    },
};
