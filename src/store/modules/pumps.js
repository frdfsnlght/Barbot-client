import Vue from 'vue'

export default {
    namespaced: true,
    
    state: {
        items: [],
        loading: false,
        loadedAll: false,
    },
    
    getters: {
        sortedItems(state) {
            return state.items.slice().sort((a, b) => {
                return a.id - b.id
                //return a.name.localeCompare(b.name, 'en', {'sensitivity': 'base'})
            })
        },
        anyPumpRunning(state) {
            let i = state.items.find((e) => { return !!e.substate })
            console.log('anyPumpRunning: ' + i)
            // TODO: this is getting recalced when a pump is updated
            return !!i
        },
    },
  
    mutations: {
        loading(state) {
            state.loading = true
        },
        
        loadedAll(state, items) {
            state.items = items
            state.loading = false
            state.loadedAll = true
        },
        
        destroy(state) {
            state.items = []
            state.item = {}
            state.loadedAll = false
        },
        
        socket_pumpSaved(state, item) {
            if (state.loadedAll) {
                let i = state.items.find((e) => { return e.id === item.id })
                if (i) {
                    Object.assign(i, item)
                    //this.commit('showSnackbar', {text: 'Pump updated'}, {root: true})
                    console.log('updated pump ' + item.id)
                    console.dir(item)
                }
            }
        },

    },
    
    actions: {
        
        loadAll({commit, state}) {
            if (state.loadedAll) return
            commit('loading')
            Vue.prototype.$socket.emit('getPumps', (res) => {
                if (res.error) {
                    commit('setError', res.error, {root: true})
                    commit('loadedAll', [])
                } else {
                    commit('loadedAll', res.items)
                }
            })
        },
        
    }
    
}
