import { createApp } from 'vue';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import {
    faCopy,
    faLightbulb as faLightbulbRegular,
    faWindowRestore,
} from '@fortawesome/free-regular-svg-icons';
import {
    faChevronCircleRight,
    faDice,
    faExpandArrowsAlt,
    faLightbulb,
    faMoon,
    faRandom,
    faSave,
    faSun,
    faTimes,
    faTrashAlt,
    faVial,
    faWindowMinimize,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { dom, library } from '@fortawesome/fontawesome-svg-core';

import store from './store';

import App from './App.vue';

// Apply saved theme (or system preference) before first render to avoid flash
const savedTheme = localStorage.getItem('theme');
const prefersDark = globalThis.matchMedia(
    '(prefers-color-scheme: dark)',
).matches;
const initialTheme = savedTheme ?? (prefersDark ? 'dark' : 'light');
document.documentElement.dataset['theme'] = initialTheme;
store.commit('SET_THEME', initialTheme);

library.add(
    // brands
    faGithub,
    // regular
    faCopy,
    faLightbulbRegular,
    faWindowRestore,
    // solid
    faChevronCircleRight,
    faDice,
    faExpandArrowsAlt,
    faLightbulb,
    faMoon,
    faRandom,
    faSave,
    faSun,
    faTimes,
    faTrashAlt,
    faVial,
    faWindowMinimize,
);
dom.watch();

const app = createApp(App);
app.use(store);
app.component('font-awesome-icon', FontAwesomeIcon);

app.mount('#app');
