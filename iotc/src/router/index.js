import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      isPublic: true,
    },
  },
  {
    path: '/',
    name: 'main',
    redirect: '/login'
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
  },
]

const router = new VueRouter({
  routes,
})
router.beforeEach((to, from, next) => {
  if (!to.meta.isPublic && !window.sessionStorage.getItem('token')) {
    return next('/login')
  }
  next()
})
export default router
