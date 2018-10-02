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
            <v-icon v-if="!item.state">mdi-power-off</v-icon>
            <v-icon v-else-if="item.state=='unloaded'">mdi-minus</v-icon>
            <v-icon v-else-if="item.state=='loaded'">mdi-plus</v-icon>
            <v-icon v-else-if="item.state=='ready'">mdi-check</v-icon>
            <v-icon v-else-if="item.state=='empty'">mdi-battery-outline</v-icon>
            <v-icon v-else-if="item.state=='dirty'">mdi-clean</v-icon>
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
            v-if="item.state=='unloaded'"
            ripple
            @click="loadPump()"
          >
            <v-list-tile-content>
              <v-list-tile-title>Load...</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-icon>mdi-plus</v-icon>
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
            v-if="item.state=='loaded'"
            ripple
            @click="primePump()"
          >
            <v-list-tile-content>
              <v-list-tile-title>Prime...</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-icon>mdi-autorenew</v-icon>
            </v-list-tile-action>
          </v-list-tile>

          <v-list-tile
            v-if="item.state=='ready' || item.state=='empty'"
            ripple
            @click="reloadPump()"
          >
            <v-list-tile-content>
              <v-list-tile-title>Reload...</v-list-tile-title>
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
              <v-list-tile-title>Drain...</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-icon>mdi-backup-restore</v-icon>
            </v-list-tile-action>
          </v-list-tile>

          <v-list-tile
            v-if="item.state=='dirty'"
            ripple
            @click="cleanPump()"
          >
            <v-list-tile-content>
              <v-list-tile-title>Clean...</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-icon>mdi-clean</v-icon>
            </v-list-tile-action>
          </v-list-tile>

        </v-list>
      </v-menu>
      
      <confirm ref="confirm"></confirm>
      
    </template>
    
  </v-card>
        
</template>

<script>

import { mapState, mapGetters } from 'vuex'
import Loading from '../components/Loading'
import Confirm from '../components/Confirm'

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
    Confirm
  },
  created() {
    this.$emit('show-page', 'Pumps')
  },
  
  computed: {
    ...mapGetters({
      items: 'pumps/sortedItems',
    }),
    ...mapState({
      loading: state => state.pumps.loading,
      isConsole: state => state.isConsole,
      pumpSetup: state => state.pumpSetup,
    })
  },
  
  methods: {
  
    itemIngredient(item) {
      //if (! item.state) return '<disabled>'
      if (! item.ingredient) return '<empty>'
      return item.amount + ' ' + item.units + ' ' + item.ingredient.name
    },
    
    itemState(item) {
      if (! item.state) return '<disabled>'
      return item.state
    },
    
    disableActions() {
      return !(this.isConsole && this.pumpSetup)
    },

    showMenu(item, e) {
      this.item = JSON.parse(JSON.stringify(item))
      this.menuX = e.clientX
      this.menuY = e.clientY
      this.menu = true
      console.log('showMenu ' + this.item.id)
    },
  
    
    enablePump() {
      console.log('enablePump')
    },
  
    disablePump() {
      console.log('disablePump')
    },
  
    loadPump() {
      console.log('loadPump')
    },
  
    unloadPump() {
      console.log('unloadPump')
    },
  
    primePump() {
      console.log('primePump')
    },
  
    reloadPump() {
      console.log('reloadPump')
    },
  
    drainPump() {
      console.log('drainPump')
    },
  
    cleanPump() {
      console.log('cleanPump')
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
