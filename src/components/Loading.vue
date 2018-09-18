<template>
  <div
    class="text-xs-center"
  >
    <v-progress-circular
      indeterminate
      :color="color"
      style="margin: 1rem"
    ></v-progress-circular>
  </div>
</template>

<script>
export default {
  data: () => ({
  }),
  props: {
    color: {
      default: 'primary'
    }
  }
}
</script>
