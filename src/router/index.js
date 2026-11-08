import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import College from '../views/College/College.vue'
import Faculty from '../views/Faculty/Faculty.vue'
import Club from '../views/Club/Club.vue'
import Opensource from '../views/OpenSource/Opensource.vue'
import Contact from '../views/Contact/Contact.vue'
import More from '../views/More/More.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/college', name: 'college', component: College },
  { path: '/faculty', name: 'faculty', component: Faculty },
  { path: '/club', name: 'club', component: Club },
  { path: '/opensource', name: 'opensource', component: Opensource },
  { path: '/contact', name: 'contact', component: Contact },
  { path: '/more', name: 'more', component: More },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
