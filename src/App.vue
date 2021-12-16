<template>
  <header>
    <nav>
      <main-nav></main-nav>
    </nav>
  </header>
  <main>
    <h1 class="heading1">Build your pallete</h1>
    <colors-pane
      @uniqueColors="setUniqueColors($event)"
      :copiedColor="copiedColor"
    ></colors-pane>
    <h2 class="heading2">Pick your variations</h2>
    <mini-slots
      :colors="uniqueColors"
      @copyColor="copiedColor = $event"
    ></mini-slots>
  </main>
</template>

<script setup>
import { ref } from "vue";
import MainNav from "./components/MainNav.vue";
import ColorsPane from "./components/ColorsPane.vue";
import MiniSlots from "./components/MiniSlots.vue";

const uniqueColors = ref(new Set());
const copiedColor = ref("");
console.log(copiedColor);

const setUniqueColors = (colors) => {
  uniqueColors.value = new Set(colors);
};
</script>


<style>
/* External Fonts  */

@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@100;400;600;700&family=Zen+Antique&display=swap");

/* ----- RESET -----  */

/* Box sizing rules */
*,
*::before,
*::after {
  box-sizing: border-box;
}

/* Remove default margin */
body,
h1,
h2,
h3,
h4,
p,
figure,
blockquote,
dl,
dd {
  margin: 0;
}

/* Remove list styles on ul, ol elements  */
ul,
ol {
  list-style: none;
}

/* Set core root defaults */
html:focus-within {
  scroll-behavior: smooth;
}

/* Set core body defaults */
body {
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  line-height: 1.5;
}

/* A elements that don't have a class get default styles */
a:not([class]) {
  text-decoration-skip-ink: auto;
}

/* Make images easier to work with */
img,
picture {
  max-width: 100%;
  display: block;
}

/* Inherit fonts for inputs and buttons */
input,
button,
textarea,
select {
  font: inherit;
}

/* Remove all animations, transitions and smooth scroll for people that prefer not to see them */
@media (prefers-reduced-motion: reduce) {
  html:focus-within {
    scroll-behavior: auto;
  }

  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Custom Properties  */
:root {
  --clr-main: #435;
  --clr-complementary: #674712;
  --clr-light: #ffc76e;
  --clr-accent: #1662a6;
  --clr-accent-light: #50a5f2;
  --text-light: antiquewhite;
  --slot-size: 100px;
  --mini-slot-size: 50px;
}

/* ----- STYLES -----  */

html {
  background-color: var(--clr-light);
}

body {
  font-family: "Montserrat", sans-serif;
}

/* Main  */

main {
  margin-top: 50px;
  padding: 2rem;
}

section {
  background: var(--text-light);
}

.heading1,
.heading2 {
  color: var(--clr-main);
}

.pallete-pane {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  border: 1px solid var(--clr-main);
  border-radius: 0.5rem;
  padding: 0.5rem;
}

.color-slot {
  width: var(--slot-size);
  height: var(--slot-size);
  border: 1px solid var(--clr-main);
  border-radius: 0.25rem;
  background-color: var(--clr-light);
  display: flex;
  gap: 5px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 0.65rem;
  margin-bottom: 1rem;
}

.slot-buttons {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

.generate-color {
  font-size: 0.75rem;
  cursor: pointer;
  color: var(--clr-accent);
  border: 1px solid var(--clr-accent-light);
}

button[disabled] {
  cursor: not-allowed;
  color: var(--clr-complementary);
}

.mini-slots {
  border: 1px solid var(--clr-main);
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  margin-top: 5px;
  display: grid;
  grid-template-columns: repeat(auto-fill, var(--mini-slot-size));
  gap: 1.5rem;
}

.mini-slot {
  width: var(--mini-slot-size);
  height: var(--mini-slot-size);
  border: 1px solid black;
  border-radius: 50%;
  cursor: pointer;
}

.copied {
  outline: #50a5f2 solid 5px;
}
</style>
