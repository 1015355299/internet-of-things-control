import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/style.css'
import axios from 'axios'
import * as echarts from 'echarts'

Vue.prototype.$echarts = echarts

Vue.config.productionTip = false

Vue.prototype.$http = axios.create({
  baseURL: process.env.NODE_ENV === "production" ? 'https://wlw.5102it.cn' : 'https://wlw.5102it.cn'
  // baseURL: 'http://localhost',
  // baseURL: 'http://wlw.5102it.cn',
})

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app')
