import Vue from 'vue'
import Vuex from 'vuex'
import wifi from './modules/wifi'
import drinkOrders from './modules/drinkOrders'
import glasses from './modules/glasses'
import ingredients from './modules/ingredients'
import drinks from './modules/drinks'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        wifi: wifi,
        drinkOrders: drinkOrders,
        ingredients: ingredients,
        glasses: glasses,
        drinks: drinks,
        
    },
    
    state: {
        connected: false,
        options: {},
        error: false,
        errorMsg: false,
        snackbar: false,
        snackbarColor: 'info',
        snackbarText: '',
        isConsole: location.hostname === 'localhost',
        
    },
    
    mutations: {
        socket_connect(state) {
            state.connected = true
        },
        socket_disconnect(state) {
            state.connected = false
        },
        
        socket_clientOptions(state, options) {
            state.options = options
            if (options.isConsole !== 'auto') {
                let newIsConsole = options.isConsole === 'true'
                if (newIsConsole !== state.isConsole) {
                    state.isConsole = newIsConsole
                    console.log('Client is now ' + (state.isConsole ? '' : 'NOT ') + 'running as console.')
                }
            }
        },
        
        setError(state, error) {
            state.errorMsg = error
            state.error = !!error
        },
        
        clearError(state) {
            state.error = false
            state.errorMsg = false
        },
        
        showSnackbar(state, options) {
            state.snackbarText = options.text
            state.snackbarColor = options.color ? options.color : 'info'
            state.snackbar = true
        },
        
        setSnackbar(state, val) {
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
