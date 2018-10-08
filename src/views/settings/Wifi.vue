<template>

  <v-card flat>
    
    <v-list two-line>
      <v-list-tile
        v-if="wifiState && wifiState.ssid"
        avatar
        ripple
        @click="gotoNetworkDetail()"
      >
        <v-list-tile-avatar>
          <v-icon v-if="wifiState.bars === 0">mdi-wifi-strength-outline</v-icon>
          <v-icon v-else-if="wifiState.bars === 1">mdi-wifi-strength-1</v-icon>
          <v-icon v-else-if="wifiState.bars === 2">mdi-wifi-strength-2</v-icon>
          <v-icon v-else-if="wifiState.bars === 3">mdi-wifi-strength-3</v-icon>
          <v-icon v-else-if="wifiState.bars === 4">mdi-wifi-strength-4</v-icon>
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title>{{wifiState.ssid}}</v-list-tile-title>
          <v-list-tile-sub-title>Connected</v-list-tile-sub-title>
        </v-list-tile-content>
        <v-list-tile-action>
          <v-btn
            icon
          >
            <v-icon>mdi-settings</v-icon>
          </v-btn>
        </v-list-tile-action>
      </v-list-tile>
      
      <v-divider></v-divider>
      
      <v-list-tile
        avatar
        ripple
        @click="addNetwork()"
      >
        <v-list-tile-avatar>
          <v-icon>mdi-plus</v-icon>
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title>Add network</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      
      <template v-if="!networksLoading">
      
        <v-list-tile
          avatar
          ripple
          @click="refreshNetworks()"
        >
          <v-list-tile-avatar>
            <v-icon>mdi-refresh</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>Refresh</v-list-tile-title>
            <v-list-tile-sub-title
              v-if="!networks.length && !wifiState.ssid">No networks found</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      
      <v-divider></v-divider>
      
        <v-list-tile
          v-for="network in networks"
          :key="network.ssid"
          avatar
          ripple
          @click="selectNetwork(network)"
        >
          <v-list-tile-avatar>
            <v-icon v-if="!network.bars || network.bars === 0">mdi-wifi-strength-outline</v-icon>
            <v-icon v-else-if="network.bars === 1">mdi-wifi-strength-1</v-icon>
            <v-icon v-else-if="network.bars === 2">mdi-wifi-strength-2</v-icon>
            <v-icon v-else-if="network.bars === 3">mdi-wifi-strength-3</v-icon>
            <v-icon v-else-if="network.bars === 4">mdi-wifi-strength-4</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{network.ssid}}</v-list-tile-title>
            <v-list-tile-sub-title>{{networkSubtitle(network)}}</v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-action v-if="network.connected">
            <v-btn icon>
              <v-icon>mdi-settings</v-icon>
            </v-btn>
          </v-list-tile-action>
        </v-list-tile>
      
      </template>
      
    </v-list>
    
    <loading v-if="networksLoading"></loading>

  </v-card>
        
</template>

<script>

import { mapState, mapGetters } from 'vuex'
import Loading from '../../components/Loading'
import store from '../../store/store'
import bus from '../../bus'

export default {
  name: 'Wifi',
  data() {
    return {
    }
  },
  
  components: {
    Loading,
  },
  
  created() {
    this.$emit('show-page', 'Wifi')
    bus.$on('logout', this.onLogout)
  },
  
  beforeDestroy: function () {
    bus.$off('logout', this.onLogout)
  },
  
  computed: {
    ...mapGetters({
      networks: 'wifi/sortedNetworks',
    }),
    ...mapState({
      networksLoading: state => state.wifi.networksLoading,
      wifiState: state => state.wifi.state,
    })
  },
  
  methods: {
    
    networkSubtitle(net) {
      let out = []
      if (net.connected) out.push('Connected')
      if (net.saved) out.push('Saved')
      if (net.auth) out.push(...net.auth)
      return out.join(', ')    
    },
    
    gotoNetworkDetail() {
      console.log('TODO: network detail')
    },
    
    addNetwork() {
      console.log('TODO: add network')
    },
    
    selectNetwork(net) {
      console.dir(net)
      if (net.connected) {
        console.log('TODO: network detail')
      } else if (net.scanned) {
        console.log('TODO: connect to network')
      } else if (net.saved) {
        console.log('TODO: connect or forget network')
      }
    },
    
    refreshNetworks() {
      this.$store.dispatch('wifi/loadNetworks')
    },
    
    onLogout() {
      if (! ((store.state.options.settingsRequiresAdmin == false) || store.state.user.isAdmin))
        this.$router.replace({name: 'home'})
    },
    
  },

  beforeRouteEnter(to, from, next) {
    if (! ((store.state.options.settingsRequiresAdmin == false) || store.state.user.isAdmin))
      next({name: 'home'})
    else
      next(t => {
        t.$store.dispatch('wifi/loadNetworks')
      })
  },
  
  beforeRouteLeave(to, from, next) {
    this.$store.commit('wifi/destroyNetworks')
    next()
  },
  
}

</script>
