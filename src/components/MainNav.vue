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
                        data-test="instructions-link"
                        @click="emit('openInstructionsModal')"
                        >Instructions</li
                    >
                    <li
                        data-test="fullscreen-link-minimised"
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
                        data-test="fullscreen-link-maximised"
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

    // function to make the app fullscreen
    const toggleFullscreen = () => {
        const elem = document.documentElement;
        elem.requestFullscreen =
            elem.requestFullscreen ||
            elem.mozRequestFullScreen ||
            elem.webkitRequestFullscreen;
        if (!isFullscreen.value) {
            elem.requestFullscreen();
            isFullscreen.value = true;
        } else {
            document.exitFullscreen();
            isFullscreen.value = false;
        }
    };
</script>
