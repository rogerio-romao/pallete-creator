import { collection, addDoc } from 'firebase/firestore'

try {
  const docRef = await addDoc(collection(db, 'palettes'), {
    user: 'user-id',
    name: 'palette-name',
    scheme: [
      {
        color: '#000000',
        slot: 1
      },
      {
        color: '#000000',
        slot: 2
      },
      {
        color: '#000000',
        slot: 3
      }
    ]
  })
  console.log('Document written with ID: ', docRef.id)
} catch (e) {
  console.error('Error adding document: ', e)
}
