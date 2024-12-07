<template>
  <header>
    <nav>
      <!-- left side logo and brand  -->
      <div class="brand">
        <span>
          <img src="../assets/logo.png" alt="logo" id="logo" />
        </span>
        <span class="title">Color Palette Creator</span>
      </div>

      <!-- right side nav  -->
      <div class="nav-links">
        <ul>
          <li data-test="instructions-link" @click="emit('openInstructionsModal')">Instructions</li>
          <li v-if="!isSignedIn" data-test="sign-in-link" @click="emit('openSignInModal')">Sign In</li>
          <li v-else data-test="sign-out-link" @click="logout">Sign Out</li>
          <li
            data-test="fullscreen-link-minimised"
            v-if="!isFullscreen"
            @click="toggleFullscreen"
            title="Toggle FullScreen"
          >
            <i class="fas fa-expand-arrows-alt"></i>
          </li>
          <li v-else @click="toggleFullscreen" title="Toggle FullScreen" data-test="fullscreen-link-maximised">
            <i class="fas fa-window-minimize"></i>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { getAuth, signOut } from "firebase/auth";
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { app } from '../lib/firebase';

const emit = defineEmits(["openInstructionsModal", "openSignInModal"]);

const store = useStore()
const auth = getAuth();

const isSignedIn = computed(() => store.state.isUserSignedIn)
const isFullscreen = ref(false)

const logout = () => {
  signOut(auth).then(() => {
    store.dispatch('SIGNOUT_USER')
  }).catch((error) => {
    console.log(error)
  });
}

// function to make the app fullscreen
const toggleFullscreen = () => {
  const elem = document.documentElement;
  elem.requestFullscreen = elem.requestFullscreen || elem.mozRequestFullScreen || elem.webkitRequestFullscreen;
  if (!isFullscreen.value) {
    elem.requestFullscreen();
    isFullscreen.value = true;
  } else {
    document.exitFullscreen();
    isFullscreen.value = false;
  }
}
</script>
