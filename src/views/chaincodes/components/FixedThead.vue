<template>
  <div class="app-container">
    <div class="filter-container">
      <el-checkbox-group v-model="checkboxVal">
        <el-checkbox label="chaincodeName">
          chaincodeName
        </el-checkbox>
        <el-checkbox label="channelName">
          channelName
        </el-checkbox>
        <el-checkbox label="path">
          path
        </el-checkbox>
        <el-checkbox label="transactionCount">
          transactionCount
        </el-checkbox>
        <el-checkbox label="version">
          version
        </el-checkbox>
      </el-checkbox-group>
    </div>
    <el-table @sort-change="sortChange" :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column v-for="Block in formThead" :key="Block" :label="Block" :class-name="getSortClass('peerName')" sortable="custom">
        <template slot-scope="scope">
          {{ scope.row[Block] }}
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>

import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import { fetchChaincodes } from '@/api/chaincodesInfo' // secondary package based on el-pagination

const defaultFormThead = ['chaincodeName','channelName','path','transactionCount','version']

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 20,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+peerName'
      },
      sortOptions: [{ label: 'peerName Ascending', key: '+peerName' }, { label: 'peerName Descending', key: '-peerName' }],
      showReviewer: false,
      tableData: [
        {
          name: 'fruit-1',
          apple: 'apple-10',
          banana: 'banana-10',
          orange: 'orange-10'
        },
        {
          name: 'fruit-2',
          apple: 'apple-20',
          banana: 'banana-20',
          orange: 'orange-20'
        }
      ],
      key: 1, // table key
      formTheadOptions: ['chaincodeName','channelName','path','transactionCount','version'],
      checkboxVal: defaultFormThead, // checkboxVal
      formThead: defaultFormThead // 默认表头 Default header
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchChaincodes(this.listQuery.page, this.listQuery.limit).then(response => {
        this.list = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'peerName') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+peerName'
      } else {
        this.listQuery.sort = '-peerName'
      }
      this.handleFilter()
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  },
  watch: {
    checkboxVal(valArr) {
      this.formThead = this.formTheadOptions.filter(i => valArr.indexOf(i) >= 0)
      this.key = this.key + 1
    }
  }
}
</script>

