const STORAGE_KEY = 'palettes';

const getPalettes = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
};

const savePalettes = (palettes) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(palettes));
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
        const palettes = getPalettes();
        const filtered = palettes.filter((p) => p.id !== id);
        savePalettes(filtered);
    },
};
