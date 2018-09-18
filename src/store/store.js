import Vue from 'vue'
import Vuex from 'vuex'
import glasses from './modules/glasses'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        glasses: glasses
        
    },
    
    state: {
        connected: false,
        error: false,
        errorMsg: false,
        snackbar: false,
        snackbarColor: 'info',
        snackbarText: ''
        
    },
    
    mutations: {
        SOCKET_CONNECT: (state) => {
            state.connected = true
        },
        SOCKET_DISCONNECT: (state) => {
            state.connected = false
        },
        
        setError: (state, error) => {
            state.errorMsg = error
            state.error = !!error
        },
        
        clearError: (state) => {
            state.error = false
            state.errorMsg = false
        },
        
        showSnackbar: (state, options) => {
            state.snackbarText = options.text
            state.snackbarColor = options.color ? options.color : 'info'
            state.snackbar = true
            console.log('show snackbar')
        },
        
        setSnackbar: (state, val) => {
            state.snackbar = val
        },
        
    },
    
    actions: {
        
        /*
        isConnected({state}) {
            if (state.connected) return true
            state.notConnected = true
            return false
        }
        */
    }
    
})
