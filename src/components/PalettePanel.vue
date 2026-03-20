// This component represents the palette panel, which contains multiple color
slots. It displays a header with instructions and a list of PaletteColorSlot
components. The panel can be collapsed or expanded based on the
isColorPaneCollapsed prop, allowing users to manage their color palette
effectively.

<template>
    <!-- wrapper  -->
    <section class="palette-pane" data-testid="palette-panel-hide">
        <!-- individual slots  -->
        <div class="palette-slots" data-testid="palette-slots">
            <template v-for="i in 5" :key="i">
                <PaletteColorSlot :slotNumber="i" />
            </template>
        </div>
    </section>
</template>

<script setup>
    import PaletteColorSlot from './PaletteColorSlot.vue';
</script>
