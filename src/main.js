import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import installElementPlus from './plugins/element'
import '../node_modules/element-plus/dist/index.css'

import './assets/main.css'
import BaiduMap from 'vue-baidu-map-3x'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(BaiduMap, {
    ak: '98edo3vSG3UhY6lLnN9vr3l3wZPDK1Cj'
})

installElementPlus(app)
app.mount('#app')
