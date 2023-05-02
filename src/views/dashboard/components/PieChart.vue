<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import { getTxByOrg } from '@/api/block'
import da from 'element-ui/src/locale/lang/da'
export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      list:[
        {
        name: null,
        transactions: null
      },{
        name: null,
        transactions: null
      },{
        name: null,
        transactions: null
      },{
        name: null,
        transactions: null
      }
      ],
      chart: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  created() {
    this.fetchData();
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: ['org0-foodtrace-com', 'foodtrace-com', 'org1-foodtrace-com', 'org2-foodtrace-com']
        },
        series: [
          {
            name: 'Transactions by Organization',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '38%'],
            data: [
              { value: 221, name: 'org0-foodtrace-com' },
              { value: 4, name: 'foodtrace-com' },
              { value: 21, name: 'org1-foodtrace-com' },
              { value: 21, name: 'org2-foodtrace-com' }
            ],
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    },
    fetchData() {
      getTxByOrg().then(response => {
        // console.log(data)
        this.list = response.data
        this.chart.setOption({
          series: [
            {
              name: 'Transactions by Organization',
              type: 'pie',
              roseType: 'radius',
              radius: [15, 95],
              center: ['50%', '38%'],
              data: [
                { value: this.list[0].transactions, name: this.list[0].name },
                { value: this.list[1].transactions, name: this.list[1].name },
                { value: this.list[2].transactions, name: this.list[2].name },
                { value: this.list[3].transactions, name: this.list[3].name }
              ],
              animationEasing: 'cubicInOut',
              animationDuration: 2600
            }
          ]
        })

        // console.log(this.list)
      })
    }
  }
}
</script>
