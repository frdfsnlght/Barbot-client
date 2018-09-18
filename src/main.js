import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store/store'
import VueSocketio from 'vue-socket.io-extended';
import io from 'socket.io-client';

import './assets/custom.css'

Vue.config.productionTip = false

Vue.use(VueSocketio, io('http://localhost:8081'), {store});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
