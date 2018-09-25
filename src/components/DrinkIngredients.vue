<template>
  <v-card flat>
        
    <v-toolbar
      v-if="title"
      clipped-left
      color="primary"
      dark
      dense
    >
      <v-toolbar-title>{{title}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="addItem()">
        <v-icon>mdi-plus</v-icon>
      </v-btn>      
    </v-toolbar>
      
    <v-list dense>
      <v-list-tile
        v-for="item in sortedItems"
        :key="item.id"
      >
        <v-list-tile-content>
          <v-list-tile-title>{{item.amount}} {{item.units}} {{item.ingredient.name}}</v-list-tile-title>
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
            
              <v-list-tile ripple @click="editItem(item)">
                <v-list-tile-content>
                  <v-list-tile-title>Edit</v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-icon>mdi-pencil</v-icon>
                </v-list-tile-action>
              </v-list-tile>
              
              <v-list-tile ripple @click="deleteItem(item)">
                <v-list-tile-content>
                  <v-list-tile-title>Delete</v-list-tile-title>
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
    
    <v-dialog v-model="dialog" persistent scrollable max-width="480px">
      <v-card>
        <v-card-title>
          <span
            v-if="editIndex >= 0"
            class="headline"
          >Edit Ingredient</span>
          <span
            v-else
            class="headline"
          >Add Ingredient</span>
        </v-card-title>
        
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-container grid-list-md>
              <v-layout wrap>
              
                <v-flex xs8>
                  <v-text-field
                    label="Step"
                    v-model="item.step"
                    :rules="[v => !!v || 'Step is required']"
                    mask="##"
                    required
                    autofocus
                  ></v-text-field>
                </v-flex>

                <v-flex xs6>
                  <v-text-field
                    label="Amount"
                    v-model="item.amount"
                    :rules="[v => !!v || 'Amount is required']"
                    mask="###"
                    required
                  ></v-text-field>
                </v-flex>

                <v-flex xs6>
                  <v-select
                    :items="['oz', 'ml']"
                    label="Units"
                    v-model="item.units"
                    :rules="[v => !!v || 'Units is required']"
                    required
                  ></v-select>
                </v-flex>
                
                <v-flex xs12>
                  <v-select
                    :items="ingredients"
                    item-text="name"
                    item-value="id"
                    label="Ingredient"
                    v-model="item.ingredientId"
                    :rules="[v => !!v || 'Ingredient is required']"
                    required
                  ></v-select>
                </v-flex>

              </v-layout>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            flat
            @click="closeDialog()">close</v-btn>
          <v-btn
            :disabled="!valid"
            flat
            @click="saveItem()">save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-card>
          
</template>

<script>

import { mapGetters } from 'vuex'


export default {
  name: 'DrinkIngredients',
  
  props: {
    title: {
      type: String,
      default: 'Ingredients'
    },
    value: {}
  },
  
  data: function() {
    return {
      items: this.value, // only sets initial value!
      item: {},
      dialog: false,
      editIndex: -1,
      valid: true,
    }
  },
  
  watch: {
    value: function(v) {
      this.items = v  // update when prop changes!
    }
  },
  
  computed: {
    sortedItems() {
      if (! this.items) return []
      return this.items.slice().sort((a, b) => {
        if (a.step < b.step) return -1
        if (a.step > b.step) return 1
        if (a.ingredient.name < b.ingredient.name) return -1
        if (a.ingredient.name > b.ingredient.name) return 1
        return 0
      })
    },
    
    ...mapGetters({
      ingredients: 'ingredients/sortedItems'
    }),
  },
  
  methods: {
  
    addItem() {
      this.$refs.form.reset()
      this.item = {
        id: null,
        ingredientId: undefined,
        amount: undefined,
        units: 'oz',
        step: 0,
      }
      this.editIndex = -1
      this.$store.dispatch('ingredients/load')
      this.dialog = true
    },
  
    editItem(item) {
      this.$refs.form.reset()
      this.item = JSON.parse(JSON.stringify(item))
      this.editIndex = this.items.indexOf(item)
      this.$store.dispatch('ingredients/load')
      this.dialog = true
    },
  
    closeDialog() {
      this.dialog = false
      this.$store.commit('ingredients/destroy')
      this.item = {}
    },

    saveItem() {
      if (! this.$refs.form.validate()) return
      if (this.editIndex == -1) {
        // adding a new item
        // don't allow duplicate ingredients
        if (this.items.find(item => item.ingredientId === this.item.ingredientId)) {
          this.$store.commit('setError', 'This ingredient is already in the drink!')
          return
        }
        this.item['ingredient'] = this.$store.getters['ingredients/getById'](this.item['ingredientId'])
        this.items.push(JSON.parse(JSON.stringify(this.item)))
      } else {
        this.items.splice(this.editIndex, 1, JSON.parse(JSON.stringify(this.item)))
      }
      this.closeDialog()
      console.dir(this.items)
      this.$emit('input', this.items)
   },
   
    deleteItem(item) {
      let idx = this.items.indexOf(item)
      if (idx == -1) return
      this.items.splice(idx, 1)
      this.$emit('input', this.items)
    },
    
  },

}
</script>
