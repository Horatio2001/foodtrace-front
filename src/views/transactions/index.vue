<template>
  <div class="transactions-container">
    <div class="transactions-text">name: {{ name }}</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Transactions',
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

