<template>
  <div class="modal-mask">
    <div class="modal-wrapper" @click.self="$emit('close')">
      <div class="modal-container">
        <div class="modal-header">
          <h3>Export CSS <small>- choose color mode</small></h3>
        </div>

        <div class="modal-body">
          <div class="export-modal-buttons">
            <button class="secondary-button" @click="changeMode('rgb')">
              RGB
            </button>
            <button class="secondary-button" @click="changeMode('hex')">
              HEX
            </button>
            <button class="secondary-button" @click="changeMode('hsl')">
              HSL
            </button>
            <button class="secondary-button" @click="changeSyntax">
              {{ syntaxLabel }}
            </button>
          </div>
          <div class="code" @click="selectAll">
            <p class="code-info">Click here to copy</p>
            <p v-for="(label, i) in labels" :key="i" class="pre">
              {{ syntax }}{{ label.toLowerCase() }}:
              {{ currentScheme[i][mode] }};
            </p>
          </div>
        </div>

        <div class="modal-footer export-modal-footer">
          <button class="main-button" @click="$emit('close')">
            <i class="fas fa-times"></i>
            Close
          </button>
          <span class="footer-msg" v-show="copied">
            <i class="fas fa-check"></i>
            Code was copied.
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";

const store = useStore();
const labels = computed(() => store.state.labels);
const currentScheme = computed(() => store.getters.currentScheme);

const copied = ref(false);
const mode = ref("hsl");
const syntax = ref("--clr-");
const syntaxLabel = ref("SCSS");

const changeSyntax = () => {
  if (syntax.value === "--clr-") {
    syntax.value = "$clr-";
    syntaxLabel.value = "CSS";
  } else {
    syntax.value = "--clr-";
    syntaxLabel.value = "SCSS";
  }
};

const changeMode = (newMode) => {
  mode.value = newMode;
};

const selectAll = () => {
  // copy selected text to clipboard
  const text = document.querySelector(".pre").innerText;
  const el = document.createElement("textarea");
  el.value = text;
  el.setAttribute("readonly", "");
  el.style.position = "absolute";
  el.style.left = "-9999px";
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
  copied.value = true;
};
</script>

<style>
</style>
