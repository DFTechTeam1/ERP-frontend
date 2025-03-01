/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

import { registerComponent } from '@/components/component'

import './assets/main.scss'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// remove console in production
if (import.meta.env.VITE_NODE_ENV == 'production') {
    console.log = function() {}
}

const app = createApp(App)

registerPlugins(app)

registerComponent(app)

app.mount('#app')
