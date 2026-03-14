import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    query,
    where,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

const COLLECTION_NAME = 'palettes';

const checkDb = () => {
    if (!db) {
        throw new Error(
            'Firebase not initialized. Check your environment variables.',
        );
    }
};

export const paletteService = {
    async getByUser(userEmail) {
        checkDb();
        const q = query(
            collection(db, COLLECTION_NAME),
            where('user', '==', userEmail),
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map((docSnapshot) => {
            const data = docSnapshot.data();
            data.id = docSnapshot.id;
            return data;
        });
    },

    async save({ userEmail, name, scheme }) {
        checkDb();

        if (!userEmail) {
            throw new Error('User email is required to save a palette.');
        }

        if (!name) {
            throw new Error('Palette name is required.');
        }

        if (!scheme) {
            throw new Error('Palette scheme is required.');
        }

        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            user: userEmail,
            name,
            scheme,
        });
        return docRef.id;
    },

    async delete(id) {
        checkDb();
        await deleteDoc(doc(db, COLLECTION_NAME, id));
    },
};
