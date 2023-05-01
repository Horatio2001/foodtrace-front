<template>
  <div class="block">
    <div class="card-container">
      <el-timeline>
        <el-timeline-item v-for="(item,index) of list" :key="index" :timestamp="item.time" placement="top">
          <el-card class="my-card">
            <div slot="header" class="my-card-header">
              <h2>Block: {{ item.blockNumber }}</h2>
              <el-button class="my-card-header-btn" type="primary" icon="el-icon-search" @click="getCardInfo(item)">
              </el-button>
            </div>
            <div class="my-card-body">
              <h4>DataHash:</h4>
              <p> {{ item.blockHash }} </p>
              <h4>Number of Tx: {{ item.txCount }}</h4>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>

    <el-dialog :visible.sync="dialogVisible" title="卡片详情" :close-on-click-modal="false" :show-close="false">
      <div class="detail-table">
        <div class="detail-row">
          <div class="detail-label">Block:</div>
          <div class="detail-value">{{ selectedCard.blockNumber }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">ChannelName:</div>
          <div class="detail-value">{{ selectedCard.channelName }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">BlockHash:</div>
          <div class="detail-value">{{ selectedCard.blockHash }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">DataHash:</div>
          <div class="detail-value">{{ selectedCard.dataHash }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">PreviousHash:</div>
          <div class="detail-value">{{ selectedCard.previousHash }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Transactions:</div>
          <div class="detail-value">{{ selectedCard.transactions }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Type:</div>
          <div class="detail-value">{{ selectedCard.type }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Number of Tx:</div>
          <div class="detail-value">{{ selectedCard.txCount }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Time:</div>
          <div class="detail-value">{{ selectedCard.time }}</div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false" type="primary">关闭</el-button>
  </span>
    </el-dialog>

  </div>
</template>

<script>
import { getNewestBlockInfo } from '@/api/block'
import { getBlockInfoByNum } from '@/api/block'

export default {
  data() {
    return {
      list: [
        {
          blockNumber: null,
          channelName: null,
          txCount: null,
          blockHash: null,
          time: null,
          type: null,
          transactions: null,
          previousHash: null,
          dataHash: null
        },
        {
          blockNumber: null,
          channelName: null,
          txCount: null,
          blockHash: null,
          time: null,
          type: null,
          transactions: null,
          previousHash: null,
          dataHash: null
        },
        {
          blockNumber: null,
          channelName: null,
          txCount: null,
          blockHash: null,
          time: null,
          type: null,
          transactions: null,
          previousHash: null,
          dataHash: null
        }
      ],
      dialogVisible: false,
      selectedCard: {}
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      getNewestBlockInfo().then(response => {
        const data = response.data.map(obj => ({
          blockNumber: obj.blockNumber
          , channelName: obj.channelName
          , blockHash: obj.blockHash
          , txCount: obj.transactionCount
          , time: obj.time
          , type: obj.type
          , transactions: obj.transactions
          , previousHash: obj.previousHash
          , dataHash: obj.dataHash
        }))
        // console.log(data)
        this.list = data
      })
    },

    getCardInfo(item) {
      this.selectedCard = item
      this.dialogVisible = true
    }
  }
}
</script>

<style>
.block {
  max-width: 800px;
  margin: 0 auto;
}

.card-container {
  height: 500px;
  overflow-y: scroll;
}


.my-card {
  margin: 30px 0;
  border-radius: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  background-image: linear-gradient(#6382d0, #6382d0 43%, #fff 40%, #fff);

}

.my-card-header {
  background-color: #6382d0;
  color: #fff;
  border-radius: 4px 4px 4px 4px;
  padding: 0px 10px;
}

.my-card-body {
  padding: 5px;
}

.my-card h4 {
  font-size: 16px;
  font-weight: 500;
  margin: 10px 0;
}

.my-card p {
  font-size: 16px;
  margin: 0;
}

.my-card-header-btn {
  font-size: 10px;
  margin-left: auto;
  color: #fff;
  border-color: #fff;
}

.my-card-header-btn:hover {
  color: #145085;
  background-color: #fff;
}

.my-card-body {
  padding: 20px;
}


.dialog-footer {
  text-align: right;
  padding: 10px 20px;
}

</style>

<style>

.el-dialog__header {
  background-color: #4A77AC;
}

.el-dialog__title {
  color: white;
}

.detail-table {
  display: table;
  width: 100%;
  border-collapse: separate;
  border-spacing: 0px;
  padding: 16px;
}

.detail-row {
  display: table-row;
  width: 100%;
}

.detail-row:nth-of-type(even) {
  background-color: #f5f5f5; /* 设置背景颜色 */
}

.detail-label,
.detail-value {
  display: table-cell;
  padding: 8px;
}

.detail-label {
  font-weight: bold;
  text-align: left;
  white-space: nowrap;
  width: 30%;
}

.detail-value {
  text-align: left;
  word-break: break-all;
}
</style>
