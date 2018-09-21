import Vue from 'vue'

export default {
    namespaced: true,
    
    state: {
        state: 'n/a',
        networks: [],
        networksLoading: false,
        networksLoaded: false,
    },
    
    getters: {
        sortedNetworks: (state) => {
            return state.networks
        }
    },
  
    mutations: {
        networksLoading(state) {
            state.networksLoading = true
            state.networksLoaded = false
            console.log('loading networks...')
        },
        
        networksLoaded(state, networks) {
            state.networks = networks
            state.networksLoading = false
            state.networksloaded = true
            console.log('loaded ' + networks.length + ' networks')
        },
        
        destroyNetworks(state) {
            state.networks = []
            state.networksLoaded = false
            console.log('destroyed networks')
        },
        
        //SOCKET_WIFISTATE(state, wifi) {
        socket_wifiState(state, wifi) {
            state.state = wifi
        },
        
    },
    
    actions: {
        
        loadNetworks({commit, state}) {
            if (state.networksLoaded) return
            commit('networksLoading')
            Vue.prototype.$socket.emit('getWifiNetworks', (res) => {
                if (res.error) {
                    commit('setError', res.error, {root: true})
                    commit('networksLoaded', [])
                } else {
                    commit('networksLoaded', res.networks)
                }
            })
        },
        
    }
    
}
