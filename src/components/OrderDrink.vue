<template>

  <v-dialog v-model="dialog" persistent scrollable max-width="480px">
    <v-card>
      <v-card-title>
        <span class="headline">Order Drink</span>
      </v-card-title>
      
      <v-card-text>
        <v-form ref="form">
          <v-container grid-list-md>
            <v-layout wrap>
            
              <v-flex xs12>
                <h2 class="pb-3">{{drink.name}}</h2>
              </v-flex>
            
              <v-flex xs12>
                <v-text-field
                  label="Name"
                  v-model="order.name"
                  autofocus
                ></v-text-field>
              </v-flex>
              
              <v-flex xs12>
                <v-checkbox
                  label="Submit the order on hold?"
                  v-model="order.userHold"
                  required
                ></v-checkbox>
              </v-flex>
              
            </v-layout>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          flat
          @click="cancel()">close</v-btn>
        <v-btn
          flat
          @click="submit()">order</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</template>

<script>

export default {
  name: 'OrderDrink',
  data() {
    return {
      drink: {},
      order: {},
      dialog: false
    }
  },
  
  methods: {

    open(drink) {
      this.dialog = true
      this.drink = drink
      this.order.drinkId = drink.id
      this.order.userHold = false
      this.order.name = undefined
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    
    close() {
      this.dialog = false
    },
    
    submit() {
      this.resolve(this.order)
      //this.dialog = false
    },

    cancel() {
      this.resolve(false)
      this.dialog = false
    },
    
  },
  
}

</script>
