import './style.css'

import { createApp } from 'vue'

import { VueResponsiveness } from '../lib'
import App from './App.vue'

createApp(App).use(VueResponsiveness).mount('#app')
