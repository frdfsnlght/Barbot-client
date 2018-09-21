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
                if (a.size < b.size) return -1
                if (a.size > b.size) return 1
                if (a.units < b.units) return -1
                if (a.units > b.units) return 1
                if (a.type < b.type) return -1
                if (a.type > b.type) return 1
                return 0
            })
        }
    },
  
    mutations: {
        loading(state) {
            state.loading = true
            state.loaded = false
            console.log('loading glasses...')
        },
        
        loaded(state, items) {
            state.items = items
            state.loading = false
            state.loaded = true
            console.log('loaded ' + items.length + ' glasses')
        },
        
        destroy(state) {
            state.items = []
            state.loaded = false
            console.log('destroyed glasses')
        },
        
        //SOCKET_GLASSSAVED(state, item) {
        socket_glassSaved(state, item) {
            if (! state.loaded) return
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

        //SOCKET_GLASSDELETED(state, item) {
        socket_glassDeleted(state, item) {
            if (! state.loaded) return
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
        
        load({commit, state}) {
            if (state.loaded) return
            commit('loading')
            Vue.prototype.$socket.emit('getGlasses', (res) => {
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
