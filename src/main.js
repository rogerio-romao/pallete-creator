import { createApp } from 'vue'
import App from './App.vue'

import store from './store'

import { library, dom } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'

library.add(fas)
library.add(fab)
library.add(far)
dom.watch()

const app = createApp(App)
app.use(store)
app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')
