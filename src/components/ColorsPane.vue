<template>
  <main>
    <!-- Pallete Pane  -->
    <section class="pallete-pane">
      <div id="slot1">
        <div class="color-slot">
          <span class="rgbValue"></span>
          <span class="hexValue"></span>
          <span class="hslValue"></span>
        </div>
        <div class="slot-buttons">
          <button class="generate-color">Random</button>
        </div>
      </div>
      <div id="slot2">
        <div class="color-slot">
          <span class="rgbValue"></span>
          <span class="hexValue"></span>
          <span class="hslValue"></span>
        </div>
        <div class="slot-buttons">
          <button class="generate-color">Random</button>
          <button class="complementary-color">Complement</button>
        </div>
      </div>
      <div id="slot3">
        <div class="color-slot">
          <span class="rgbValue"></span>
          <span class="hexValue"></span>
          <span class="hslValue"></span>
        </div>
        <div class="slot-buttons">
          <button class="generate-color">Random</button>
        </div>
      </div>
      <div id="slot4">
        <div class="color-slot">
          <span class="rgbValue"></span>
          <span class="hexValue"></span>
          <span class="hslValue"></span>
        </div>
        <div class="slot-buttons">
          <button class="generate-color">Random</button>
        </div>
      </div>
      <div id="slot5">
        <div class="color-slot">
          <span class="rgbValue"></span>
          <span class="hexValue"></span>
          <span class="hslValue"></span>
        </div>
        <div class="slot-buttons">
          <button class="generate-color">Random</button>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
const rgb = ref("");
const hex = ref("");
const hsl = ref("");
</script>

<style>
</style>