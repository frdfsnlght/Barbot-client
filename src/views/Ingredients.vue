<template>

      <v-card flat>
        
        <loading v-if="loading"></loading>
        
        <template v-else>
        
          <v-list>
            <v-list-tile
              v-for="item in items"
              :key="item.id"
              avatar
            >
              <v-list-tile-avatar>
                <v-icon v-if="item.isAlcoholic">mdi-flash</v-icon>
                <v-icon v-else>mdi-baby-buggy</v-icon>
              </v-list-tile-avatar>
              
              <v-list-tile-content>
                <v-list-tile-title>{{item.name}}</v-list-tile-title>
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
          
          <v-btn
            fab
            fixed
            bottom right
            color="primary"
            @click="addItem"
          >
            <v-icon dark>mdi-plus</v-icon>
          </v-btn>

          <v-dialog v-model="dialog" persistent scrollable max-width="480px">
            <v-card>
              <v-card-title>
                <span
                  v-if="edit"
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
                    
                      <v-flex xs12>
                        <v-text-field
                          label="Name"
                          v-model="item.name"
                          :rules="[v => !!v || 'Name is required']"
                          required
                          autofocus
                        ></v-text-field>
                      </v-flex>
                      
                      <v-flex xs12>
                        <v-checkbox
                          label="Is this ingredient alcoholic?"
                          v-model="item.isAlcoholic"
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
                  @click="closeDialog()">close</v-btn>
                <v-btn
                  :disabled="!valid"
                  flat
                  @click="saveItem()">save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <confirm ref="confirm"></confirm>
          
        </template>
        
      </v-card>
      
        
</template>

<script>

import { mapState, mapGetters } from 'vuex'
import Loading from '../components/Loading'
import Confirm from '../components/Confirm'

export default {
  name: 'Ingredients',
  data() {
    return {
      item: {},
      dialog: false,
      edit: false,
      valid: true
    }
  },
  components: {
    Loading,
    Confirm
  },
  created() {
    this.$emit('show-page', 'Ingredients')
  },
  
  computed: {
    ...mapGetters({
      items: 'ingredients/sortedItems'
    }),
    ...mapState({
      loading: state => state.ingredients.loading,
    })
  },
  
  methods: {
  
    editItem(item) {
      this.$refs.form.reset()
      this.item = {...item}
      this.edit = true
      this.dialog = true
    },
    
    addItem() {
      this.$refs.form.reset()
      this.item = {
        id: undefined,
        name: undefined
      }
      this.edit = false
      this.dialog = true
    },
    
    closeDialog() {
      this.dialog = false
      this.item = {}
    },
    
    saveItem() {
      if (! this.$refs.form.validate()) return
      this.$store.dispatch('ingredients/save', this.item).then(() => {
        this.closeDialog()
      })
    },
    
    deleteItem(item) {
      this.$refs.confirm.open('Delete', 'Are you sure you want to delete "' + item.name + '"?').then((confirm) => {
        if (confirm)
          this.$store.dispatch('ingredients/delete', item)
      })
      
    },
    
  },
  
  beforeRouteEnter(to, from, next) {
    next(t => {
      t.$store.dispatch('ingredients/load')
    });
  },
  
  beforeRouteLeave(to, from, next) {
    this.$store.commit('ingredients/destroy')
    next()
  }
  
}

</script>
