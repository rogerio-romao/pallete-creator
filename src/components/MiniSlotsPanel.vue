// This component is the mini slots panel that displays color variations based
on the main color. Users can click on any variation to copy it, and then paste
it into one of the color slots in the palette panel. The panel can be collapsed
or expanded.

<template>
    <!-- wrapper   -->
    <section class="mini-slots-pane" data-testid="expanded-panel">
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
                    {
                        'mini-slot-copied':
                            colorCopied && colorCopiedIndex === i,
                    },
                ]"
                :data-testid="`mini-slot-${i}`"
                :key="i"
                :style="{ backgroundColor: color }"
                @click="copyColor(color, Number(i))"
                role="option"
                :aria-selected="colorCopied && colorCopiedIndex === i"
                :aria-label="`Color variation ${Number(i) + 1}: ${color}. Click to copy.`"
            ></div>
        </div>
    </section>
</template>

<script setup>
    import { computed } from 'vue';
    import { useStore } from 'vuex';

    const store = useStore();

    const colorCopied = computed(() => store.state.copiedColor);
    const colorCopiedIndex = computed(() => store.state.copiedColorIndex);
    const colors = computed(() => store.getters.uniqueColors);

    /**
     * Puts the clicked on variation in memory for pasting, or clears it if already selected.
     * @param {string} color - The color to copy.
     * @param {number} index - The index of the color in the list.
     */
    const copyColor = (color, index) => {
        if (colorCopied.value === color && colorCopiedIndex.value === index) {
            store.dispatch('CLEAR_COPIED_COLOR');
        } else {
            store.dispatch('COPY_COLOR', { color, index });
        }
    };
</script>
