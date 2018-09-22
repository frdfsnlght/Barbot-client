<template>
  <v-app>
    <v-navigation-drawer
      persistent
      clipped
      v-model="drawer"
      enable-resize-watcher
      fixed
      app
    >
      <v-list>
        <v-list-tile @click="goTo('home')">
          <v-list-tile-action>
            <v-icon>mdi-home</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Home</v-list-tile-title>
        </v-list-tile>
        
        <v-list-tile @click="goTo('drinks')">
          <v-list-tile-action>
            <v-icon>mdi-cup-water</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Drinks</v-list-tile-title>
        </v-list-tile>
      
        <v-list-tile @click="goTo('ingredients')">
          <v-list-tile-action>
            <v-icon>mdi-cart</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Ingredients</v-list-tile-title>
        </v-list-tile>
      
        <v-list-tile @click="goTo('glasses')">
          <v-list-tile-action>
            <v-icon>mdi-glass-cocktail</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Glasses</v-list-tile-title>
        </v-list-tile>
      
        <v-list-tile @click="goTo('pumps')">
          <v-list-tile-action>
            <v-icon>mdi-gas-station</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Pumps</v-list-tile-title>
        </v-list-tile>
      
        <v-divider/>
        
        <v-list-group
          prepend-icon="mdi-settings"
          no-action
        >
          <v-list-tile slot="activator">
            <v-list-tile-title>System</v-list-tile-title>
          </v-list-tile>

          <v-list-tile @click="alert('TODO')">
            <v-list-tile-title>WiFi</v-list-tile-title>
            <v-list-tile-action>
              <v-icon>mdi-wifi</v-icon>
            </v-list-tile-action>
          </v-list-tile>

          <v-list-tile @click="alert('TODO')">
            <v-list-tile-title>Restart</v-list-tile-title>
            <v-list-tile-action>
              <v-icon>mdi-restart</v-icon>
            </v-list-tile-action>
          </v-list-tile>

          <v-list-tile @click="alert('TODO')">
            <v-list-tile-title>Shutdown</v-list-tile-title>
            <v-list-tile-action>
              <v-icon>mdi-power</v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </v-list-group>
        
      </v-list>
    </v-navigation-drawer>
    
    <v-toolbar
      app
      clipped-left
      color="primary"
      dark
    >
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn v-if="showBack" icon @click="goBack()">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>      
      
      <v-btn v-if="showWifi" icon @click="alert('TODO')">
        <v-icon v-if="!wifiState.ssid">mdi-wifi-off</v-icon>
        <v-icon v-else-if="wifiState.bars === 0">mdi-wifi-strength-outline</v-icon>
        <v-icon v-else-if="wifiState.bars === 1">mdi-wifi-strength-1</v-icon>
        <v-icon v-else-if="wifiState.bars === 2">mdi-wifi-strength-2</v-icon>
        <v-icon v-else-if="wifiState.bars === 3">mdi-wifi-strength-3</v-icon>
        <v-icon v-else-if="wifiState.bars === 4">mdi-wifi-strength-4</v-icon>
      </v-btn>
      
    </v-toolbar>
    
    <v-content>
      <router-view
        @show-page="showPage"/>
    </v-content>
    
    <v-dialog
      v-model="connectingDialog"
      persistent
      max-width="400"
    >
      <v-card
        color="primary"
        dark
      >
        <v-card-text>
          Attempting to connect...
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
    
    <v-dialog
      v-model="error"
      persistent
      max-width="400"
    >
      <v-card
        color="red"
      >
        <v-card-title>
          <span class="headline">Error</span>
        </v-card-title>
      
        <v-card-text>
          {{errorMsg}}
        </v-card-text>
        
        <v-card-actions>
          <v-spacer></v-spacer>
            <v-btn
              flat
              @click="clearError()">ok</v-btn>
        </v-card-actions>
        
      </v-card>
    </v-dialog>
    
    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      :timeout="2000"
    >
      {{ snackbarText }}
      <v-btn
        dark
        flat
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>
    
  </v-app>
</template>

<script>

import { mapState } from 'vuex'

export default {
  name: 'App',
  data () {
    return {
      appTitle: 'Barbot',
      pageTitle: false,
      drawer: false,
      showBack: false,
    }
  },
  
  computed: {
    title () {
      return this.appTitle + (this.pageTitle ? (": " + this.pageTitle) : "");
    },
    connectingDialog() {
      return !this.$store.state.connected
    },
    snackbar: {
      get: function() {
        return this.$store.state.snackbar
      },
      set: function(newValue) {
        this.$store.commit('setSnackbar', newValue)
      },
    },
    showWifi() {
        return this.isConsole && this.wifiState
    },
    ...mapState([
      'isConsole',
      'error',
      'errorMsg',
      'snackbarColor',
      'snackbarText',
    ]),
    ...mapState({
      wifiState: state => state.wifi.state
    }),
  },
  
  methods: {
  
    goBack() {
      window.history.length > 1
        ? this.$router.go(-1)
        : this.$router.push('/')
    },
    
    goTo(routeName) {
      this.drawer = false
      this.$router.push({name: routeName})
    },
    
    showPage(pageTitle) {
      this.pageTitle = pageTitle
      this.showBack = !!pageTitle
    },
    
    clearError() {
      this.$store.commit('clearError')
    },
    
  },
  
  created() {
    if (this.isConsole)
      console.log('Client is running as console.')
    else
      console.log('Client is running as remote.')
  }
  
}
</script>
