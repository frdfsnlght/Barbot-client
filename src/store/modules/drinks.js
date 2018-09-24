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
            return state.items.slice().sort((a, b) => {
                if (a.primaryName < b.primaryName) return -1
                if (a.primaryName > b.primaryName) return 1
                if (a.secondaryName < b.secondaryName) return -1
                if (a.secondaryName > b.secondaryName) return 1
                return 0
            })
        }
    },
  
    mutations: {
        loading(state) {
            state.loading = true
            state.loaded = false
            console.log('loading drinks...')
        },
        
        loaded(state, items) {
            state.items = items
            state.loading = false
            state.loaded = true
            console.log('loaded ' + items.length + ' drinks')
        },
        
        destroy(state) {
            state.items = []
            state.loaded = false
            console.log('destroyed drinks')
        },
        
        socket_drinkSaved(state, item) {
            if (! state.loaded) return
            let g = state.items.find((e) => { return e.id === item.id })
            if (g) {
                Object.assign(g, item)
                this.commit('showSnackbar', {text: 'Drink updated'}, {root: true})
                console.log('updated drink ' + item.id)
            } else {
                state.items.push(item)
                this.commit('showSnackbar', {text: 'Drink added'}, {root: true})
                console.log('added drink '  + item.id)
            }
        },

        socket_drinkDeleted(state, item) {
            if (! state.loaded) return
            let g = state.items.find((e) => { return e.id === item.id })
            if (g) {
                let i = state.items.indexOf(g)
                if (i != -1) {
                    state.items.splice(i, 1)
                    this.commit('showSnackbar', {text: 'Drink deleted'}, {root: true})
                    console.log('deleted drink '  + item.id)
                }
            }
        },

    },
    
    actions: {
        
        load({commit, state}) {
            if (state.loaded) return
            commit('loading')
            Vue.prototype.$socket.emit('getDrinks', (res) => {
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
                Vue.prototype.$socket.emit('saveDrink', item, (res) => {
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
                Vue.prototype.$socket.emit('deleteDrink', item, (res) => {
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
