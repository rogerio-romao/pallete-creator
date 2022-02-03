<template>
  <header>
    <nav>
      <!-- left side logo and brand  -->
      <div class="brand">
        <span>
          <img src="../assets/logo.png" alt="logo" id="logo" />
        </span>
        <span class="title"> Color Palette Creator </span>
      </div>

      <!-- right side nav  -->
      <div class="nav-links">
        <ul>
          <li @click="emit('openInstructionsModal')">Instructions</li>
          <li v-if="!isSignedIn" @click="emit('openSignInModal')">Sign In</li>
          <li v-else @click="logout">Sign Out</li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex'
import { app } from '../lib/firebase';
import { getAuth, signOut } from "firebase/auth";

const emit = defineEmits(["openInstructionsModal", "openSignInModal"]);

const store = useStore()
const auth = getAuth();

const isSignedIn = computed(() => store.state.isUserSignedIn)

const logout = () => {
  signOut(auth).then(() => {
    store.dispatch('SIGNOUT_USER')
}).catch((error) => {
    console.log(error)
});
}
</script>
