import { collection, getDocs } from 'firebase/firestore'

const querySnapshot = await getDocs(collection(db, 'palettes'))
querySnapshot.forEach(doc => {
  console.log(`${doc.id} => ${doc.data()}`)
})
