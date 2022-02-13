<template>
  <!-- overlay  -->
  <div class="modal-mask">
    <div class="modal-wrapper" @click.self="$emit('close')">
      <div class="modal-container">
        <!-- header  -->
        <div class="modal-header">
          <h3>
            Export CSS
            <small>- choose color mode</small>
          </h3>
        </div>

        <!-- body  -->
        <div class="modal-body">
          <!-- buttons  -->
          <div class="export-modal-buttons">
            <button class="secondary-button" @click="changeMode('rgb')">RGB</button>
            <button class="secondary-button" @click="changeMode('hex')">HEX</button>
            <button class="secondary-button" @click="changeMode('hsl')">HSL</button>
            <button class="secondary-button" @click="changeSyntax">{{ syntaxLabel }}</button>
          </div>

          <!-- textarea  -->
          <div class="code" @click="selectAll">
            <p class="code-info">Click here to copy</p>
            <div class="code-wrapper">
              <p v-for="(label, i) in labels" :key="i" class="pre">
                {{ syntax }}{{ label.toLowerCase() }}:
                {{ currentScheme[i][mode] }};
              </p>
            </div>
          </div>
        </div>

        <!-- footer  -->
        <div class="modal-footer export-modal-footer">
          <button class="main-button" @click="$emit('close')">
            <i class="fas fa-times"></i>
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { createToast } from 'mosha-vue-toastify';
import 'mosha-vue-toastify/dist/style.css'

const store = useStore();
const labels = computed(() => store.state.labels);
const currentScheme = computed(() => store.getters.currentScheme);

const copied = ref(false);
const mode = ref("hsl");
const syntax = ref("--clr-");
const syntaxLabel = ref("SCSS");

// SCSS / CSS syntax when exporting
const changeSyntax = () => {
  if (syntax.value === "--clr-") {
    syntax.value = "$clr-";
    syntaxLabel.value = "CSS";
  } else {
    syntax.value = "--clr-";
    syntaxLabel.value = "SCSS";
  }
};

// RGB / HSL / HEX mode when exporting

const changeMode = (newMode) => {
  mode.value = newMode;
};

// Copying the code to the clipboard

const selectAll = () => {
  // copy selected text to clipboard
  const text = document.querySelector(".code-wrapper").innerText;
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
  createToast('CSS copied to clipboard', {
    type: "success",
    position: "bottom-right",
    hideProgressBar: true,
  })
};
</script>

