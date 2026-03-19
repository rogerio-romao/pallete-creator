<template>
    <!-- NAV  -->
    <SiteHeader @openInstructionsModal="showInstructionsModal = true" />

    <!-- MAIN  -->
    <main>
        <!-- main color control bar  -->
        <h2>Set Main Color</h2>
        <p class="description"
            >Click random color or use the inputs to start your color scheme.</p
        >
        <MainColorChooserBar />

        <!-- utility buttons  -->
        <div v-if="showUtilityButtons">
            <h2>Utilities</h2>
            <UtilityButtons
                @copyPalette="showCopyModal = true"
                @savePalette="showSaveModal = true"
            />
        </div>

        <!-- color pallete pane  -->
        <div v-if="mainHSL">
            <h2>
                Build your palette
                <span
                    class="collapse"
                    data-testid="color-pane-collapse"
                    title="Click to collapse"
                    @click="collapseColorPane"
                    role="button"
                    :aria-expanded="!isColorPaneCollapsed"
                    aria-label="Collapse color pane"
                >
                    <span
                        class="chevron-wrapper"
                        :class="{ expanded: !isColorPaneCollapsed }"
                    >
                        <i class="fas fa-chevron-right"></i>
                    </span>
                </span>
            </h2>
            <PalettePanel :isColorPaneCollapsed="isColorPaneCollapsed" />
        </div>

        <!-- mini slots / variations  -->
        <div v-if="uniqueColors.size">
            <h2>
                Pick your variations
                <span
                    class="collapse"
                    data-testid="mini-pane-collapse"
                    title="Click to collapse"
                    @click="collapseMiniPane"
                    role="button"
                    :aria-expanded="!isMiniPaneCollapsed"
                    aria-label="Collapse variations pane"
                >
                    <span
                        class="chevron-wrapper"
                        :class="{ expanded: !isMiniPaneCollapsed }"
                    >
                        <i class="fas fa-chevron-right"></i>
                    </span>
                </span>
            </h2>
            <MiniSlotsPanel :isMiniPaneCollapsed="isMiniPaneCollapsed" />
        </div>

        <!-- saved palletes -->
        <div v-if="savedPalettes.length > 0">
            <h2>
                Saved Palettes
                <span
                    class="collapse"
                    data-testid="saved-pane-collapse"
                    title="Click to collapse"
                    @click="collapseSavedPane"
                    role="button"
                    :aria-expanded="!isSavedPaneCollapsed"
                    aria-label="Collapse saved palettes pane"
                >
                    <span
                        class="chevron-wrapper"
                        :class="{ expanded: !isSavedPaneCollapsed }"
                    >
                        <i class="fas fa-chevron-right"></i>
                    </span>
                </span>
            </h2>
            <SavedPalettes :isSavedPaneCollapsed="isSavedPaneCollapsed" />
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
        <CopyModal v-if="showCopyModal" @close="showCopyModal = false" />
    </transition>

    <!-- save modal -->
    <transition name="modal">
        <SaveModal v-if="showSaveModal" @close="showSaveModal = false" />
    </transition>
</template>

<script setup>
    // oxlint-disable-next-line import/no-unassigned-import
    import 'mosha-vue-toastify/dist/style.css';

    import { createToast } from 'mosha-vue-toastify';
    import { useStore } from 'vuex';
    import { computed, onMounted, ref } from 'vue';

    import CopyModal from './components/ExportCssModal.vue';
    import Instructions from './components/InstructionsModal.vue';
    import MainColorChooserBar from './components/MainColorChooserBar.vue';
    import MiniSlotsPanel from './components/MiniSlotsPanel.vue';
    import PalettePanel from './components/PalettePanel.vue';
    import SavedPalettes from './components/SavedPalettes.vue';
    import SaveModal from './components/SaveModal.vue';
    import SiteHeader from './components/SiteHeader.vue';
    import UtilityButtons from './components/UtilityButtons.vue';

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

    const isColorPaneCollapsed = ref(false);
    const isMiniPaneCollapsed = ref(false);
    const isSavedPaneCollapsed = ref(false);

    const mainHSL = computed(() => store.state.mainHSL);
    const uniqueColors = computed(() => store.getters.uniqueColors);
    const savedPalettes = computed(() => store.state.savedPalettes);
    const showUtilityButtons = computed(() => store.getters.uniqueColors.size);

    const collapseColorPane = () => {
        isColorPaneCollapsed.value = !isColorPaneCollapsed.value;
    };

    const collapseMiniPane = () => {
        isMiniPaneCollapsed.value = !isMiniPaneCollapsed.value;
    };

    const collapseSavedPane = () => {
        isSavedPaneCollapsed.value = !isSavedPaneCollapsed.value;
    };

    // This is needed to make the collapse state of the panes available to the tests
    defineExpose({
        isColorPaneCollapsed,
        isMiniPaneCollapsed,
        isSavedPaneCollapsed,
    });
</script>

<style>
    @import url('./style/app.css');
</style>
