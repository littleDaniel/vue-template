import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'babel-polyfill'
import Es6Promise from 'es6-promise'
import { ajaxRequest } from './common/api/apiPath/index'
import './components/index.js' // 全局基础组件注入
import './assets/css/index.scss' // 全局样式
import './assets/css/iconfont/iconfont.css' // 字体图标样式
// import './assets/css/fonts/fonts.css' // 文字字体
import * as filters from './common/filters' // 全局过滤
import GlobalConstant from './common/constants.js' // 静态字典
import './directive/index' // 自定义指令注入
import VueClipboard from 'vue-clipboard2' // 复制插件
import './permission' // 全局路由守卫
// 解决低版本浏览器不支持es6
Es6Promise.polyfill()

Vue.prototype.$ajaxRequest = ajaxRequest

Vue.prototype.$constant = GlobalConstant
Vue.use(VueClipboard)
// 过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
