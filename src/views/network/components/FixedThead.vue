<template>
  <div class="app-container">
    <div class="filter-container">
      <el-checkbox-group v-model="checkboxVal">
        <el-checkbox label="peerName">
          peerName
        </el-checkbox>
        <el-checkbox label="peerType">
          peerType
        </el-checkbox>
        <el-checkbox label="requestUrl">
          requestUrl
        </el-checkbox>
        <el-checkbox label="mspid">
          mspid
        </el-checkbox>
        <el-checkbox label="high">
          high
        </el-checkbox>
        <el-checkbox label="low">
          low
        </el-checkbox>
        <el-checkbox label="unsigned">
          unsigned
        </el-checkbox>
      </el-checkbox-group>
    </div>
    <el-table @sort-change="sortChange" :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column v-for="Peer in formThead" :key="Peer" :label="Peer" :class-name="getSortClass('peerName')" sortable="custom">
        <template slot-scope="scope">
          {{ scope.row[Peer] }}
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>

import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { fetchList } from '@/api/article'
import { fetchNetwork } from '@/api/networkInfo'

const defaultFormThead = ['peerName','requestUrl', 'peerType','mspid','high','low','unsigned']

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
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
      formTheadOptions: ['peerName','requestUrl', 'peerType','mspid','high','low','unsigned'],
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
      fetchNetwork().then(response => {
        this.list = response.data
        this.total = response.total
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

