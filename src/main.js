import { createApp } from 'vue'
import App from './App.vue'

import { library, dom } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

library.add(fas)
library.add(fab)
dom.watch()

const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')
