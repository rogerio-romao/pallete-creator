import { db } from '../lib/firebase'
import { collection, addDoc, getDocs, doc, deleteDoc, where, query } from 'firebase/firestore'

const COLLECTION_NAME = 'palettes'

const checkDb = () => {
    if (!db) {
        throw new Error('Firebase not initialized. Check your environment variables.');
    }
}

export const paletteService = {
  async getByUser(userEmail) {
    checkDb()
    const q = query(collection(db, COLLECTION_NAME), where('user', '==', userEmail))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => {
      const data = doc.data()
      data.id = doc.id
      return data
    })
  },

  async save({ userEmail, name, scheme }) {
    checkDb()
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      user: userEmail,
      name,
      scheme
    })
    return docRef.id
  },

  async delete(id) {
    checkDb()
    await deleteDoc(doc(db, COLLECTION_NAME, id))
  }
}
