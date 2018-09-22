<template>

  <v-container fluid fill-height pa-0>
    <v-layout column>
    
      <v-flex>
        <v-card dark color="primary">
          <v-card-text>state crap goes here</v-card-text>
        </v-card>
      </v-flex>
      
      <v-flex>
        <drinkorders></drinkorders>
      </v-flex>
      
    </v-layout>
      
  </v-container>
</template>

<script>

import DrinkOrders from '../components/DrinkOrders'

export default {
  name: 'Home',
  data() {
    return {}
  },
  
  components: {
    drinkorders: DrinkOrders
  },
  
  created() {
    this.$emit('show-page', false)
  },
  
  beforeRouteEnter(to, from, next) {
    next()
//    next(t => {
//      t.$store.dispatch('glasses/load')
//    })
  },
  
  beforeRouteLeave(to, from, next) {
//    this.$store.commit('glasses/destroy')
    next()
  }
  
}

</script>
