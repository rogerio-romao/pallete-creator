<template>
  <!-- overlay  -->
  <div class="modal-mask">
    <div class="modal-wrapper" @click.self="$emit('close')">
      <div class="modal-container">
        <form @submit.prevent="savePallete">
          <!-- header  -->
          <div class="modal-header">
            <h3>Save this pallete</h3>
          </div>

          <!-- body  -->
          <div class="modal-body">
            <div :class="invalid ? 'invalid save-input' : 'save-input'">
              <input
                type="text"
                :placeholder="placeholder"
                v-model="palleteName"
                id="savePalleteName"
              />
            </div>
          </div>

          <!-- footer  -->
          <div class="modal-footer save-modal-footer">
            <button class="main-button" @click="$emit('close')">
              <i class="fas fa-times"></i>
              Close
            </button>
            <button class="main-button" type="submit">
              <i class="fas fa-save"></i>
              Save
            </button>
            <span class="footer-msg" v-show="saved">
              <i class="fas fa-check"></i>
              Saved!
            </span>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useStore } from "vuex";

const store = useStore();

const palleteName = ref("");
const saved = ref(false);
const placeholder = ref("Pallete name");
const invalid = ref(false);

const savePallete = () => {
  if (palleteName.value) {
    store.dispatch("SAVE_PALLETE", {
      name: palleteName.value,
      scheme: store.getters.currentScheme,
    });
    palleteName.value = "";
    saved.value = true;
    invalid.value = false;
  } else {
    placeholder.value = "Please enter name";
    invalid.value = true;
  }
};
</script>

<style>
</style>
