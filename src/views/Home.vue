<template>

  <v-container fluid fill-height pa-0>
    <v-layout column>
    
      <v-flex>
        <barbot-controls ref="barbotControls"></barbot-controls>
      </v-flex>
      
      <v-flex>
        <drink-orders ref="drinkOrders"></drink-orders>
      </v-flex>
      
    </v-layout>
      
  </v-container>
</template>

<script>

import BarbotControls from '../components/BarbotControls'
import DrinkOrders from '../components/DrinkOrders'

export default {
  name: 'Home',
  data() {
    return {}
  },
  
  components: {
    BarbotControls,
    DrinkOrders
  },
  
  created() {
    this.$emit('show-page', false)
  },
  
  beforeRouteEnter(to, from, next) {
    next(t => {
      t.$refs.drinkOrders.loadOrders()
    })
  },
  
  beforeRouteLeave(to, from, next) {
    this.$refs.drinkOrders.unloadOrders()
    next()
  }
  
}

</script>
