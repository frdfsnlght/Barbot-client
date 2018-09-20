import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store/store'
import VueSocketio from 'vue-socket.io-extended';
import io from 'socket.io-client';

import 'material-design-icons/iconfont/material-icons.css'
import 'typeface-roboto/index.css'

import './assets/custom.css'

var loc = location.href
if (process.env.NODE_ENV === 'development')
    loc = 'http://localhost:8080'

Vue.use(VueSocketio, io(loc), {
        store,
        actionPrefix: 'socket_',
        eventToActionTransformer: (ev) => { return ev },
        mutationPrefix: 'socket_',
        eventToMutationTransformer: (ev) => { return ev },
        });

// eslint-disable-next-line
console.log('Socket.io backend: ' + loc)
        
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

