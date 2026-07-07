import './style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// PrimeVue
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'

// Prime Icons
import 'primeicons/primeicons.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// PrimeVue
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
})

app.mount('#app')
