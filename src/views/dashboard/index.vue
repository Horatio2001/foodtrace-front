<template>
  <div class="dashboard-container">
    <panel-group/>
    <el-row :gutter="32">
      <!--      <el-col :xs="24" :sm="24" :lg="8">-->
      <!--        <div class="chart-wrapper">-->
      <!--          <raddar-chart />-->
      <!--        </div>-->
      <!--      </el-col>-->
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart/>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="16">
        <div class="chart-wrapper">
          <bar-chart/>
        </div>
      </el-col>
      <!--      <el-col :xs="24" :sm="24" :lg="8">-->
      <!--        <div class="chart-wrapper">-->
      <!--          <bar-chart />-->
      <!--        </div>-->
      <!--      </el-col>-->
    </el-row>
    <el-row :gutter="100">
      <el-col
        :xs="{span: 24}"
        :sm="{span: 24}"
        :md="{span: 24}"
        :lg="{span: 12}"
        :xl="{span: 12}"
        style="padding-right:8px;margin-top:0;margin-bottom:30px;"
      >
        <transaction-table/>
      </el-col>

      <el-col
        :xs="{span: 24}"
        :sm="{span: 24}"
        :md="{span: 24}"
        :lg="{span: 12}"
        :xl="{span: 12}"
        style="margin-top:11px;margin-bottom:30px;"
      >
        <el-card>
          <el-tabs v-model="activeTab">
            <timeline-table/>
          </el-tabs>
        </el-card>
      </el-col>

    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import TransactionTable from './components/TransactionTable'
import TimelineTable from '@/views/dashboard/components/TimelineTable.vue'
import PieChart from '@/views/dashboard/components/PieChart.vue'
import BarChart from '@/views/dashboard/components/BarChart.vue'

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

export default {
  name: 'Dashboard',
  components: {
    TransactionTable,
    PanelGroup,
    TimelineTable,
    PieChart,
    BarChart
  },
  data() {
    return {
      user: {},
      activeTab: 'activity',
      lineChartData: lineChartData.newVisitis
    }
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 32px;
  background-color: rgb(241, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}


@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
