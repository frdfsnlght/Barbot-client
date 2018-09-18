<template>
  <div class="ingredients">
    <h1>Ingredients</h1>
  </div>
</template>

<script>

export default {
  name: 'Ingredients',
  data() {
    return {}
  },
  created() {
    this.$emit('show-page', 'Ingredients')
  }
}

</script>
