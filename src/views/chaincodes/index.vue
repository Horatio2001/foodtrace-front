<template>
  <div class="chaincodes-container">
    <div class="chaincodes-text">name: {{ name }}</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Chaincodes',
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>
】
