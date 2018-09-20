<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
        <img src="@/assets/logo.png" alt="Barbot" class="mb-5">
        <blockquote>
          Have a drink.
        </blockquote>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>

export default {
  name: 'Home',
  data() {
    return {}
  },
  created() {
    this.$emit('show-page', false)
  }
}

</script>
