// This component displays the user's saved palettes and allows them to load a
palette into the color slots for editing or exporting. It also provides a delete
button for each saved palette, with a confirmation prompt to prevent accidental
deletions.

<template>
    <!-- panel wrapper  -->
    <section class="saved-palette-pane panel">
        <!-- panel collapsed message  -->
        <p v-if="isSavedPaneCollapsed">Click the arrow to expand panel.</p>
        <div class="hide" v-if="!isSavedPaneCollapsed">
            <!-- header text  -->
            <div class="panel-header">
                <p>
                    Any palettes you save will appear here. Clicking on one will
                    load it on the color slots for editing or exporting the CSS.
                </p>
            </div>

            <!-- palettes container  -->
            <div class="saved-palettes">
                <!-- one palette  -->
                <div
                    v-for="palette in palettes"
                    :key="palette.id"
                    class="saved-palette"
                    :data-testid="'saved-palette-' + palette.id"
                    @click="editPalette(palette.scheme.slice(1))"
                >
                    <!-- palette info  -->
                    <div class="saved-palette-header">
                        <h4>{{ palette.name }}</h4>
                        <div
                            data-testid="delete-palette-trigger"
                            @click.stop="deletePalette(palette)"
                        >
                            <i class="fas fa-trash-alt"></i>
                        </div>
                    </div>

                    <!-- palette colors  -->
                    <div class="saved-palette-colors">
                        <div
                            v-for="(color, i) in palette.scheme.slice(1)"
                            :key="i"
                            class="saved-palette-color"
                            :style="{ backgroundColor: color.hsl }"
                        ></div>
                    </div>
                </div>
            </div>
        </div>

        <div
            v-if="showDeleteModal"
            data-testid="delete-palette-modal"
            class="modal-mask"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-palette-title"
        >
            <div class="modal-wrapper" @click.self="closeDeleteModal">
                <div class="modal-container delete-modal">
                    <div class="modal-header">
                        <h3 id="delete-palette-title">Delete palette?</h3>
                    </div>

                    <div class="modal-body">
                        <p>
                            Delete
                            <strong>{{
                                paletteToDelete?.name ?? 'this palette'
                            }}</strong
                            >? This action cannot be undone.
                        </p>
                    </div>

                    <div class="modal-footer delete-modal-footer">
                        <button
                            class="secondary-button"
                            data-testid="cancel-delete-button"
                            type="button"
                            @click="closeDeleteModal"
                        >
                            Cancel
                        </button>
                        <button
                            class="main-button"
                            data-testid="confirm-delete-button"
                            type="button"
                            @click="confirmDeletePalette"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
    // oxlint-disable-next-line import/no-unassigned-import
    import 'mosha-vue-toastify/dist/style.css';

    import { createToast } from 'mosha-vue-toastify';
    import { useStore } from 'vuex';
    import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

    /** @typedef {import('../store/state').ColorSlot} ColorSlot */

    const store = useStore();

    const { isSavedPaneCollapsed } = defineProps({
        isSavedPaneCollapsed: {
            default: false,
            type: Boolean,
        },
    });

    const palettes = computed(() => store.state.savedPalettes);

    /** @type {import('vue').Ref<boolean>} */
    const showDeleteModal = ref(false);
    /** @type {import('vue').Ref<{ id: string, name: string } | null>} */
    const paletteToDelete = ref(null);

    /**
     * Closes the delete modal when Escape is pressed.
     * @param {KeyboardEvent} event - The keyboard event.
     */
    const handleKeydown = (event) => {
        if (event.key === 'Escape' && showDeleteModal.value) {
            closeDeleteModal();
        }
    };

    onMounted(() => {
        document.addEventListener('keydown', handleKeydown);
    });

    onBeforeUnmount(() => {
        document.removeEventListener('keydown', handleKeydown);
    });

    /**
     * Loads the clicked palette into the color slots for editing.
     * @param {ColorSlot[]} palette - The palette scheme to load into the slots.
     */
    const editPalette = (palette) => {
        store.dispatch('SET_PALETTE_FROM_SAVED', palette);
    };

    /**
     * Opens the delete confirmation modal for the clicked palette.
     * @param {{ id: string, name: string }} palette - The palette to delete.
     */
    const deletePalette = (palette) => {
        paletteToDelete.value = palette;
        showDeleteModal.value = true;
    };

    /**
     * Closes the delete confirmation modal and clears the selection.
     */
    const closeDeleteModal = () => {
        showDeleteModal.value = false;
        paletteToDelete.value = null;
    };

    /**
     * Deletes the selected palette from the saved palettes.
     */
    const confirmDeletePalette = async () => {
        if (!paletteToDelete.value) {
            return;
        }

        const { id } = paletteToDelete.value;

        try {
            await store.dispatch('DELETE_PALETTE', id);
            createToast('Palette deleted!', {
                hideProgressBar: true,
                position: 'bottom-right',
                type: 'info',
            });
        } catch {
            createToast('Failed to delete palette. Please try again.', {
                hideProgressBar: true,
                position: 'bottom-right',
                type: 'danger',
            });
        } finally {
            closeDeleteModal();
        }
    };
</script>
