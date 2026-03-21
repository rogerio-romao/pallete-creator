// This component is a modal dialog that allows users to export their color
palette as CSS code. It provides options to choose the color format (RGB, HEX,
HSL) and syntax (CSS or SCSS). The modal also includes functionality to copy the
generated CSS code to the clipboard and displays a toast notification upon
successful copying.

<template>
    <!-- overlay  -->
    <div
        class="modal-mask modal-export"
        role="dialog"
        aria-modal="true"
        aria-labelledby="export-css-title"
        @click.self="$emit('close')"
    >
        <div class="modal-wrapper" data-testid="modal-wrapper">
            <div class="modal-container">
                <!-- header  -->
                <div class="modal-header">
                    <h3 id="export-css-title">
                        Export CSS
                        <small>- choose color mode</small>
                    </h3>
                </div>

                <!-- body  -->
                <div class="modal-body">
                    <!-- buttons  -->
                    <div class="modal-buttons">
                        <button
                            class="secondary-button"
                            data-testid="rgb-button"
                            @click="changeMode('rgb')"
                            >RGB</button
                        >
                        <button
                            class="secondary-button"
                            data-testid="hex-button"
                            @click="changeMode('hex')"
                            >HEX</button
                        >
                        <button
                            class="secondary-button"
                            data-testid="hsl-button"
                            @click="changeMode('hsl')"
                            >HSL</button
                        >
                        <button
                            class="secondary-button"
                            data-testid="syntax-toggle"
                            @click="changeSyntax"
                            >{{ syntaxLabel }}</button
                        >
                    </div>

                    <!-- textarea  -->
                    <div
                        class="modal-code"
                        data-testid="modal-code"
                        @click="selectAll"
                    >
                        <p class="modal-code-info">Click here to copy</p>
                        <div class="code-wrapper" data-testid="code-wrapper">
                            <p
                                v-for="(label, i) in labels"
                                :key="i"
                                class="pre"
                            >
                                {{ syntax }}{{ label.toLowerCase() }}:
                                {{ currentScheme[i][mode] }};
                            </p>
                        </div>
                    </div>
                </div>

                <!-- footer  -->
                <div class="modal-footer">
                    <button
                        class="secondary-button"
                        data-testid="close-button"
                        @click="$emit('close')"
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
</template>

<script setup>
    // oxlint-disable-next-line import/no-unassigned-import
    import 'mosha-vue-toastify/dist/style.css';

    import { createToast } from 'mosha-vue-toastify';
    import { useStore } from 'vuex';
    import { computed, onMounted, onUnmounted, ref } from 'vue';

    const store = useStore();
    const labels = computed(() => store.state.labels);
    const currentScheme = computed(() => store.getters.currentScheme);

    /** @type {import('vue').Ref<HTMLElement | null>} */
    const closeButton = ref(null);

    const emit = defineEmits(['close']);

    const copied = ref(false);
    const mode = ref('hsl');
    const syntax = ref('--clr-');
    const syntaxLabel = ref('SCSS');

    onMounted(() => {
        closeButton.value?.focus();
        document.addEventListener('keydown', handleKeydown);
    });

    onUnmounted(() => {
        document.removeEventListener('keydown', handleKeydown);
    });

    /**
     * Toggles the syntax between CSS and SCSS for the exported code.
     */
    const changeSyntax = () => {
        if (syntax.value === '--clr-') {
            syntax.value = '$clr-';
            syntaxLabel.value = 'CSS';
        } else {
            syntax.value = '--clr-';
            syntaxLabel.value = 'SCSS';
        }
    };

    /**
     * Changes the color mode for the exported CSS.
     * @param {'rgb' | 'hex' | 'hsl'} newMode - The new color mode to use in the export (e.g. 'rgb', 'hex', 'hsl').
     */
    const changeMode = (newMode) => {
        mode.value = newMode;
    };

    /**
     * Closes the modal when the escape key is pressed.
     * @param {KeyboardEvent} e - The keyboard event.
     */
    const handleKeydown = (e) => {
        if (e.key === 'Escape') {
            emit('close');
        }
    };

    /**
     * Copies the exported CSS code to the clipboard and shows a toast notification.
     */
    const selectAll = async () => {
        const text = document.querySelector('.code-wrapper')?.textContent;
        await navigator.clipboard.writeText(text ?? '');
        copied.value = true;

        createToast('CSS copied to clipboard', {
            hideProgressBar: true,
            position: 'bottom-right',
            type: 'success',
        });
    };
</script>
