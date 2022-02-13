<template>
  <!-- overlay  -->
  <div class="modal-mask">
    <div class="modal-wrapper" @click.self="$emit('close')">
      <div class="modal-container sign-in">
        <!-- header  -->
        <div class="modal-header">
          <h3 v-if="mode === 'signin'">Sign In</h3>
          <h3 v-else>Register</h3>
        </div>

        <!-- body  -->
        <div class="modal-body">
          <!-- all inputs  -->
          <div class="inputs-wrapper">
            <!-- email input  -->
            <div class="input-wrapper">
              <label for="email">Email:</label>
              <input type="email" placeholder="Enter email" v-model.trim="email" id="email" />
            </div>

            <!-- password input  -->
            <div class="input-wrapper">
              <label for="password">Password:</label>
              <input
                type="password"
                minlength="6"
                placeholder="Enter password"
                v-model.trim="password"
                id="password"
              />
            </div>

            <!-- confirm password input -->
            <div v-if="mode === 'signup'" class="input-wrapper">
              <label for="confirm">Confirm:</label>
              <input
                type="password"
                minlength="6"
                placeholder="Confirm password"
                v-model.trim="passwordConfirm"
                id="confirm"
              />
            </div>
          </div>

          <!-- signin / signup message  -->
          <div v-if="mode === 'signin'" class="switch-mode-msg">
            Don't have an account yet?
            <span @click="mode = 'signup'">Go Sign Up</span>
          </div>

          <div v-else class="switch-mode-msg">
            Already have an account?
            <span @click="mode = 'signin'">Go Sign In</span>
          </div>
        </div>

        <!-- footer  -->
        <div class="modal-footer save-modal-footer">
          <button class="secondary-button" @click="$emit('close')">
            <i class="fas fa-times"></i>
            Close
          </button>
          <button class="secondary-button" @click="signIn" v-if="mode === 'signin'">
            <i class="fas fa-save"></i>
            Sign In
          </button>
          <button class="secondary-button" @click="signup" v-else>
            <i class="fas fa-save"></i>
            Sign Up
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useStore } from 'vuex'
import { app } from '../lib/firebase';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import xss from 'xss'
import { createToast } from 'mosha-vue-toastify';
import 'mosha-vue-toastify/dist/style.css'

const store = useStore()
const auth = getAuth()

onAuthStateChanged(auth, user => {
  if (user) {
    const email = user.email
    store.dispatch('SIGNIN_USER', email)
  } else {
    store.dispatch('SIGNOUT_USER')
  }
})

const emit = defineEmits(['close'])

const email = ref("");
const password = ref("");
const passwordConfirm = ref("");
const errorMsg = ref("");

watch(errorMsg, (newVal, oldVal) => {
  if (newVal) {
    createToast(newVal, {
      type: 'danger',
      position: "bottom-right",
      hideProgressBar: true,
    })
  }
})


const mode = ref("signin");

const signIn = () => {
  const userData = {
    email: xss(email.value),
    password: xss(password.value)
  };

  if (!userData.email.match(emailRegex)) {
    errorMsg.value = "Please enter a valid email address."
    return
  }

  if (!userData.password) {
    errorMsg.value = "Please enter your password."
    return
  }

  signInWithEmailAndPassword(auth, userData.email, userData.password)
    .then(userCredential => {
      const user = userCredential.user
      createToast('Welcome back!', {
        type: "success",
        position: "bottom-right",
        hideProgressBar: true,
      })
      emit('close')
    })
    .catch(error => {
      const displayErrMsg = error.message.includes('user-not-found') ? 'User not found, try again or register first' : error.message.includes('wrong-password') ? 'Invalid credentials' : 'Something went wrong, try again'
      errorMsg.value = displayErrMsg
    })
}

const signup = () => {
  const userData = {
    email: xss(email.value),
    password: xss(password.value),
    passwordConfirm: xss(passwordConfirm.value)
  };

  if (!userData.email.match(emailRegex)) {
    errorMsg.value = "Please enter a valid email address."
    return
  }
  if (userData.password !== userData.passwordConfirm) {
    errorMsg.value = 'Passwords do not match'
    return
  }
  if (userData.password.length < 6) {
    errorMsg.value = 'Password must be at least 6 characters'
    return
  }

  createUserWithEmailAndPassword(auth, userData.email, userData.password)
    .then(userCredential => {
      const user = userCredential.user
      createToast('Welcome, register successful!', {
        type: "success",
        position: "bottom-right",
        hideProgressBar: true,
      })
      emit('close')
    })
    .catch(error => {
      errorMsg.value = error.message.includes('email-already-in-use') ? 'Email already in use' : error.message.includes('invalid-email') ? 'Invalid email' : 'Something went wrong, try again'
    })
}

const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

</script>
