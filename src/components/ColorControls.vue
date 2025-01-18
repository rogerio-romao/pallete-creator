<template>
    <!-- wrapper  -->
    <div class="color-controls">
        <fieldset>
            <!-- individual H slider  -->
            <div class="control-field">
                <label for="hueControl">H</label>
                <input
                    data-test="hue-input"
                    type="range"
                    name="hue"
                    id="hueControl"
                    min="0"
                    max="360"
                    v-model="h"
                    @input="updateColor"
                />
            </div>

            <!-- individual S slider  -->
            <div class="control-field">
                <label for="satControl">S</label>
                <input
                    data-test="sat-input"
                    type="range"
                    name="sat"
                    id="satControl"
                    min="0"
                    max="100"
                    v-model="s"
                    @input="updateColor"
                />
            </div>

            <!-- individual L slider  -->
            <div class="control-field">
                <label for="lumControl">L</label>
                <input
                    data-test="lum-input"
                    type="range"
                    name="lum"
                    id="lumControl"
                    min="0"
                    max="100"
                    v-model="l"
                    @input="updateColor"
                />
            </div>
        </fieldset>
    </div>
</template>

<script setup>
    import { ref, watchEffect, computed } from 'vue';
    import { useStore } from 'vuex';

    const store = useStore();

    const props = defineProps({
        slotNumber: {
            type: Number,
            default: 1,
        },
    });

    const h = ref(0);
    const s = ref(0);
    const l = ref(0);

    const hsl = computed(() => {
        return props.slotNumber === 1
            ? store.state.mainSlotColor.hsl
            : store.state.slotColors[`slot${props.slotNumber}`].hsl;
    });

    // Populating the sliders with the current color, if any

    watchEffect(() => {
        if (hsl.value) {
            h.value = hsl.value.match(/\d+/g).map(Number)[0];
            s.value = hsl.value.match(/\d+/g).map(Number)[1];
            l.value = hsl.value.match(/\d+/g).map(Number)[2];
        } else {
            h.value = 0;
            s.value = 0;
            l.value = 0;
        }
    });

    // Updating the color in the store after changing the sliders

    const updateColor = () => {
        const newColor = `hsl(${h.value}, ${s.value}%, ${l.value}%)`;
        if (props.slotNumber === 1) {
            store.dispatch('SET_MAIN_COLOR', newColor);
        } else {
            store.dispatch('UPDATE_SLOT_COLOR', {
                slot: props.slotNumber,
                hsl: newColor,
            });
        }
    };
</script>
