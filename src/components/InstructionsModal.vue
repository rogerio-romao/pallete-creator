// This component is a modal dialog that provides instructions on how to use the
palette creator app.

<template>
    <!-- overlay  -->
    <div
        class="modal-mask"
        role="dialog"
        aria-modal="true"
        aria-labelledby="instructions-title"
        @click.self="$emit('close')"
    >
        <div class="modal-wrapper">
            <div class="modal-container instructions">
                <div class="instructions-wrapper">
                    <!-- header  -->
                    <div class="modal-header">
                        <h3 data-testid="instructions-title">Instructions</h3>
                    </div>

                    <!-- body  -->
                    <div class="modal-body">
                        <p>
                            A random palette is generated on load. Hit
                            <strong>One Shot</strong> to generate a new random
                            color, scheme, and live preview all at once. Or use
                            the <strong>Random</strong> button and inputs in the
                            color bar to set a specific base color — this
                            regenerates all slots based on color theory.
                        </p>
                        <p>
                            Click a color in the <strong>Variations</strong>
                            panel to copy it, then click any palette slot to
                            paste it. Click a selected variation again to
                            deselect it. Or hit <strong>Random Variations</strong>
                            to randomize all five slots at once.
                        </p>
                        <p>
                            Fine-tune any slot with the <strong>H / S / L
                            sliders</strong> below it. Click the format pill
                            (HEX / HSL / RGB) to cycle the displayed value.
                            Click a slot label to rename it.
                        </p>
                        <p>
                            <strong>Test this palette</strong> applies your
                            colors to the app so you can preview them in
                            context — <strong>Reset site colors</strong> reverts
                            it. Use <strong>Light Text</strong> or
                            <strong>Dark Text</strong> to set a readable text
                            color for your scheme. The sun / moon icon in the
                            nav toggles the app's own light or dark mode.
                        </p>
                        <p>
                            <strong>Export CSS</strong> copies the palette as
                            CSS custom properties ready to paste into your
                            project. <strong>Save Palette</strong> stores it
                            locally in your browser — no account needed. Saved
                            palettes appear below and can be reloaded or
                            deleted at any time.
                        </p>
                    </div>

                    <!-- footer  -->
                    <div class="modal-footer">
                        <button
                            class="main-button"
                            @click="emit('close')"
                            ref="closeButton"
                            autofocus
                        >
                            <i class="fas fa-times"></i>
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { onBeforeUnmount, onMounted, ref } from 'vue';

    const emit = defineEmits(['close']);
    /** @type {import('vue').Ref<HTMLElement | null>} */
    const closeButton = ref(null);

    /**
     * Closes the modal when the escape key is pressed.
     * @param {KeyboardEvent} e - The keyboard event.
     */
    const handleKeydown = (e) => {
        if (e.key === 'Escape') {
            emit('close');
        }
    };

    onMounted(() => {
        closeButton.value?.focus();
        document.addEventListener('keydown', handleKeydown);
    });

    onBeforeUnmount(() => {
        document.removeEventListener('keydown', handleKeydown);
    });
</script>
