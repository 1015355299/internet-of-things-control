import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '../views/Layout.vue'
import Login from '../views/Login.vue'
import Home from '../views/main/Home.vue'
import Config from '../views/main/Config.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      isPublic: true,
    },
  },
  {
    path: '/',
    name: 'main',
    redirect: '/config',
  },
  {
    path: '/layout',
    name: 'layout',
    component: Layout,
    children:[
      {
        path: '/home',
        name: 'home',
        component: Home,
      },
      {
        path: '/config',
        name: 'config',
        component: Config,
      }
    ]
  },
]

const router = new VueRouter({
  routes,
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 验证登录
  // if (!to.meta.isPublic && !window.sessionStorage.getItem('token')) {
  //   return next('/login')
  // }
  next()
})
export default router
