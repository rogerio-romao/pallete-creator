<template>
    <!-- wrapper   -->
    <section class="mini-slots-pane panel">
        <!-- panel collapsed message  -->
        <p v-if="isMiniPaneCollapsed">Click the arrow to expand panel.</p>
        <div class="hide" v-if="!isMiniPaneCollapsed">
            <!-- header text  -->
            <div class="panel-header">
                <p>
                    Click any variation to copy it, then click on one of the
                    main color slots above to paste it. Or click the randomize
                    button above to generate a full palette.
                </p>
            </div>

            <!-- all the slots  -->
            <div
                class="mini-slots"
                role="listbox"
                aria-label="Color variations"
            >
                <!-- one slot  -->
                <div
                    v-for="(color, i) in colors"
                    :class="[
                        'mini-slot',
                        { 'mini-slot-copied': colorCopied && colorCopiedIndex === i },
                    ]"
                    :key="i"
                    :style="{ backgroundColor: color }"
                    @click="copyColor(color, Number(i))"
                    role="option"
                    :aria-selected="colorCopied && colorCopiedIndex === i"
                    :aria-label="`Color variation ${Number(i) + 1}: ${color}. Click to copy.`"
                ></div>
            </div>
        </div>
    </section>
</template>

<script setup>
    import { computed } from 'vue';
    import { useStore } from 'vuex';

    const { isMiniPaneCollapsed } = defineProps({
        isMiniPaneCollapsed: {
            default: false,
            type: Boolean,
        },
    });

    const store = useStore();

    const colorCopied = computed(() => store.state.copiedColor);
    const colorCopiedIndex = computed(() => store.state.copiedColorIndex);
    const colors = computed(() => store.getters.uniqueColors);

    /**
     * Puts the clicked on variation in memory for pasting.
     * @param {string} color - The color to copy.
     * @param {number} index - The index of the color in the list.
     */
    const copyColor = (color, index) => {
        store.dispatch('COPY_COLOR', { color, index });
    };
</script>
