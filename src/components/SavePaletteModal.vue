// This component is responsible for rendering the modal that allows users to
save their palette. It includes a form with an input field for the palette name
and buttons to save or close the modal. The component also handles form
submission, validation, and displays toast notifications based on the success or
failure of the save operation.

<template>
    <!-- overlay  -->
    <div
        class="modal-mask modal-save"
        role="dialog"
        aria-modal="true"
        aria-labelledby="save-palette-title"
        @click.self="$emit('close')"
    >
        <div
            class="modal-wrapper"
            data-testid="modal-wrapper"
        >
            <div class="modal-container">
                <form
                    @submit.prevent="savePalette"
                    data-testid="save-palette-form"
                >
                    <!-- header  -->
                    <div class="modal-header">
                        <h3
                            id="save-palette-title"
                            data-testid="save-palette-header-title"
                            >Save this palette</h3
                        >
                    </div>

                    <!-- body  -->
                    <div class="modal-body">
                        <div
                            :class="
                                invalid
                                    ? 'modal-input modal-input-invalid'
                                    : 'modal-input'
                            "
                            data-testid="modal-input"
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
                                data-testid="name-input"
                            />
                        </div>
                    </div>

                    <!-- footer  -->
                    <div class="modal-footer">
                        <button
                            type="button"
                            class="secondary-button"
                            data-testid="close-button"
                            @click="$emit('close')"
                        >
                            <i class="fas fa-times"></i>
                            Close
                        </button>
                        <button
                            class="secondary-button"
                            data-testid="save-button"
                            type="submit"
                        >
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

    /** @type {import('vue').Ref<HTMLElement | null>} */
    const nameInput = ref(null);

    onMounted(() => {
        nameInput.value?.focus();
        document.addEventListener('keydown', handleKeydown);
    });

    onUnmounted(() => {
        document.removeEventListener('keydown', handleKeydown);
    });

    /**
     * Handles the keydown event to allow closing the modal with the Escape key.
     * @param {KeyboardEvent} e - the keyboard event
     */
    const handleKeydown = (e) => {
        if (e.key === 'Escape') {
            emit('close');
        }
    };

    const paletteName = ref('');
    const placeholder = ref('Palette name');
    const invalid = ref(false);

    /** Saves the current palette with the provided name. Validates the input and
     * displays toast notifications based on the success or failure of the save operation. */
    const savePalette = async () => {
        if (paletteName.value) {
            try {
                await store.dispatch('SAVE_PALETTE', {
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
