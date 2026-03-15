<template>
    <!-- wrapper  -->
    <section class="palette-pane panel">
        <!-- panel collapsed message  -->
        <p v-if="isColorPaneCollapsed">Click the arrow to expand panel.</p>
        <div class="hide" v-if="!isColorPaneCollapsed">
            <!-- header  -->
            <div class="panel-header">
                <p>
                    Setting main color resets everything. Edit color labels and
                    adjust color properties with the controls. Scroll down for
                    variations.
                </p>
            </div>

            <!-- individual slots  -->
            <div class="palette-pane-slots">
                <template v-for="i in 5" :key="i">
                    <ColorSlot :slotNumber="i" />
                </template>
            </div>
        </div>
    </section>
</template>

<script setup>
    import ColorSlot from './ColorSlot.vue';

    const { isColorPaneCollapsed } = defineProps({
        isColorPaneCollapsed: {
            default: false,
            type: Boolean,
        },
    });
</script>
