import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [{
    path: '/',
    name: 'home',
    component: Home
  }, {
    path: '/drinks',
    name: 'drinks',
    component: () => import(/* webpackChunkName: "drinks" */ './views/Drinks.vue')
  }, {
    path: '/ingredients',
    name: 'ingredients',
    component: () => import(/* webpackChunkName: "ingredients" */ './views/Ingredients.vue')
  }, {
    path: '/glasses',
    name: 'glasses',
    component: () => import(/* webpackChunkName: "glasses" */ './views/Glasses.vue')
  }]
})
