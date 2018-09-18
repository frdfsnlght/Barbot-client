<template>
  <div class="drinks">
    <h1>Drinks</h1>
  </div>
</template>

<script>

export default {
  name: 'Drinks',
  data() {
    return {}
  },
  created() {
    this.$emit('show-page', 'Drinks')
  }
}

</script>
