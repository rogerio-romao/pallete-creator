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
            <div class="palettes-wrapper">
                <!-- one palette  -->
                <div
                    v-for="palette in palettes"
                    :key="palette.id"
                    class="saved-palette"
                    @click="editPalette(palette.scheme.slice(1))"
                >
                    <!-- palette info  -->
                    <div class="saved-palette-header">
                        <h4>{{ palette.name }}</h4>
                        <div @click.stop="deletePalette(palette.id)">
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
    </section>
</template>

<script setup>
    import 'mosha-vue-toastify/dist/style.css';

    import { computed } from 'vue';
    import { createToast } from 'mosha-vue-toastify';
    import { useStore } from 'vuex';

    const store = useStore();

    const { isSavedPaneCollapsed } = defineProps({
        isSavedPaneCollapsed: {
            default: false,
            type: Boolean,
        },
    });

    const palettes = computed(() => store.state.savedPalettes);

    // Puts the clicked on palette on the color slots for editing.

    const editPalette = (palette) => {
        store.dispatch('SET_PALETTE_FROM_SAVED', palette);
    };

    // Deletes the clicked on palette from the saved palletes.

    const deletePalette = async (id) => {
        // oxlint-disable-next-line no-alert
        const confirm = globalThis.confirm(
            'Are you sure you want to delete this palette? This action cannot be undone.',
        );
        if (confirm) {
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
            }
        }
    };
</script>
