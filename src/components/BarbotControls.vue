<template>

      <v-layout column class="purple">
          <v-card flat class="text-xs-center">
            
            <div v-if="dispenserState.state == 'idle'" class="display-2 ma-3">
              Waiting for a drink order
            </div>
            
            <div v-if="dispenserState.state == 'waitStart'" class="display-2 ma-3">
            
              <p v-if="!glassReady" class="red--text">Place a {{dispenserState.order.drink.glass.name}} glass in the dispensing area.</p>
              
              <v-btn
                color="primary"
                large
                class="px-5"
                :loading="!glassReady"
                :disabled="!glassReady || started"
                @click="startDispensing(true)"
              >
                start
                <span slot="loader">Waiting...</span>
              </v-btn>

              <v-btn
                color="primary"
                large
                class="px-5"
                @click="startDispensing(false)"
              >
                cancel
              </v-btn>
              
            </div>
            
            <div v-if="dispenserState.state == 'dispensing'" class="display-2 ma-3">
              Dispensing {{dispenserState.order.drink.name}} for {{dispenserState.order.name}}
            </div>
            
            <div v-if="dispenserState.state == 'waitPickup'" class="display-2 ma-3">
              Drink is complete. Please remove the glass from the dispensing area.
            </div>
            
          </v-card>
          <v-card flat class="text-xs-center">
              <span
                v-for="p in pumps"
                :key="p.id"
              >
                <v-icon v-if="p.running">mdi-refresh</v-icon>
                <v-icon v-else-if="!p.state">mdi-close-circle-outline</v-icon>
                <v-icon v-else-if="p.state=='loaded'">mdi-close-circle-outline</v-icon>
                <v-icon v-else-if="p.state=='ready'">mdi-circle-outline</v-icon>
                <v-icon v-else-if="p.state=='empty'">mdi-alert-circle-outline</v-icon>
                <v-icon v-else-if="p.state=='dirty'">mdi-close-circle-outline</v-icon>
              </span>
          </v-card>
      </v-layout>
    
</template>

<script>

import { mapState, mapGetters } from 'vuex'
import Confirm from './Confirm'


export default {
  name: 'BarbotControls',
  data() {
    return {
      started: false,
    }
  },
  
  components: {
    Confirm
  },
  
  computed: {
    ...mapGetters({
      pumps: 'pumps/sortedItems',
    }),
    ...mapState([
      'dispenserState',
      'glassReady',
    ])
  },
  
  methods: {
  
    startDispensing(start) {
      started = true
      this.$socket.emit('startDispensing', start, (res) => {
        if (res.error) {
            this.$store.commit('setError', res.error)
        }
        started = false
      })
    },
  
  },

}
</script>
