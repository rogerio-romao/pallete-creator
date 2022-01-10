<template>
  <div class="modal-mask">
    <div class="modal-wrapper" @click.self="$emit('close')">
      <div class="modal-container">
        <div class="modal-header">
          <h3>Save this pallete</h3>
        </div>

        <div class="modal-body">
          <form @submit.prevent="savePallete">
            <div class="input">
              <input
                type="text"
                placeholder="Pallete name"
                v-model="palleteName"
                id="savePalleteName"
              />
              <button type="submit">
                <i class="fas fa-chevron-circle-right"></i>
              </button>
            </div>
          </form>
        </div>

        <div class="modal-footer">
          <button class="generate-color" @click="$emit('close')">OK</button>
          <span class="msg" v-show="saved">
            <i class="fas fa-check"></i>
            Saved!
          </span>
        </div>
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

const savePallete = () => {
  if (palleteName.value) {
    store.dispatch("SAVE_PALLETE", {
      name: palleteName.value,
      scheme: store.getters.currentScheme,
    });
    palleteName.value = "";
    saved.value = true;
  }
};
</script>

<style>
</style>
