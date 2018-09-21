<template>
  <v-card flat>
        
    <v-toolbar
      clipped-left
      color="primary"
      dark
    >
      <v-toolbar-title>Orders</v-toolbar-title>
    </v-toolbar>
      
    <loading v-if="loading"></loading>
    
    <template v-else>
    
      <v-list two-line>
        <v-list-tile
          v-for="item in items"
          :key="item.id"
        >
          <v-list-tile-content>
            <v-list-tile-title>{{item.drink.name}}</v-list-tile-title>
            <v-list-tile-sub-title>{{item.drink.description}}</v-list-tile-sub-title>
          </v-list-tile-content>
          
          <v-list-tile-action>
            <v-menu bottom left>
              <v-btn
                slot="activator"
                icon
              >
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
              <v-list>
              
                <v-list-tile ripple @click="cancelItem(item)">
                  <v-list-tile-content>
                    <v-list-tile-title>Cancel</v-list-tile-title>
                  </v-list-tile-content>
                  <v-list-tile-action>
                    <v-icon>mdi-delete</v-icon>
                  </v-list-tile-action>
                </v-list-tile>
                
              </v-list>
            </v-menu>
          </v-list-tile-action>
      
        </v-list-tile>
      </v-list>
      
      <v-btn
        fab
        fixed
        bottom right
        color="primary"
        @click="addItem"
      >
        <v-icon dark>mdi-plus</v-icon>
      </v-btn>

    </template>
      
  </v-card>
          
</template>

<script>

import { mapState, mapGetters } from 'vuex'
import Loading from './Loading'
import Confirm from './Confirm'


export default {
  name: 'DrinkOrders',
  data: () => ({
  }),
  components: {
    Loading,
    Confirm
  },
  computed: {
    ...mapGetters({
      items: 'drinkOrders/sortedItems'
    }),
    ...mapState({
      loading: state => state.drinkOrders.loading,
    })
  },
  
  methods: {
  
    addItem() {
      console.log('add drink order')
    },
  
    cancelItem(item) {
      this.$refs.confirm.open('Cancel', 'Are you sure you want to cancel this order?').then((confirm) => {
        if (confirm)
          this.$store.dispatch('drinkOrders/delete', item)
      })
      
    },
    
  },

}
</script>
