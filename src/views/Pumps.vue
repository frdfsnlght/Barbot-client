<template>

  <v-card flat>
    
    <loading v-if="loading"></loading>
    
    <template v-else>
    
      <v-list two-line>
        <v-list-tile
          v-for="item in items"
          :key="item.id"
          avatar
          ripple
        >
          <v-list-tile-avatar>
            <v-icon v-if="item.running">mdi-run</v-icon>
            <v-icon v-else-if="!item.state">mdi-power-off</v-icon>
            <v-icon v-else-if="item.state=='unloaded'">mdi-minus</v-icon>
            <v-icon v-else-if="item.state=='loaded'">mdi-plus</v-icon>
            <v-icon v-else-if="item.state=='ready'">mdi-check</v-icon>
            <v-icon v-else-if="item.state=='empty'">mdi-battery-outline</v-icon>
            <v-icon v-else-if="item.state=='dirty'">mdi-spray-bottle</v-icon>
          </v-list-tile-avatar>
          
          <v-list-tile-content>
            <v-list-tile-title>{{item.name}} : {{itemIngredient(item)}}</v-list-tile-title>
            <v-list-tile-sub-title>{{itemState(item)}}</v-list-tile-sub-title>
          </v-list-tile-content>
          
          <v-list-tile-action>
            <v-btn
              icon
              :disabled="disableActions()"
              @click.stop="showMenu(item, $event)"
            >
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </v-list-tile-action>
          
        </v-list-tile>
      </v-list>

      <v-menu
        v-model="menu"
        :position-x="menuX"
        :position-y="menuY"
        absolute
        offset-y
      >
        <v-list>
        
          <v-list-tile
            v-if="!item.state"
            ripple
            @click="enablePump()"
          >
            <v-list-tile-content>
              <v-list-tile-title>Enable</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-icon>mdi-power</v-icon>
            </v-list-tile-action>
          </v-list-tile>

          <v-list-tile
            v-if="item.state=='unloaded'"
            ripple
            @click="openLoadPump()"
          >
            <v-list-tile-content>
              <v-list-tile-title>Load</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-icon>mdi-plus</v-icon>
            </v-list-tile-action>
          </v-list-tile>

          <v-list-tile
            v-if="item.state=='unloaded'"
            ripple
            @click="disablePump()"
          >
            <v-list-tile-content>
              <v-list-tile-title>Disable</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-icon>mdi-power-off</v-icon>
            </v-list-tile-action>
          </v-list-tile>

          <v-list-tile
            v-if="item.state=='loaded'"
            ripple
            @click="openPrimePump()"
          >
            <v-list-tile-content>
              <v-list-tile-title>Prime</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-icon>mdi-autorenew</v-icon>
            </v-list-tile-action>
          </v-list-tile>

          <v-list-tile
            v-if="item.state=='loaded'"
            ripple
            @click="unloadPump()"
          >
            <v-list-tile-content>
              <v-list-tile-title>Unload</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-icon>mdi-minus</v-icon>
            </v-list-tile-action>
          </v-list-tile>

          <v-list-tile
            v-if="item.state=='ready' || item.state=='empty'"
            ripple
            @click="openLoadPump()"
          >
            <v-list-tile-content>
              <v-list-tile-title>Reload</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-icon>mdi-recycle</v-icon>
            </v-list-tile-action>
          </v-list-tile>

          <v-list-tile
            v-if="item.state=='ready' || item.state=='empty'"
            ripple
            @click="drainPump()"
          >
            <v-list-tile-content>
              <v-list-tile-title>Drain</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-icon>mdi-backup-restore</v-icon>
            </v-list-tile-action>
          </v-list-tile>

          <v-list-tile
            v-if="item.state=='ready'"
            ripple
            @click="openPrimePump()"
          >
            <v-list-tile-content>
              <v-list-tile-title>Prime</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-icon>mdi-autorenew</v-icon>
            </v-list-tile-action>
          </v-list-tile>
          
          <v-list-tile
            v-if="item.state=='dirty'"
            ripple
            @click="openCleanPump()"
          >
            <v-list-tile-content>
              <v-list-tile-title>Clean</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-icon>mdi-spray-bottle</v-icon>
            </v-list-tile-action>
          </v-list-tile>

        </v-list>
      </v-menu>
      
      <pump-wizard ref="pumpWizard" :pump="item"></pump-wizard>
      <confirm ref="confirm"></confirm>
      
    </template>
    
  </v-card>
        
</template>

<script>

import { mapState, mapGetters } from 'vuex'
import Loading from '../components/Loading'
import Confirm from '../components/Confirm'
import PumpWizard from '../components/PumpWizard'

export default {
  name: 'Ingredients',
  data() {
    return {
      item: {},
      menu: false,
      menuX: 0,
      menuY: 0,
    }
  },
  components: {
    Loading,
    Confirm,
    PumpWizard,
  },
  created() {
    this.$emit('show-page', 'Pumps')
  },
  
  computed: {
    ...mapGetters({
      items: 'pumps/sortedItems',
      anyPumpRunning: 'pumps/anyPumpRunning',
    }),
    ...mapState({
      loading: state => state.pumps.loading,
      isConsole: state => state.isConsole,
      pumpSetup: state => state.pumpSetup,
    })
  },
  
  methods: {
  
    itemIngredient(item) {
      if (! item.ingredient) return '<empty>'
      return item.amount + ' ' + item.units + ' ' + item.ingredient.name + ' (' + Math.round((item.amount / item.containerAmount) * 100)   + '%)'
    },
    
    itemState(item) {
      if (! item.state) return '<disabled>'
      return item.state
    },
    
    disableActions() {
      return !(this.isConsole && this.pumpSetup) || this.anyPumpRunning
    },

    showMenu(item, e) {
      this.item = item
      this.menuX = e.clientX
      this.menuY = e.clientY
      this.menu = true
    },
  
    
    enablePump() {
      this.$socket.emit('enablePump', this.item.id, (res) => {
        if (res.error) {
            this.$store.commit('setError', res.error)
        }
      })
    },
  
    disablePump() {
      this.$socket.emit('disablePump', this.item.id, (res) => {
        if (res.error) {
            this.$store.commit('setError', res.error)
        }
      })
    },
  
    openLoadPump() {
      this.$refs.pumpWizard.openLoad()
    },
  
    unloadPump() {
      this.$socket.emit('unloadPump', this.item.id, (res) => {
        if (res.error) {
            this.$store.commit('setError', res.error)
        }
      })
    },
  
    openPrimePump() {
      this.$refs.pumpWizard.openPrime()
    },
  
    drainPump() {
      this.$socket.emit('drainPump', this.item.id, (res) => {
        if (res.error) {
            this.$store.commit('setError', res.error)
        }
      })
    },
  
    openCleanPump() {
      this.$refs.pumpWizard.openClean()
    },
  
  },
  
  beforeRouteEnter(to, from, next) {
    next(t => {
      if (t.isConsole)
        t.$store.dispatch('startPumpSetup')
      t.$store.dispatch('pumps/loadAll')
    });
  },
  
  beforeRouteLeave(to, from, next) {
    this.$store.commit('pumps/destroy')
    next()
  }
  
}

</script>
