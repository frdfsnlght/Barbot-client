import Vue from 'vue'

export default {
    namespaced: true,
    
    state: {
        items: [],
        item: {},
        loading: false,
        loadedPending: false,
        loadedOne: false,
    },
    
    getters: {
        sortedItems(state) {
            return state.items.slice().sort((a, b) => {
                if ((! a.userHold) && b.userHold) return -1
                if (a.userHold && (! b.userHold)) return 1
                if ((! a.ingredientHold) && b.ingredientHold) return -1
                if (a.ingredientHold && (! b.ingredientHold)) return 1
                let da = Date.parse(a.createdDate)
                let db = Date.parse(b.createdDate)
                if (da < db) return -1
                if (da > db) return 1
                return a.drink.name.localeCompare(b.drink.name, 'en', {'sensitivity': 'base'})
            })
        }
    },
  
    mutations: {
        loading(state) {
            state.loading = true
        },
        
        loadedPending(state, items) {
            state.items = items
            state.loading = false
            state.loadedPending = true
        },
        
        loadedOne(state, item) {
            state.item = item
            state.loading = false
            state.loadedOne = true
        },
        
        destroy(state) {
            state.items = []
            state.item = {}
            state.loadedPending = false
            state.loadedOne = false
        },
        
        socket_drinkOrderSaved(state, item) {
            if (state.loadedPending) {
                let o = state.items.find((e) => { return e.id === item.id })
                if (o) {
                    Object.assign(o, item)
                    this.commit('showSnackbar', {text: 'Drink order updated'}, {root: true})
                    console.log('updated drink order ' + item.id)
                } else {
                    state.items.push(item)
                    this.commit('showSnackbar', {text: 'Drink order added'}, {root: true})
                    console.log('added drink order '  + item.id)
                }
            }
            if (state.loadedOne && state.item.id === item.id) {
                Object.assign(state.item, item)
                this.commit('showSnackbar', {text: 'Drink order updated'}, {root: true})
            }
        },

        socket_drinkOrderDeleted(state, item) {
            if (state.loadedPending) {
                let o = state.items.find((e) => { return e.id === item.id })
                if (o) {
                    let i = state.items.indexOf(o)
                    if (i != -1) {
                        state.items.splice(i, 1)
                        this.commit('showSnackbar', {text: 'Drink order cancelled'}, {root: true})
                        console.log('deleted drink order '  + item.id)
                    }
                }
            }
            if (state.loadedOne && state.item.id === item.id) {
                state.item = {}
                this.commit('showSnackbar', {text: 'Drink order cancelled'}, {root: true})
            }
        },

    },
    
    actions: {
        
        loadPending({commit, state}) {
            if (state.loadedPending) return
            commit('loading')
            Vue.prototype.$socket.emit('getPendingDrinkOrders', (res) => {
                if (res.error) {
                    commit('setError', res.error, {root: true})
                    commit('loadedPending', [])
                } else {
                    commit('loadedPending', res.items)
                }
            })
        },
        
        loadById({commit, state}, id) {
            if (state.loadedOne) return
            commit('loading')
            Vue.prototype.$socket.emit('getDrinkOrder', id, (res) => {
                if (res.error) {
                    commit('setError', res.error, {root: true})
                    commit('loadedOne', {})
                } else {
                    commit('loadedOne', res.item)
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
                Vue.prototype.$socket.emit('deleteDrinkOrder', item.id, (res) => {
                    if (res.error) {
                        commit('setError', res.error, {root: true})
                        reject()
                    } else {
                        resolve()
                    }
                })
            })
        },
        
        toggleHold({commit}, item) {
            return new Promise((resolve, reject) => {
                Vue.prototype.$socket.emit('toggleDrinkOrderHold', item.id, (res) => {
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
