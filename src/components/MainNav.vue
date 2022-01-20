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
          <li>Login</li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script setup>
const emit = defineEmits(["openInstructionsModal"]);
</script>
