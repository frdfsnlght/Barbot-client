<template>
  <div>
  
    <v-dialog v-model="loadDialog" persistent scrollable max-width="480px">
      <v-card>
        <v-card-title>
          <span v-if="!isReload" class="headline">Load Pump {{pump.name}}</span>
          <span v-else class="headline">Reload Pump {{pump.name}}</span>
        </v-card-title>
        
        <v-card-text>
          <v-form ref="loadForm" v-model="valid" lazy-validation>
            <v-container grid-list-md>
              <v-layout wrap>
              
                <v-flex xs6>
                  <v-text-field
                    autofocus
                    label="Container size"
                    v-model="loadParams.containerAmount"
                    :rules="[v => !!v || 'Container size is required']"
                    mask="####"
                    required
                  ></v-text-field>
                </v-flex>
                  
                <v-flex xs6>
                  <select-units
                    v-model="loadParams.units"
                    required
                    :rules="[v => !!v || 'Units is required']"
                  ></select-units>
                </v-flex>
                
                <v-flex xs10>
                  <v-slider
                    label="Ingredient level"
                    v-model="loadParams.percent"
                    min="1"
                    max="100"
                    required
                  ></v-slider>
                </v-flex>
                
                <v-flex xs2>
                  {{loadParams.percent}}%
                </v-flex>
                
                <v-flex xs12>
                  <select-ingredient
                    v-model="loadParams.ingredientId"
                    required
                    :rules="[v => !!v || 'Ingredient is required']"
                  ></select-ingredient>
                </v-flex>
                
              </v-layout>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            flat
            @click="closeAll()">close</v-btn>
          <v-btn
            v-if="!isReload"
            flat
            :disabled="!valid"
            @click="submitLoad()">next</v-btn>
          <v-btn
            v-else
            flat
            :disabled="!valid"
            @click="submitLoad()">load</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="primeDialog" persistent scrollable max-width="480px">
      <v-card>
        <v-card-title>
          <span class="headline">Prime Pump {{pump.name}}</span>
        </v-card-title>
        
        <v-card-text>
        
          <v-container fluid>
            <v-layout column>
        
              <v-flex class="text-xs-center mb-3">
                <p>Insert the pump tube into the ingredient container.</p>
                <p>Place a glass in the dispensing area.</p>
              </v-flex>
              
              <v-flex class="text-xs-center">
                <v-btn
                  color="primary"
                  large
                  class="px-5"
                  :loading="!glassReady || pump.running"
                  :disabled="!glassReady || pump.running"
                  @click="primePump()"
                >
                  prime
                  <span slot="loader">Waiting...</span>
                </v-btn>
              </v-flex>
                
              <v-flex class="text-xs-center">
                <p class="my-3">If you need to prime the pump a little more, use these:</p>
              </v-flex>
              
              <v-flex class="text-xs-center">
                <v-btn
                  color="secondary"
                  :loading="!glassReady || pump.running"
                  :disabled="!glassReady || pump.running"
                  @click="primePump(2)"
                >
                  2 ml
                  <span slot="loader">Waiting...</span>
                </v-btn>
                <v-btn
                  color="secondary"
                  :loading="!glassReady || pump.running"
                  :disabled="!glassReady || pump.running"
                  @click="primePump(10)"
                >
                  10 ml
                  <span slot="loader">Waiting...</span>
                </v-btn>
              </v-flex>
        
            </v-layout>
          </v-container>
                
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            flat
            @click="closeAll()">close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="microPrimeDialog" persistent scrollable max-width="480px">
      <v-card>
        <v-card-title>
          <span class="headline">Prime Pump {{pump.name}}</span>
        </v-card-title>
        
        <v-card-text>
        
          <v-container fluid>
            <v-layout column>
        
              <v-flex class="text-xs-center">
                <p class="mb-3">Place a glass in the dispensing area.</p>
              </v-flex>
              
              <v-flex class="text-xs-center">
                <v-btn
                  color="primary"
                  :loading="!glassReady || pump.running"
                  :disabled="!glassReady || pump.running"
                  @click="primePump(2)"
                >
                  2 ml
                  <span slot="loader">Waiting...</span>
                </v-btn>
                <v-btn
                  color="primary"
                  :loading="!glassReady || pump.running"
                  :disabled="!glassReady || pump.running"
                  @click="primePump(10)"
                >
                  10 ml
                  <span slot="loader">Waiting...</span>
                </v-btn>
              </v-flex>
        
            </v-layout>
          </v-container>
                
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            flat
            @click="closeAll()">close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="cleanDialog" persistent scrollable max-width="480px">
      <v-card>
        <v-card-title>
          <span class="headline">Clean Pump {{pump.name}}</span>
        </v-card-title>
        
        <v-card-text>
        
          <v-container fluid>
            <v-layout column>
        
              <v-flex class="text-xs-center">
                <p class="mb-3">Place a glass in the dispensing area.</p>
              </v-flex>
              
              <v-flex class="text-xs-center">
                <v-btn
                  color="primary"
                  :loading="!glassReady || pump.running"
                  :disabled="!glassReady || pump.running"
                  @click="cleanPump()"
                >
                  clean
                  <span slot="loader">Waiting...</span>
                </v-btn>
              </v-flex>
        
            </v-layout>
          </v-container>
                
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            flat
            @click="closeAll()">close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>

