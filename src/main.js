import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import naive from 'naive-ui'
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import axios from 'axios'
import store from './store/index'

const app = createApp(App)
app.use(router)
app.use(store)
app.use(ElementPlus)
app.use(ElementPlusIconsVue)
app.use(naive)
app.mount('#app')

axios.defaults.baseUrl = '/' //base_url
//vue3.0取消了Vue.prototype，官方文档推荐使用globalProperties
app.config.globalProperties.$http = axios