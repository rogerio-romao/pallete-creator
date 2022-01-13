<template>
  <div class="modal-mask">
    <div class="modal-wrapper" @click.self="$emit('close')">
      <div class="modal-container">
        <form @submit.prevent="savePallete">
          <div class="modal-header">
            <h3>Save this pallete</h3>
          </div>

          <div class="modal-body">
            <div class="input">
              <input
                type="text"
                placeholder="Pallete name"
                v-model="palleteName"
                id="savePalleteName"
              />
              <button type="submit" id="chevron">
                <i class="fas fa-chevron-circle-right"></i>
              </button>
            </div>
          </div>

          <div class="modal-footer">
            <button
              class="generate-color"
              @click="$emit('close')"
              id="cancel-btn"
            >
              Cancel
            </button>
            <button class="generate-color" type="submit">Save</button>
            <span class="msg" v-show="saved">
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
