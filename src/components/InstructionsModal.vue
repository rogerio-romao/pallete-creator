<template>
    <!-- overlay  -->
    <div
        class="modal-mask"
        role="dialog"
        aria-modal="true"
        aria-labelledby="instructions-title"
    >
        <div class="modal-wrapper" @click.self="$emit('close')">
            <div class="modal-container instructions">
                <div class="instructions-wrapper">
                    <!-- header  -->
                    <div class="modal-header">
                        <h3 id="instructions-title">Instructions</h3>
                    </div>

                    <!-- body  -->
                    <div class="modal-body">
                        <p>
                            First generate a main color by using the inputs or
                            the random button. The slots will appear and
                            variations will be generated based on color theory.
                        </p>
                        <p>
                            When you change the main slot, everything else
                            resets and new variations are added. You can click
                            on the variations to select the color, then click on
                            one of the palette slots to paste it.
                        </p>
                        <p>
                            Or press the random scheme button to generate a new
                            scheme from the variations. Then the colors can be
                            adjusted using the sliders.
                        </p>
                        <p>
                            You can then save the scheme (sign in first) or
                            export the css, test the scheme on the page, change
                            color names, test dark and light text, etc...
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
    const closeButton = ref(null);

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
