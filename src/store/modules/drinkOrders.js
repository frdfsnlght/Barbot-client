import Vue from 'vue'

export default {
    namespaced: true,
    
    state: {
        items: [],
        item: {},
        loading: false,
        loadedWaiting: false,
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
        
        loadedWaiting(state, items) {
            state.items = items
            state.loading = false
            state.loadedWaiting = true
        },
        
        loadedOne(state, item) {
            state.item = item
            state.loading = false
            state.loadedOne = true
        },
        
        destroy(state) {
            state.items = []
            state.item = {}
            state.loadedWaiting = false
            state.loadedOne = false
        },
        
        socket_drinkOrderSaved(state, item) {
            console.log('drinkOrderSaved')
            if (state.loadedWaiting) {
                let o = state.items.find((e) => { return e.id === item.id })
                if (o) {
                    if (item.startedDate) {
                        let i = state.items.indexOf(o)
                        if (i != -1) {
                            state.items.splice(i, 1)
                        }
                    } else {
                        Object.assign(o, item)
                    }
                } else {
                    if (item.startedDate) return
                    state.items.push(item)
                    this.commit('showSnackbar', {text: 'Drink order submitted'}, {root: true})
                }
            }
            if (state.loadedOne && state.item.id === item.id) {
                if (item.startedDate) {
                    state.item = {}
                } else {
                    Object.assign(state.item, item)
                }
            }
        },

        socket_drinkOrderDeleted(state, item) {
            if (state.loadedWaiting) {
                let o = state.items.find((e) => { return e.id === item.id })
                if (o) {
                    let i = state.items.indexOf(o)
                    if (i != -1) {
                        state.items.splice(i, 1)
                        this.commit('showSnackbar', {text: 'Drink order cancelled'}, {root: true})
                    }
                }
            }
            if (state.loadedOne && state.item.id === item.id) {
                state.item = {}
                this.commit('showSnackbar', {text: 'Drink order cancelled'}, {root: true})
            }
        },

        /*
        socket_drinkOrderStarted(state, item) {
            if (state.loadedWaiting) {
                let o = state.items.find((e) => { return e.id === item.id })
                if (o) {
                    let i = state.items.indexOf(o)
                    if (i != -1) {
                        state.items.splice(i, 1)
                    }
                }
            }
            if (state.loadedOne && state.item.id === item.id) {
                state.item = {}
                this.commit('showSnackbar', {text: 'Drink order started'}, {root: true})
            }
        },
        */
        
    },
    
    actions: {
        
        loadWaiting({commit, state}) {
            if (state.loadedWaiting) return
            commit('loading')
            Vue.prototype.$socket.emit('getWaitingDrinkOrders', (res) => {
                if (res.error) {
                    commit('setError', res.error, {root: true})
                    commit('loadedWaiting', [])
                } else {
                    commit('loadedWaiting', res.items)
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
        
        submit({commit}, item) {
            return new Promise((resolve, reject) => {
                Vue.prototype.$socket.emit('submitDrinkOrder', item, (res) => {
                    if (res.error) {
                        commit('setError', res.error, {root: true})
                        reject()
                    } else {
                        resolve()
                    }
                })
            })
        },
        
        cancel({commit}, item) {
            return new Promise((resolve, reject) => {
                Vue.prototype.$socket.emit('cancelDrinkOrder', item.id, (res) => {
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
