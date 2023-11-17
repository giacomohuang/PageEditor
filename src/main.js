import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'element-plus/theme-chalk/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import Icon from './components/Icon.vue'
import ElementPlus from 'element-plus'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.component('Icon', Icon)
app.use(router)
app.use(ElementPlus)
app.config.performance = true

app.mount('#app')
