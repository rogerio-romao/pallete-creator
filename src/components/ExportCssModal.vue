<template>
    <!-- overlay  -->
    <div
        class="modal-mask"
        role="dialog"
        aria-modal="true"
        aria-labelledby="export-css-title"
    >
        <div class="modal-wrapper" @click.self="$emit('close')">
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
                    <div class="export-modal-buttons">
                        <button
                            class="secondary-button"
                            @click="changeMode('rgb')"
                            >RGB</button
                        >
                        <button
                            class="secondary-button"
                            @click="changeMode('hex')"
                            >HEX</button
                        >
                        <button
                            class="secondary-button"
                            @click="changeMode('hsl')"
                            >HSL</button
                        >
                        <button
                            class="secondary-button"
                            @click="changeSyntax"
                            >{{ syntaxLabel }}</button
                        >
                    </div>

                    <!-- textarea  -->
                    <div class="code" @click="selectAll">
                        <p class="code-info">Click here to copy</p>
                        <div class="code-wrapper">
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
                <div class="modal-footer export-modal-footer">
                    <button
                        class="main-button"
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
    import { createToast } from 'mosha-vue-toastify';
    import 'mosha-vue-toastify/dist/style.css';
    import { computed, defineEmits, onMounted, onUnmounted, ref } from 'vue';
    import { useStore } from 'vuex';

    const store = useStore();
    const labels = computed(() => store.state.labels);
    const currentScheme = computed(() => store.getters.currentScheme);
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

    const handleKeydown = (e) => {
        if (e.key === 'Escape') {
            emit('close');
        }
    };

    // SCSS / CSS syntax when exporting
    const changeSyntax = () => {
        if (syntax.value === '--clr-') {
            syntax.value = '$clr-';
            syntaxLabel.value = 'CSS';
        } else {
            syntax.value = '--clr-';
            syntaxLabel.value = 'SCSS';
        }
    };

    // RGB / HSL / HEX mode when exporting

    const changeMode = (newMode) => {
        mode.value = newMode;
    };

    // Copying the code to the clipboard

    const selectAll = async () => {
        const text = document.querySelector('.code-wrapper').innerText;
        await navigator.clipboard.writeText(text);
        copied.value = true;
        createToast('CSS copied to clipboard', {
            type: 'success',
            position: 'bottom-right',
            hideProgressBar: true,
        });
    };
</script>
