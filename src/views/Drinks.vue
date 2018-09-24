<template>

      <v-card flat>
        
        <loading v-if="loading"></loading>
        
        <template v-else>
        
          <v-list two-line>
            <v-list-tile
              v-for="item in items"
              :key="item.id"
              avatar
            >
              <v-list-tile-avatar v-if="item.isFavorite">
                <v-icon>mdi-heart</v-icon>
              </v-list-tile-avatar>

              <v-list-tile-content>
                <v-list-tile-title>{{item.primaryName}}</v-list-tile-title>
                <v-list-tile-sub-title>{{item.secondaryName}}</v-list-tile-sub-title>
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
                >Edit Drink</span>
                <span
                  v-else
                  class="headline"
                >Add Drink</span>
              </v-card-title>
              <v-card-text>
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-container grid-list-md>
                    <v-layout wrap>
                    
                      <v-flex xs12>
                        <v-text-field
                          label="Primary name"
                          v-model="item.primaryName"
                          :rules="[v => !!v || 'Primary name is required']"
                          required
                          autofocus
                        ></v-text-field>
                      </v-flex>
                      
                      <v-flex xs12>
                        <v-text-field
                          label="Secondary name"
                          v-model="item.secondaryName"
                          hint="This is not required but can help distinguish similar drinks"
                        ></v-text-field>
                      </v-flex>
                      
                      <v-flex xs6>
                        <v-select
                          :items="glasses"
                          item-text="name"
                          item-value="id"
                          label="Glass"
                          v-model="item.glassId"
                          :rules="[v => !!v || 'Glass is required']"
                          required
                        ></v-select>
                      </v-flex>

                      <v-flex xs12>
                        <v-textarea
                          label="Instructions"
                          auto-grow
                          v-model="item.instructions"
                        ></v-textarea>
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
  name: 'Drinks',
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
    this.$emit('show-page', 'Drinks')
  },
  
  computed: {
    ...mapGetters({
      items: 'drinks/sortedItems',
      glasses: 'glasses/sortedItems',
    }),
    ...mapState({
      loading: state => state.drinks.loading,
    })
  },
  
  methods: {
  
    editItem(item) {
      this.$refs.form.reset()
      this.item = {...item}
      this.edit = true
      this.$store.dispatch('glasses/load')
      console.dir(item)
      
      this.dialog = true
    },
    
    addItem() {
      this.$refs.form.reset()
      this.item = {
        id: undefined,
        primaryName: undefined,
        secondaryName: undefined,
        instructions: undefined,
        glassId: undefined,
        // ingredients
      }
      this.edit = false
      this.$store.dispatch('glasses/load')
      this.dialog = true
    },
    
    closeDialog() {
      this.dialog = false
      this.item = {}
      this.$store.commit('glasses/destroy')
      
    },
    
    saveItem() {
      if (! this.$refs.form.validate()) return
      
      console.dir(this.item)
      this.closeDialog()
      
      //this.$store.dispatch('drinks/save', this.item).then(() => {
      //  this.closeDialog()
      //})
    },
    
    deleteItem(item) {
      this.$refs.confirm.open('Delete', 'Are you sure you want to delete "' + item.primaryName + '"?').then((confirm) => {
        if (confirm)
          this.$store.dispatch('drinks/delete', item)
      })
      
    },
    
  },
  
  beforeRouteEnter(to, from, next) {
    next(t => {
      t.$store.dispatch('drinks/load')
    });
  },
  
  beforeRouteLeave(to, from, next) {
    this.$store.commit('drinks/destroy')
    next()
  }
  
}

</script>
