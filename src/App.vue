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
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Home</v-list-tile-title>
        </v-list-tile>
        
        <v-list-tile @click="goTo('drinks')">
          <v-list-tile-action>
            <v-icon>local_drink</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Drinks</v-list-tile-title>
        </v-list-tile>
      
        <v-list-tile @click="goTo('ingredients')">
          <v-list-tile-action>
            <v-icon>shopping_cart</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Ingredients</v-list-tile-title>
        </v-list-tile>
      
        <v-list-tile @click="goTo('glasses')">
          <v-list-tile-action>
            <v-icon>local_bar</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Glasses</v-list-tile-title>
        </v-list-tile>
      
        <v-list-tile @click="goTo('pumps')">
          <v-list-tile-action>
            <v-icon>local_gas_station</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Pumps</v-list-tile-title>
        </v-list-tile>
      
        <v-divider/>
        
        <v-list-group
          prepend-icon="settings"
          no-action
        >
          <v-list-tile slot="activator">
            <v-list-tile-title>System</v-list-tile-title>
          </v-list-tile>

          <v-list-tile @click="alert('TODO')">
            <v-list-tile-title>WiFi</v-list-tile-title>
            <v-list-tile-action>
              <v-icon>network_wifi</v-icon>
            </v-list-tile-action>
          </v-list-tile>

          <v-list-tile @click="alert('TODO')">
            <v-list-tile-title>Restart</v-list-tile-title>
            <v-list-tile-action>
              <v-icon>cached</v-icon>
            </v-list-tile-action>
          </v-list-tile>

          <v-list-tile @click="alert('TODO')">
            <v-list-tile-title>Shutdown</v-list-tile-title>
            <v-list-tile-action>
              <v-icon>power_settings_new</v-icon>
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
      
      <v-icon
        v-if="connected"
      >check_circle</v-icon>
      <v-icon
        v-else
      >highlight_off</v-icon>
      
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
    ...mapState([
      'connected',
      'error',
      'errorMsg',
      'snackbarColor',
      'snackbarText'
    ])
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
      this.pageTitle = pageTitle;
    },
    
    clearError() {
      this.$store.commit('clearError')
    },
    
  }
}
</script>
