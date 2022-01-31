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
                  v-model="email"
                  id="email"
                />
              </label>
              <br>
              <label for="password">
                Password
                <input
                  type="password"
                  placeholder="Enter password"
                  v-model="password"
                  id="password"
                />
              </label>
              <br>
              <label for="confirm" v-if="mode === 'register'">
                Confirm Password
                <input
                  type="password"
                  placeholder="Confirm password"
                  v-model="confirm"
                  id="confirm"
                />
              </label>
            </div>
            <div v-if="mode === 'signin'">
              Don't have an account yet?
              <span @click="mode = 'register'">Register</span>
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
            <button class="main-button" @click="register" v-else>
              <i class="fas fa-save"></i>
              Register
            </button>
          </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const email = ref("");
const password = ref("");
const passwordConfirm = ref("");

const mode = ref("signin");

const signIn = () => {
  const user = {
    email: email.value,
    password: password.value
  };
  console.log(user);
}
</script>

<style>
</style>
