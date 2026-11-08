import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import More from '../views/More.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/more', name: 'more', component: More },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
