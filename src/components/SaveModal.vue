<template>
  <!-- overlay  -->
  <div class="modal-mask">
    <div class="modal-wrapper" @click.self="$emit('close')">
      <div class="modal-container">
        <form @submit.prevent="savePalette">
          <!-- header  -->
          <div class="modal-header">
            <h3>Save this palette</h3>
          </div>

          <!-- body  -->
          <div class="modal-body">
            <div :class="invalid ? 'invalid save-input' : 'save-input'">
              <input
                type="text"
                :placeholder="placeholder"
                v-model="paletteName"
                id="savePaletteName"
              />
            </div>
          </div>

          <!-- footer  -->
          <div class="modal-footer save-modal-footer">
            <button class="secondary-button" @click="$emit('close')">
              <i class="fas fa-times"></i>
              Close
            </button>
            <button class="secondary-button" type="submit">
              <i class="fas fa-save"></i>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { createToast } from 'mosha-vue-toastify';
import 'mosha-vue-toastify/dist/style.css'

const store = useStore();

const emit = defineEmits(["close"]);

const paletteName = ref("");
const saved = ref(false);
const placeholder = ref("Palette name");
const invalid = ref(false);
const isUserSignedIn = computed(() => store.state.isUserSignedIn);

const savePalette = () => {
  if (paletteName.value) {
    if (isUserSignedIn.value) {
      store.dispatch("SAVE_TO_CLOUD", {
        name: paletteName.value,
        scheme: store.getters.currentScheme,
      });
      paletteName.value = "";
      saved.value = true;
      invalid.value = false;
      createToast('Palette saved!', {
        type: "success",
        position: "bottom-right",
        hideProgressBar: true,
      })
      emit('close')
    } else {
      paletteName.value = "";
      placeholder.value = "Login to save";
      invalid.value = true;
    }
  } else {
    placeholder.value = "Please enter name";
    invalid.value = true;
    createToast('Please name the palette first', {
      type: "warning",
      position: "bottom-right",
      hideProgressBar: true,
    })
  }
};
</script>

<style>
</style>
