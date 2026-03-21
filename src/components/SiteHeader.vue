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
                    <!-- instructions -->
                    <li
                        data-testid="instructions-link"
                        @click="emit('openInstructionsModal')"
                        >Instructions</li
                    >
                    <!-- github link -->
                    <li data-tooltip="Star this repo">
                        <a
                            href="https://github.com/rogerio-romao/pallete-creator"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Star this repo"
                        >
                            <font-awesome-icon :icon="['fab', 'github']" />
                        </a>
                    </li>
                    <!-- theme toggle -->
                    <li
                        data-testid="theme-toggle"
                        :class="{ 'theme-toggle-disabled': isTesting }"
                        :title="
                            isTesting
                                ? 'Reset site colors before switching themes'
                                : isDark
                                  ? 'Switch to light mode'
                                  : 'Switch to dark mode'
                        "
                        @click="!isTesting && toggleTheme()"
                    >
                        <font-awesome-icon :icon="isDark ? 'sun' : 'moon'" />
                    </li>
                    <!-- fullscreen toggle -->
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
    import { useStore } from 'vuex';
    import { computed, ref } from 'vue';

    const emit = defineEmits(['openInstructionsModal']);

    const store = useStore();

    const isFullscreen = ref(false);

    const isDark = computed(() => store.state.theme === 'dark');
    const isTesting = computed(() => store.state.isTestingColorScheme);

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

    /**
     * Toggles between dark and light mode, persisting the choice to localStorage.
     * Also resets text color to the appropriate default for the new theme.
     */
    const toggleTheme = () => {
        const next = store.state.theme === 'dark' ? 'light' : 'dark';
        store.commit('SET_THEME', next);
        document.documentElement.dataset['theme'] = next;
        localStorage.setItem('theme', next);
        // 'light' text on dark bg, 'dark' text on light bg
        const textType = next === 'dark' ? 'light' : 'dark';
        store.dispatch('SET_TEXT_COLOR', textType);
        document.documentElement.style.removeProperty('--text-color');
    };
</script>
