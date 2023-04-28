<template>
  <div class="block">
    <div class="card-container">
      <el-table :data="list" class="table" :cell-style="{padding:'50px'} ">
        <el-table-column label="节点名称" align="center">
          <template slot-scope="scope">
            {{ scope.row }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getPeerName } from '@/api/block';

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      };
      return statusMap[status];
    },
    orderNoFilter(str) {
      return str.substring(0, 30);
    }
  },
  data() {
    return {
      list: null
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      getPeerName()
        .then(response => {
          this.list = response.data;
        })
        .catch(error => {
          console.error(error);
        });
    },
    tableRowClassName({ rowIndex }) {
      if ((rowIndex + 1) % 2 === 0) {
        return 'oddRow';
      }
      return 'evenRow';
    },
  }
}
</script>

<style scoped>
.block {
  max-width: 800px;
  margin: 0 auto;
}

.card-container {
  height: 567px;
  overflow-y: scroll;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}

.el-table th, .el-table td {
  border: 1px solid #ebeef5;
  padding: 12px 0;
  font-size: 14px;
}

.el-table th {
  background-color: #f5f7fa;
  color: #909399;
  font-weight: 400;
  text-align: center;
}

.el-table th div {
  display: flex;
  align-items: center;
  justify-content: center;
}

.el-table th .cell {
  padding-left: 5px;
}

.el-table td {
  text-align: center;
  color: #606266;
  font-weight: 400;
}
.oddRow {
color: white;
  background-color:rgba(15, 48, 60, .55);
}
.evenRow {
  background-color: rgba(22,78,97, 0.55);
  color: white;
}

</style>
