import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/style.css'
import axios from 'axios'

Vue.config.productionTip = false

Vue.prototype.$http = axios.create({
  baseURL: process.env.VUE_APP_API_URL || "/wlw/api"
  //baseURL: 'http://localhost:3333/wlw/api',
})

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app')
