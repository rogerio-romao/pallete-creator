<template>
  <header>
    <nav>
      <div class="brand">
        <span>
          <img src="../assets/logo.png" alt="logo" id="logo" />
        </span>
        <span class="title"> Color Pallete Creator </span>
      </div>
      <div class="nav-links">
        <ul>
          <li @click="emit('openInstructionsModal')">Instructions</li>
          <li>Login</li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script setup>
const emit = defineEmits(["openInstructionsModal"]);
</script>

<style>
</style>