import { mapState } from 'vuex'
import SelectIngredient from '../components/SelectIngredient'
import SelectUnits from '../components/SelectUnits'

export default {
  name: 'PumpWizard',
  props: ['pump'],
  
  data() {
    return {
      valid: false,
      
      loadDialog: false,
      loadParams: {},
      isReload: false,
      
      primeDialog: false,
      microPrimeDialog: false,
      cleanDialog: false,
    }
  },
  
  components: {
    SelectIngredient,
    SelectUnits,
  },

  computed: {
    glassNotReady() {
      return ! this.$store.glassReady
    },
    
    ...mapState({
      glassReady: state => state.glassReady,
    }),
  },
  
  methods: {

    openLoad() {
      this.$refs.loadForm.reset()
      if (this.pump.state == 'unloaded') {
        this.isReload = false
        this.loadParams = {
          id: this.pump.id,
          containerAmount: undefined,
          units: 'ml',
          percent: 50,
          ingredientId: undefined,
        }
      } else if ((this.pump.state == 'ready') || (this.pump.state == 'empty')) {
        this.isReload = true
        this.loadParams = {
          id: this.pump.id,
          containerAmount: this.pump.containerAmount,
          units: this.pump.units,
          percent: 100,
          ingredientId: this.pump.ingredientId,
        }
      }
      this.loadDialog = true
    },
    
    closeLoad() {
      this.$refs.loadForm.reset()
      this.loadParams = {}
      this.loadDialog = false
    },
    
    submitLoad() {
      if (! this.$refs.loadForm.validate()) return
      this.$socket.emit('loadPump', this.loadParams, (res) => {
        if (res.error) {
            this.$store.commit('setError', res.error)
        } else {
          this.closeLoad()
          if (! this.isReload)
            this.openPrime()
        }
      })
    },

    openPrime() {
      this.primeDialog = true
    },
    
    openMicroPrime() {
      this.microPrimeDialog = true
    },
    
    primePump(amount) {
      let params = {
        id: this.pump.id,
        amount: amount
      }
      this.$socket.emit('primePump', params, (res) => {
        if (res.error) {
            this.$store.commit('setError', res.error)
        }
      })
    },
    
    closePrime() {
      this.primeDialog = false
    },

    submitPrime() {
      this.closePrime()
    },
    
    closeMicroPrime() {
      this.microPrimeDialog = false
    },

    
    openClean() {
      this.cleanDialog = true
    },
    
    closeClean() {
      this.cleanDialog = false
    },
    
    cleanPump() {
      let params = {
        id: this.pump.id,
        amount: undefined
      }
      this.$socket.emit('cleanPump', params, (res) => {
        if (res.error) {
            this.$store.commit('setError', res.error)
        }
      })
    },
    
    closeAll() {
      this.closeLoad()
      this.closePrime()
      this.closeMicroPrime()
      this.closeClean()
    },
    
  },
  
}

</script>
