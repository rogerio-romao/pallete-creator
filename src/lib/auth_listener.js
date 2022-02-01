import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useStore } from 'vuex'

const auth = getAuth()
const store = useStore()

onAuthStateChanged(auth, user => {
  if (user) {
    const email = user.email
    store.dispatch('SIGNIN_USER', email)
  } else {
    store.dispatch('SIGNOUT_USER')
  }
})
