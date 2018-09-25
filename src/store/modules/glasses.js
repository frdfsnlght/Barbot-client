import Vue from 'vue'

export default {
    namespaced: true,
    
    state: {
        items: [],
        item: null,
        loading: false,
        loadedAll: false,
        loadedOne: false,
    },
    
    getters: {
        sortedItems(state) {
            return state.items.slice().sort((a, b) => {
                if (a.size < b.size) return -1
                if (a.size > b.size) return 1
                if (a.units < b.units) return -1
                if (a.units > b.units) return 1
                return a.type.localeCompare(b.type, 'en', {'sensitivity': 'base'})
            })
        }
    },
  
    mutations: {
        loading(state) {
            state.loading = true
//            state.loaded = false
//            console.log('loading glasses...')
        },
        
        loadedAll(state, items) {
            state.items = items
            state.loading = false
            state.loadedAll = true
//            console.log('loaded ' + items.length + ' glasses')
        },
  
        loadedOne(state, item) {
            state.item = item
            state.loading = false
            state.loadedOne = true
//            console.log('loaded ' + items.length + ' glasses')
        },

        destroy(state) {
            state.items = []
            state.item = null
            state.loadedAll = false
            state.loadedOne = false
//            console.log('destroyed glasses')
        },
        
        socket_glassSaved(state, item) {
            if (! state.loadedAll) return
            let g = state.items.find((e) => { return e.id === item.id })
            if (g) {
                Object.assign(g, item)
                this.commit('showSnackbar', {text: 'Glass updated'}, {root: true})
                console.log('updated glass ' + item.id)
            } else {
                state.items.push(item)
                this.commit('showSnackbar', {text: 'Glass added'}, {root: true})
                console.log('added glass '  + item.id)
            }
        },

        socket_glassDeleted(state, item) {
            if (! state.loadedAll) return
            let g = state.items.find((e) => { return e.id === item.id })
            if (g) {
                let i = state.items.indexOf(g)
                if (i != -1) {
                    state.items.splice(i, 1)
                    this.commit('showSnackbar', {text: 'Glass deleted'}, {root: true})
                    console.log('deleted glass '  + item.id)
                }
            }
        },

    },
    
    actions: {
        
        loadAll({commit, state}) {
            if (state.loadedAll) return
            commit('loading')
            Vue.prototype.$socket.emit('getGlasses', (res) => {
                if (res.error) {
                    commit('setError', res.error, {root: true})
                    commit('loadedAll', [])
                } else {
                    commit('loadedAll', res.items)
                }
            })
        },
        
        loadById({commit, state}, id) {
            if (state.loadedOne) return
            commit('loading')
            Vue.prototype.$socket.emit('getGlass', id, (res) => {
                if (res.error) {
                    commit('setError', res.error, {root: true})
                    commit('loadedOne', null)
                } else {
                    commit('loadedOne', res.item)
                }
            })
        },
        
        save({commit}, item) {
            return new Promise((resolve, reject) => {
                Vue.prototype.$socket.emit('saveGlass', item, (res) => {
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
                Vue.prototype.$socket.emit('deleteGlass', item, (res) => {
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
