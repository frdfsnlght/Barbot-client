import Vue from 'vue'
import Vuex from 'vuex'
import wifi from './modules/wifi'
import drinkOrders from './modules/drinkOrders'
import glasses from './modules/glasses'
import ingredients from './modules/ingredients'
import drinks from './modules/drinks'
import drinksMenu from './modules/drinksMenu'
import pumps from './modules/pumps'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        wifi: wifi,
        drinkOrders: drinkOrders,
        ingredients: ingredients,
        glasses: glasses,
        drinks: drinks,
        drinksMenu: drinksMenu,
        pumps: pumps,
        
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
        dispenserHold: false,
        dispenserState: 'idle',
        pumpSetup: false,
        dispensingDrink: {},
        glassReady: true,
        
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
        
        socket_dispenserHold(state, dispenserHold) {
            state.dispenserHold = dispenserHold
        },
    
        socket_dispenserState(state, dispenserState) {
            state.dispenserState = dispenserState
        },
    
        socket_pumpSetup(state, pumpSetup) {
            state.pumpSetup = pumpSetup
        },

        socket_dispensingDrinkOrder(state, drink) {
            state.dispensingDrink = drink
        },
    
        // eslint-disable-next-line
        socket_drinkOrderCompleted(state, drink) {
            state.dispensingDrink = {}
            
        },

        socket_glassReady(state, glassReady) {
            state.glassReady = glassReady
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
        
        toggleDispenserHold({commit}) {
            Vue.prototype.$socket.emit('toggleDispenserHold', (res) => {
                if (res.error) {
                    commit('setError', res.error)
                }
            })
        },

        startPumpSetup({commit}) {
            Vue.prototype.$socket.emit('startPumpSetup', (res) => {
                if (res.error) {
                    commit('setError', res.error)
                }
            })
        },

        stopPumpSetup({commit}) {
            Vue.prototype.$socket.emit('stopPumpSetup', (res) => {
                if (res.error) {
                    commit('setError', res.error)
                }
            })
        },



        
        /*
        isConnected({state}) {
            if (state.connected) return true
            state.notConnected = true
            return false
        }
        */
    }
    
})
