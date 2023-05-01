<template>
  <div className="app-container">
    <div style="margin:0 0 5px 20px">
    </div>
    <fixed-thead/>
  </div>
</template>

<script>
import FixedThead from './components/FixedThead'

export default {
  name: 'TxTable',
  components: { FixedThead }
}
</script>

