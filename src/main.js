import { createApp } from 'vue';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { dom, library } from '@fortawesome/fontawesome-svg-core';

import store from './store';

import App from './App.vue';

library.add(fas);
library.add(fab);
library.add(far);
dom.watch();

const app = createApp(App);
app.use(store);
app.component('font-awesome-icon', FontAwesomeIcon);

app.mount('#app');
