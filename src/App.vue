<template>
    <!-- NAV  -->
    <SiteHeader @openInstructionsModal="showInstructionsModal = true" />

    <!-- MAIN  -->
    <main>
        <!-- main color control bar  -->
        <h2>
            Set Main Color
            <span
                class="section-info"
                data-tooltip="Click random color or use the inputs to start your color scheme."
                >i</span
            >
        </h2>
        <MainColorChooserBar />

        <!-- utility buttons  -->
        <div v-if="showUtilityButtons">
            <UtilityButtonsPanel
                @copyPalette="showCopyModal = true"
                @savePalette="showSaveModal = true"
            />
        </div>

        <!-- color pallete pane  -->
        <div v-if="mainHSL">
            <h2>
                Palette
                <span
                    class="section-info"
                    data-tooltip="Setting main color resets everything. Edit color labels and adjust color properties with the controls below each slot."
                    >i</span
                >
            </h2>
            <PalettePanel />
        </div>

        <!-- mini slots / variations  -->
        <div v-if="uniqueColors.size">
            <h2>
                Variations
                <span
                    class="section-info"
                    data-tooltip="Click any variation to copy it, then click on one of the main color slots above to paste it. Or click Randomize to generate a full palette."
                    >i</span
                >
            </h2>
            <MiniSlotsPanel />
        </div>

        <!-- saved palletes -->
        <div v-if="savedPalettes.length > 0">
            <h2>
                Saved Palettes
                <span
                    class="section-info"
                    data-tooltip="Any palettes you save will appear here. Clicking on one will load it on the color slots for editing or exporting the CSS."
                    >i</span
                >
            </h2>
            <SavedPalettesPanel />
        </div>
    </main>
    <!-- END MAIN  -->

    <!-- MODALS  -->

    <!-- instructions modal -->
    <transition name="modal">
        <Instructions
            v-if="showInstructionsModal"
            @close="showInstructionsModal = false"
        />
    </transition>

    <!-- copy modal -->
    <transition name="modal">
        <ExportCssModal v-if="showCopyModal" @close="showCopyModal = false" />
    </transition>

    <!-- save modal -->
    <transition name="modal">
        <SavePaletteModal v-if="showSaveModal" @close="showSaveModal = false" />
    </transition>
</template>

<script setup>
    // oxlint-disable-next-line import/no-unassigned-import
    import 'mosha-vue-toastify/dist/style.css';

    import { createToast } from 'mosha-vue-toastify';
    import { useStore } from 'vuex';
    import { computed, onMounted, ref } from 'vue';

    import ExportCssModal from './components/ExportCssModal.vue';
    import Instructions from './components/InstructionsModal.vue';
    import MainColorChooserBar from './components/MainColorChooserBar.vue';
    import MiniSlotsPanel from './components/MiniSlotsPanel.vue';
    import PalettePanel from './components/PalettePanel.vue';
    import SavedPalettesPanel from './components/SavedPalettesPanel.vue';
    import SavePaletteModal from './components/SavePaletteModal.vue';
    import SiteHeader from './components/SiteHeader.vue';
    import UtilityButtonsPanel from './components/UtilityButtonsPanel.vue';

    const store = useStore();

    onMounted(async () => {
        try {
            await store.dispatch('LOAD_PALETTES');
        } catch {
            createToast('Failed to load palettes. Please try again.', {
                hideProgressBar: true,
                position: 'bottom-right',
                type: 'danger',
            });
        }
    });

    const showCopyModal = ref(false);
    const showSaveModal = ref(false);
    const showInstructionsModal = ref(false);

    const mainHSL = computed(() => store.state.mainHSL);
    const uniqueColors = computed(() => store.getters.uniqueColors);
    const savedPalettes = computed(() => store.state.savedPalettes);
    const showUtilityButtons = computed(() => store.getters.uniqueColors.size);

    defineExpose({
        showCopyModal,
        showInstructionsModal,
        showSaveModal,
    });
</script>

<style>
    @import url('./style/app.css');
</style>
