<template>

      <v-card flat>
        
        <loading v-if="loading"></loading>
        
        <template v-else>
        
          <v-list two-line>
            <v-list-tile
              v-for="item in items"
              :key="item.id"
            >
              <v-list-tile-content>
                <v-list-tile-title>{{item.size}} {{item.units}} {{item.type}}</v-list-tile-title>
                <v-list-tile-sub-title v-html="item.description"></v-list-tile-sub-title>
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
                >Edit Glass</span>
                <span
                  v-else
                  class="headline"
                >Add Glass</span>
              </v-card-title>
              <v-card-text>
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-container grid-list-md>
                    <v-layout wrap>
                    
                      <v-flex xs12>
                        <v-text-field
                          label="Type"
                          v-model="item.type"
                          :rules="[v => !!v || 'Type is required']"
                          required
                          autofocus
                        ></v-text-field>
                      </v-flex>
                      
                      <v-flex xs6>
                        <v-text-field
                          label="Size"
                          mask="##"
                          v-model="item.size"
                          :rules="[v => !!v || 'Size is required']"
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
                        <v-textarea
                          label="Description"
                          auto-grow
                          v-model="item.description"
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
  name: 'Glasses',
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
    this.$emit('show-page', 'Glasses')
  },
  
  computed: {
    ...mapGetters({
      items: 'glasses/sortedItems'
    }),
    ...mapState({
      loading: state => state.glasses.loading,
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
        type: undefined,
        size: undefined,
        units: 'oz',
        description: undefined
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
      this.$store.dispatch('glasses/save', this.item).then(() => {
        this.closeDialog()
      })
    },
    
    deleteItem(item) {
      this.$refs.confirm.open('Delete', 'Are you sure you want to delete "' + item.size + ' ' + item.units + ' ' + item.type + '"?').then((confirm) => {
        if (confirm)
          this.$store.dispatch('glasses/delete', item)
      })
      
    },
    
  },
  
  beforeRouteEnter(to, from, next) {
    next(t => {
      t.$store.dispatch('glasses/load')
    });
  },
  
  beforeRouteLeave(to, from, next) {
    this.$store.commit('glasses/destroy')
    next()
  }
  
}

</script>
