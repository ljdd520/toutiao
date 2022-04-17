import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 2第二步
// 加载vant(不推荐此方式，引入的包太大)
import Vant from 'vant'
import 'vant/lib/index.css'

// 3第三步
// 自动设置rem基准值（html 标签字体大小）
import 'amfe-flexible'

// 1第一步
// 加载全局样式
import './styles/index'

import dayjs from './utils/dayjs'

const app = createApp(App)
app.config.globalProperties.$dayjs = dayjs
app.use(store).use(router).use(Vant).mount('#app')
