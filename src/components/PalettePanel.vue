// This component represents the palette panel, which contains multiple color
slots. It displays a header with instructions and a list of PaletteColorSlot
components. The panel can be collapsed or expanded based on the
isColorPaneCollapsed prop, allowing users to manage their color palette
effectively.

<template>
    <!-- wrapper  -->
    <section class="palette-pane panel">
        <!-- panel collapsed message  -->
        <p v-if="isColorPaneCollapsed">Click the arrow to expand panel.</p>
        <div
            class="hide"
            data-testid="palette-panel-hide"
            v-if="!isColorPaneCollapsed"
        >
            <!-- header  -->
            <div class="panel-header">
                <p>
                    Setting main color resets everything. Edit color labels and
                    adjust color properties with the controls. Scroll down for
                    variations.
                </p>
            </div>

            <!-- individual slots  -->
            <div class="palette-slots" data-testid="palette-slots">
                <template v-for="i in 5" :key="i">
                    <PaletteColorSlot :slotNumber="i" />
                </template>
            </div>
        </div>
    </section>
</template>

<script setup>
    import PaletteColorSlot from './PaletteColorSlot.vue';

    const { isColorPaneCollapsed } = defineProps({
        isColorPaneCollapsed: {
            default: false,
            type: Boolean,
        },
    });
</script>
