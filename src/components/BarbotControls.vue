<template>
  <v-card flat>
    
    <h1 class="pa-3">Barbot Controls</h1>
    
  </v-card>
          
</template>

<script>

import { mapState, mapGetters } from 'vuex'
import Confirm from './Confirm'


export default {
  name: 'BarbotControls',
  data() {
    return {
    }
  },
  
  components: {
    Confirm
  },
  
  computed: {
    ...mapGetters({
    }),
    ...mapState({
    })
  },
  
  methods: {
  
  },

}
</script>
