// This component is the site header that includes the logo, title, and
navigation links. It also contains the functionality to toggle fullscreen mode
and open the instructions modal.

<template>
    <header>
        <nav>
            <!-- left side logo and brand  -->
            <div class="brand">
                <span>
                    <img src="../assets/logo.png" alt="logo" id="logo" />
                </span>
                <span class="title">Color Palette Creator</span>
            </div>

            <!-- right side nav  -->
            <div class="nav-links">
                <ul>
                    <li
                        data-testid="instructions-link"
                        @click="emit('openInstructionsModal')"
                        >Instructions</li
                    >
                    <li
                        data-testid="fullscreen-link-minimised"
                        v-if="!isFullscreen"
                        @click="toggleFullscreen"
                        title="Toggle FullScreen"
                    >
                        <i class="fas fa-expand-arrows-alt"></i>
                    </li>
                    <li
                        v-else
                        @click="toggleFullscreen"
                        title="Toggle FullScreen"
                        data-testid="fullscreen-link-maximised"
                    >
                        <i class="fas fa-window-minimize"></i>
                    </li>
                </ul>
            </div>
        </nav>
    </header>
</template>

<script setup>
    import { ref } from 'vue';

    const emit = defineEmits(['openInstructionsModal']);

    const isFullscreen = ref(false);

    /**
     * Toggles the browser's fullscreen mode.
     */
    const toggleFullscreen = () => {
        const elem = document.documentElement;
        if (isFullscreen.value) {
            document.exitFullscreen();
            isFullscreen.value = false;
        } else {
            elem.requestFullscreen();
            isFullscreen.value = true;
        }
    };
</script>
