<template>
    <!-- overlay  -->
    <div
        class="modal-mask"
        role="dialog"
        aria-modal="true"
        aria-labelledby="save-palette-title"
    >
        <div class="modal-wrapper" @click.self="$emit('close')">
            <div class="modal-container">
                <form @submit.prevent="savePalette">
                    <!-- header  -->
                    <div class="modal-header">
                        <h3 id="save-palette-title">Save this palette</h3>
                    </div>

                    <!-- body  -->
                    <div class="modal-body">
                        <div
                            :class="
                                invalid ? 'invalid save-input' : 'save-input'
                            "
                        >
                            <label for="savePaletteName" class="sr-only"
                                >Palette name</label
                            >
                            <input
                                type="text"
                                :placeholder="placeholder"
                                v-model="paletteName"
                                id="savePaletteName"
                                ref="nameInput"
                            />
                        </div>
                    </div>

                    <!-- footer  -->
                    <div class="modal-footer save-modal-footer">
                        <button
                            class="secondary-button"
                            @click="$emit('close')"
                        >
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
    // oxlint-disable-next-line import/no-unassigned-import
    import 'mosha-vue-toastify/dist/style.css';

    import { createToast } from 'mosha-vue-toastify';
    import { useStore } from 'vuex';
    import { onMounted, onUnmounted, ref } from 'vue';

    const store = useStore();

    const emit = defineEmits(['close']);
    const nameInput = ref(null);

    onMounted(() => {
        nameInput.value?.focus();
        document.addEventListener('keydown', handleKeydown);
    });

    onUnmounted(() => {
        document.removeEventListener('keydown', handleKeydown);
    });

    const handleKeydown = (e) => {
        if (e.key === 'Escape') {
            emit('close');
        }
    };

    const paletteName = ref('');
    const placeholder = ref('Palette name');
    const invalid = ref(false);

    const savePalette = async () => {
        if (paletteName.value) {
            try {
                await store.dispatch('SAVE_TO_CLOUD', {
                    name: paletteName.value,
                    scheme: store.getters.currentScheme,
                });
                paletteName.value = '';
                invalid.value = false;
                createToast('Palette saved!', {
                    hideProgressBar: true,
                    position: 'bottom-right',
                    type: 'success',
                });
                emit('close');
            } catch {
                createToast('Failed to save palette. Please try again.', {
                    hideProgressBar: true,
                    position: 'bottom-right',
                    type: 'danger',
                });
            }
        } else {
            placeholder.value = 'Please enter name';
            invalid.value = true;
            createToast('Please name the palette first', {
                hideProgressBar: true,
                position: 'bottom-right',
                type: 'warning',
            });
        }
    };
</script>

<style></style>
