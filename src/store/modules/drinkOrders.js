import Vue from 'vue'

export default {
    namespaced: true,
    
    state: {
        items: [],
        loading: false,
        loaded: false,
    },
    
    getters: {
        sortedItems(state) {
            // TODO: sort based time added and onHold
            return state.items
//            return state.items.slice().sort((a, b) => { })
        }
    },
  
    mutations: {
        loading(state) {
            state.loading = true
            state.loaded = false
            console.log('loading drink orders...')
        },
        
        loaded(state, items) {
            state.items = items
            state.loading = false
            state.loaded = true
            console.log('loaded ' + items.length + ' drink orders')
        },
        
        destroy(state) {
            state.items = []
            state.loaded = false
            console.log('destroyed drink orders')
        },
        
        socket_drinkOrderSaved(state, item) {
            if (! state.loaded) return
            let g = state.items.find((e) => { return e.id === item.id })
            if (g) {
                Object.assign(g, item)
                this.commit('showSnackbar', {text: 'Drink Order updated'}, {root: true})
                console.log('updated drink order ' + item.id)
            } else {
                state.items.push(item)
                this.commit('showSnackbar', {text: 'Drink Order added'}, {root: true})
                console.log('added drink order '  + item.id)
            }
        },

        socket_drinkOrderDeleted(state, item) {
            if (! state.loaded) return
            let g = state.items.find((e) => { return e.id === item.id })
            if (g) {
                let i = state.items.indexOf(g)
                if (i != -1) {
                    state.items.splice(i, 1)
                    this.commit('showSnackbar', {text: 'Drink Order cancelled'}, {root: true})
                    console.log('deleted drink order '  + item.id)
                }
            }
        },

    },
    
    actions: {
        
        load({commit, state}) {
            if (state.loaded) return
            commit('loading')
            Vue.prototype.$socket.emit('getDrinkOrders', (res) => {
                if (res.error) {
                    commit('setError', res.error, {root: true})
                    commit('loaded', [])
                } else {
                    commit('loaded', res.items)
                }
            })
        },
        
        save({commit}, item) {
            return new Promise((resolve, reject) => {
                Vue.prototype.$socket.emit('saveDrinkOrder', item, (res) => {
                    if (res.error) {
                        commit('setError', res.error, {root: true})
                        reject()
                    } else {
                        resolve()
                    }
                })
            })
        },
        
        delete({commit}, item) {
            return new Promise((resolve, reject) => {
                Vue.prototype.$socket.emit('deleteDrinkOrder', item, (res) => {
                    if (res.error) {
                        commit('setError', res.error, {root: true})
                        reject()
                    } else {
                        resolve()
                    }
                })
            })
        },
        
    }
    
}
