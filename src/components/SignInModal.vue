<template>
  <!-- overlay  -->
  <div class="modal-mask">
    <div class="modal-wrapper" @click.self="$emit('close')">
      <div class="modal-container">
          <!-- header  -->
          <div class="modal-header">
            <h3 v-if="mode === 'signin'">Sign In</h3>
            <h3 v-else>Register</h3>
          </div>

          <!-- body  -->
          <div class="modal-body">
            <div>
              <label for="email">
                Email
                <input
                  type="email"
                  placeholder="Enter email"
                  v-model.trim="email"
                  id="email"
                />
              </label>
              <br>
              <label for="password">
                Password
                <input
                  type="password"
                  placeholder="Enter password"
                  v-model.trim="password"
                  id="password"
                />
              </label>
              <br>
              <label for="confirm" v-if="mode === 'signup'">
                Confirm Password
                <input
                  type="password"
                  placeholder="Confirm password"
                  v-model.trim="passwordConfirm"
                  id="confirm"
                />
              </label>
            </div>
            <div v-if="mode === 'signin'">
              Don't have an account yet?
              <span @click="mode = 'signup'">Sign Up</span>
            </div>
            <div v-else>
              Already have an account?
              <span @click="mode = 'signin'">Sign In</span>
            </div>
          </div>

          <!-- footer  -->
          <div class="modal-footer save-modal-footer">
            <button class="main-button" @click="$emit('close')">
              <i class="fas fa-times"></i>
              Close
            </button>
            <button class="main-button" @click="signIn" v-if="mode === 'signin'">
              <i class="fas fa-save"></i>
              Sign In
            </button>
            <button class="main-button" @click="signup" v-else>
              <i class="fas fa-save"></i>
              Sign Up
            </button>
          </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useStore } from 'vuex'
import { app } from '../lib/firebase';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import xss from 'xss'

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

const mode = ref("signin");

const signIn = () => {
  const userData = {
    email: xss(email.value),
    password: xss(password.value)
  };
  console.log(userData);
  // validate user and clean up TODO
  signInWithEmailAndPassword(auth, userData.email, userData.password)
  .then(userCredential => {
    const user = userCredential.user
    console.log('User signed in', user)
    emit('close')
  })
  .catch(error => {
    const errorCode = error.code
    const errorMessage = error.message
    console.error('Error signing in', errorCode, errorMessage)
  })
}

const signup = () => {
  const userData = {
    email: xss(email.value),
    password: xss(password.value),
    passwordConfirm: xss(passwordConfirm.value)
  };
  console.log(userData);
  // validate user and clean up TODO
  if (userData.password !== userData.passwordConfirm) {
    console.error('Passwords do not match')
    return
  }
  createUserWithEmailAndPassword(auth, userData.email, userData.password)
  .then(userCredential => {
    const user = userCredential.user
    console.log('User signed up', user)
    emit('close')
  })
  .catch(error => {
    const errorCode = error.code
    const errorMessage = error.message
    console.error('Error signing up', errorCode, errorMessage)
  })
}

</script>

<style>
</style>
