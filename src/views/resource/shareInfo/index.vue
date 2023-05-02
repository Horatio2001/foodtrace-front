<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.collectID" placeholder="收集号" style="width: 200px;" class="filter-item"
                @keyup.enter.native="handleFilter"
      />
      <el-select v-model="listQuery.status" placeholder="流程状态" clearable style="width: 130px" class="filter-item">
        <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item"/>
      </el-select>
      <el-select v-model="listQuery.type" placeholder="作物类别" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in fruitTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'"
                   :value="item.key"
        />
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key"/>
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download"
                 @click="handleDownload"
      >
        下载
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 90%;"
      @sort-change="sortChange"
    >
      <el-table-column label="收集号" prop="shareID" sortable="custom" align="center" width="102"
                       :class-name="getSortClass('shareID')"
      >
        <template slot-scope="{row}">
          <span>{{ row.shareID }}</span>
        </template>
      </el-table-column>
      <el-table-column label="流程状态" prop="status" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            <span v-if="row.status === 0">待保存</span>
            <span v-else-if="row.status === 1">待录入</span>
            <span v-else-if="row.status === 2">待共享</span>
            <span v-else-if="row.status === 3">已共享</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="作物类别" prop="type" align="center" width="130">
        <template slot-scope="{row}">
          <span>
            {{ row.type | fruitTypeFilter }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="作物名称" prop="name" align="center" width="100">
        <template slot-scope="{row}">
          <span>
            {{ row.name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="共享对象" prop="shareObj" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.shareObj }}</span>
        </template>
      </el-table-column>

      <el-table-column label="联系方式" prop="contactInfo" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.contactInfo }}</span>
        </template>
      </el-table-column>

      <el-table-column label="共享方式" prop="shareMode" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.shareMode | shareModeFilter}}</span>
        </template>
      </el-table-column>

      <el-table-column label="共享用途" prop="shareUse" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.shareUse | shareUseFilter}}</span>
        </template>
      </el-table-column>

      <el-table-column label="共享份次" prop="shareNum" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.shareNum }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作状态" prop="idContradict" class-name="status-col" width="120">
        <template slot-scope="{row}">
          <el-tag :type="row.isContradict | contadictFilter">
            <span v-if="row.isLoaded === 1">已上链</span>
            <span v-else-if="row.isContradict === 0">正常</span>
            <span v-else-if="row.isContradict === 1">反驳中</span>

          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作员" prop="type" sortable="custom" align="center" width="100">
        <template slot-scope="{row}">
          <span>
            admin
          </span>
        </template>
      </el-table-column>


      <el-table-column label="操作" align="center" width="250" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <div class="buttons-row">
            <el-button type="primary" size="small" @click="viewDetails(row.shareID)">
              查看详情
            </el-button>
            <el-button v-if="row.isLoaded === 0 && row.status === 3" type="primary" size="small"
                       @click="handleUpdate(row)"
            >
              修改
            </el-button>
            <el-button v-if="row.isLoaded === 0" type="primary" size="small" @click="handleDelete(row)">
              删除
            </el-button>
          </div>
          <div class="buttons-row">
            <el-button v-if="row.isLoaded === 0 && row.status === 3 && row.isContradict === 0" type="primary"
                       size="small" @click="handleRefuse(row)"
            >
              反驳
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                @pagination="getList"
    />

    <el-dialog :visible.sync="dialogCollectionVisible" title="共享信息详情" :close-on-click-modal="false"
               :show-close="false"
               class="collection-dialog"
    >
      <div class="detail-table">
        <div class="detail-row">
          <div class="detail-label">收集号:</div>
          <div class="detail-value">{{ this.shareInfo.shareID }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">作物类别:</div>
          <div class="detail-value">{{ this.shareInfo.type | fruitTypeFilter }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">作物名称:</div>
          <div class="detail-value">{{ this.shareInfo.name }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">共享对象:</div>
          <div class="detail-value">{{ this.shareInfo.shareObj }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">联系方式:</div>
          <div class="detail-value">{{ this.shareInfo.contactInfo }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">共享方式:</div>
          <div class="detail-value">{{ this.shareInfo.shareMode | shareModeFilter}}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">共享用途:</div>
          <div class="detail-value">{{ this.shareInfo.shareUse | shareUseFilter}}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">共享份次:</div>
          <div class="detail-value">{{ this.shareInfo.shareNum }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">共享开始时间:</div>
          <div class="detail-value">{{ formatDate(this.shareInfo.shareBeginTime) }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">共享结束时间:</div>
          <div class="detail-value">{{ formatDate(this.shareInfo.shareEndTime) }}</div>
        </div>

      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogCollectionVisible = false" type="primary">关闭</el-button>
      </span>
    </el-dialog>


    <el-dialog :title="'修改'" :visible.sync="dialogCreateVisible">
      <el-form ref="dataForm2" :rules="shareRules" :model="shareTemp" label-position="left" label-width="130px"
               style="width: auto; margin-left:50px;"
      >

        <el-form-item label="收集号" prop="enterID">
          <el-input :disabled="true" :readonly="true" v-model="shareTemp.shareID"/>
        </el-form-item>

        <el-form-item label="作物类别" prop="type">
          <el-input :disabled="true" :readonly="true" v-model="shareTypeCompute"/>
        </el-form-item>

        <el-form-item label="作物名称" prop="name">
          <el-input :disabled="true" :readonly="true" v-model="shareTemp.name"/>
        </el-form-item>

        <el-form-item label="共享对象" prop="shareObj">
          <el-input v-model="shareTemp.shareObj" placeholder="请输入共享对象"/>
        </el-form-item>
        <el-form-item label="联系方式" prop="contactInfo">
          <el-input v-model="shareTemp.contactInfo" placeholder="请输入联系方式"/>
        </el-form-item>
        <el-form-item label="共享方式" prop="shareMode">
          <el-select v-model="shareTemp.shareMode" class="filter-item" placeholder="请输入共享方式">
            <el-option v-for="item in shareModeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item label="共享用途" prop="shareUse">
          <el-select v-model="shareTemp.shareUse" class="filter-item" placeholder="请输入共享用途">
            <el-option v-for="item in shareUseOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item label="共享份次" prop="shareNum">
          <el-input v-model="shareTemp.shareNum" placeholder="请输入共享份次"/>
        </el-form-item>
        <el-form-item label="共享开始时间" prop="shareBeginTime">
          <el-date-picker v-model="shareTemp.shareBeginTime" type="datetime" placeholder="请选择共享开始时间"/>
        </el-form-item>
        <el-form-item label="共享结束时间" prop="shareEndTime">
          <el-date-picker v-model="shareTemp.shareEndTime" type="datetime" placeholder="请选择共享结束时间"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCreateVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateEnterInfo()">
          确认
        </el-button>
      </div>
    </el-dialog>


    <el-dialog :title="'反驳'" :visible.sync="dialogRefuseVisible">
      <div slot="default">
        <p style="font-size: 18px;">您确定要反驳吗？</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelRefuse()">
          取消
        </el-button>
        <el-button type="primary" @click="refuseEnter()">
          确认反驳
        </el-button>
      </div>
    </el-dialog>


    <el-dialog :title="'共享'" :visible.sync="dialogSaveVisible">
      <el-form ref="dataForm" :rules="shareRules" :model="shareTemp" label-position="left" label-width="130px"
               style="width: auto; margin-left:50px;"
      >
        <el-form-item label="收集号" prop="shareID">
          <el-input :disabled="true" :readonly="true" v-model="shareTemp.shareID" placeholder="请输入收集号"/>
        </el-form-item>
        <el-form-item label="作物类别" prop="type">
          <el-input :disabled="true" :readonly="true" v-model="shareTypeCompute"/>
        </el-form-item>
        <el-form-item label="作物名称" prop="name">
          <el-input :disabled="true" :readonly="true" v-model="shareTemp.name"/>
        </el-form-item>
        <el-form-item label="共享对象" prop="shareObj">
          <el-input v-model="shareTemp.shareObj" placeholder="请输入共享对象"/>
        </el-form-item>
        <el-form-item label="联系方式" prop="contactInfo">
          <el-input v-model="shareTemp.contactInfo" placeholder="请输入联系方式"/>
        </el-form-item>
        <el-form-item label="共享方式" prop="shareMode">
          <el-select v-model="shareTemp.shareMode" class="filter-item" placeholder="请输入共享方式">
            <el-option v-for="item in shareModeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item label="共享用途" prop="shareUse">
          <!--          <el-input v-model="shareTemp.shareUse" placeholder="请输入共享用途"/>-->
          <el-select v-model="shareTemp.shareUse" class="filter-item" placeholder="请输入共享用途">
            <el-option v-for="item in shareUseOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item label="共享份次" prop="shareNum">
          <el-input v-model="shareTemp.shareNum" placeholder="请输入共享份次"/>
        </el-form-item>
        <el-form-item label="共享开始时间" prop="shareBeginTime">
          <el-date-picker v-model="shareTemp.shareBeginTime" type="datetime" placeholder="请选择共享开始时间"
                          style="width:100%"
          />
        </el-form-item>
        <el-form-item label="共享结束时间" prop="shareEndTime">
          <el-date-picker v-model="shareTemp.shareEndTime" type="datetime" placeholder="请选择共享结束时间"
                          style="width:100%"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSaveVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="createShareInfo()">
          确认录入
        </el-button>
      </div>

    </el-dialog>
  </div>
</template>

<script>

import {
  contradictEnter,
  deleteEnter,
  fetchEnter,
  fetchEnterListByPage,
  fetchEnterTotal,
  updateEnter,
  createShare
} from '@/api/enterInfo'

import {
  contradictShare,
  deleteShare,
  fetchShare,
  fetchShareListByPage,
  fetchShareTotal,
  updateShare,
  loadInfo
} from '@/api/shareInfo'

import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'

const shareUseOptions = [
  { key: 1, display_name: '科学研究' },
  { key: 2, display_name: '组织培养' },
  { key: 3, display_name: '成份分析' },
  { key: 4, display_name: '资源交换' },
  { key: 5, display_name: '样品补充' },
  { key: 6, display_name: '实验耗材' },
  { key: 7, display_name: '信息交换' },
]

const shareUseKeyValue = shareUseOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

const shareModeOptions = [
  { key: 1, display_name: '全部共享' },
  { key: 2, display_name: '部分共享' },
  { key: 3, display_name: '信息共享' },
  { key: 4, display_name: '实体共享' },
]

const shareModeKeyValue = shareModeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

const fruitTypeOptions = [
  { key: 1, display_name: '产胶作物' },
  { key: 2, display_name: '热带果树' },
  { key: 3, display_name: '热带牧草' },
  { key: 4, display_name: '热带粮食作物' },
  { key: 5, display_name: '热带药用作物' },
  { key: 6, display_name: '热带油料作物' },
  { key: 7, display_name: '热带香辛饮料作物' },
  { key: 8, display_name: '热带花卉' },
  { key: 9, display_name: '热带纤维植物' },
  { key: 10, display_name: '热带特种蔬菜' }
]

const fruitTypeKeyValue = fruitTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

const resourceTypeOptions = [
  { key: 1, display_name: '野生资源' },
  { key: 2, display_name: '半野生资源' },
  { key: 3, display_name: '地方品种' },
  { key: 4, display_name: '选育品种' },
  { key: 5, display_name: '品系' },
  { key: 6, display_name: '遗传材料其他' }
]

const resourceTypeKeyValue = resourceTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

const collectMethodOptions = [
  { key: 1, display_name: '收集' },
  { key: 2, display_name: '征集' },
  { key: 3, display_name: '引用' }
]

const collectMethodKeyValue = collectMethodOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

const soilTypeOptions = [
  { key: 1, display_name: '砖红壤' },
  { key: 2, display_name: '赤红壤' },
  { key: 3, display_name: '红壤' },
  { key: 4, display_name: '黄壤' },
  { key: 5, display_name: '黄棕壤' },
  { key: 6, display_name: '棕壤' }
]

const soilTypeKeyValue = soilTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

const collectPlaceEcologyTypeOptions = [
  { key: 1, display_name: '海洋生态系统' },
  { key: 2, display_name: '淡水生态系统' },
  { key: 3, display_name: '冻原生态系统' },
  { key: 4, display_name: '荒漠生态系统' },
  { key: 5, display_name: '草原生态系统' },
  { key: 6, display_name: '森林生态系统' },
  { key: 7, display_name: '农田生态系统' },
  { key: 8, display_name: '城市生态系统' }
]

const collectPlaceEcologyTypeKeyValue = collectPlaceEcologyTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

const collectMaterialTypeOptions = [
  { key: 1, display_name: '种子' },
  { key: 2, display_name: '果实' },
  { key: 3, display_name: '芽' },
  { key: 4, display_name: '芽条' },
  { key: 5, display_name: '花粉' },
  { key: 6, display_name: '组培材料' },
  { key: 7, display_name: '苗木' },
  { key: 8, display_name: '其他' }
]

const collectMaterialTypeKeyValue = collectMaterialTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

// save
const mainPreferenceOptions = [
  { key: 1, display_name: '高产' },
  { key: 2, display_name: '优质' },
  { key: 3, display_name: '抗病' },
  { key: 4, display_name: '抗虫' },
  { key: 5, display_name: '抗逆' },
  { key: 6, display_name: '高校' },
  { key: 7, display_name: '其他' }
]
const mainPreferenceKeyValue = mainPreferenceOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

const measuringUnitOptions = [
  { key: 1, display_name: 'g' },
  { key: 2, display_name: 'kg' },
  { key: 3, display_name: '斤' },
  { key: 4, display_name: '公斤' },
  { key: 5, display_name: '株' }
]
const measuringUnitKeyValue = measuringUnitOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  computed: {
    fruitTypeCompute() {
      return fruitTypeKeyValue[this.enterTemp.type]
    },
    mainPreferenceCompute() {
      return mainPreferenceKeyValue[this.saveTemp.type]
    },
    measuringUnitCompute() {
      return measuringUnitKeyValue[this.saveTemp.measuringUnit]
    },
    saveTypeCompute() {
      return fruitTypeKeyValue[this.saveTemp.type]
    },
    enterTypeCompute() {
      return fruitTypeKeyValue[this.enterTemp.type]
    },
    shareTypeCompute() {
      return fruitTypeKeyValue[this.shareTemp.type]
    }
  },
  filters: {
    fruitTypeFilter(type) {
      return fruitTypeKeyValue[type]
    },
    resourceTypeFilter(type) {
      return resourceTypeKeyValue[type]
    },
    collectMethodFilter(type) {
      return collectMethodKeyValue[type]
    },
    soilTypeFilter(type) {
      return soilTypeKeyValue[type]
    },
    collectPlaceEcologyFilter(type) {
      return collectPlaceEcologyTypeKeyValue[type]
    },
    collectMaterialTypeFilter(type) {
      return collectMaterialTypeKeyValue[type]
    },
    mainPreferenceFilter(type) {
      return mainPreferenceKeyValue[type]
    },
    measuringUnitFilter(type) {
      return measuringUnitKeyValue[type]
    },
    shareModeFilter(type) {
      return shareModeKeyValue[type]
    },
    shareUseFilter(type) {
      return shareUseKeyValue[type]
    },

    statusFilter(status) {
      const statusMap = {
        0: 'primary',
        1: 'success',
        2: 'warning',
        3: 'danger'
      }
      return statusMap[status]
    },
    contadictFilter(status) {
      const statusMap = {
        0: 'success',
        1: 'danger'
      }
      return statusMap[status]
    }

  },
  data() {
    return {
      fruitTypeOptions,
      resourceTypeOptions,
      collectMethodOptions,
      soilTypeOptions,
      collectPlaceEcologyTypeOptions,
      collectMaterialTypeOptions,
      mainPreferenceOptions,
      measuringUnitOptions,
      shareModeOptions,
      shareUseOptions,
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
        status: undefined,
        collectID: undefined,

        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['待保存', '待录入', '待共享', '已共享'],
      showReviewer: false,
      enterTemp: {
        enterID: undefined,
        type: undefined,
        name: undefined,
        certifier: '',
        certifyOrg: '',
        certifyPlace: '',
        certifyYear: '',
        operationRange: '',
        enterRemark: ''
      },
      shareTemp: {
        shareID: undefined,
        type: undefined,
        name: undefined,
        shareObj: '',
        contactInfo: '',
        shareMode: '',
        shareUse: '',
        shareNum: '',
        shareBeginTime: '',
        shareEndTime: ''
      },
      dialogRefuseVisible: false,
      refuseID: undefined,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '新建'
      },
      dialogCollectionVisible: false,
      dialogCreateVisible: false,

      dialogSaveVisible: false,
      saveInfo: {},
      enterInfo: {},
      shareInfo: {},
      enterRules: {
        enterID: [{ required: true, message: 'enterID is required', trigger: 'blur' }],
        certifier: [{ required: true, message: 'certifier is required', trigger: 'blur' }],
        certifyOrg: [{ required: true, message: 'certifyOrg is required', trigger: 'blur' }]
      },

      shareRules: {
        shareID: [{ required: true, message: 'shareID is required', trigger: 'blur' }],
        contactInfo: [{ required: true, message: 'contactInfo is required', trigger: 'blur' }],
        shareBeginTime: [{ required: true, message: 'shareBeginTime is required', trigger: 'blur' }],
        shareEndTime: [{ required: true, message: 'shareEndTime is required', trigger: 'blur' }],
        shareNum: [{ required: true, message: 'shareNum is required', trigger: 'blur' }],
        shareUse: [{ required: true, message: 'shareUse is required', trigger: 'blur' }],
      },

      downloadLoading: false
    }
  },

  created() {
    this.getList()
  },
  methods: {
    formatYear(value) {
      var dt = new Date(value)
      let year = dt.getFullYear()
      return `${year}`
    },
    formatDate(value) {
      var dt = new Date(value)
      let year = dt.getFullYear()
      let month = (dt.getMonth() + 1).toString().padStart(2, '0')
      let date = dt.getDate().toString().padStart(2, '0')
      let hour = dt.getHours().toString().padStart(2, '0')
      let minute = dt.getMinutes().toString().padStart(2, '0')
      let second = dt.getSeconds().toString().padStart(2, '0')
      return `${year}-${month}-${date} ${hour}:${minute}:${second}`
    },
    viewDetails(id) {
      this.handleFetchEnter(id)
    },

    getList() {
      this.listLoading = true
      fetchShareListByPage(this.listQuery.page, this.listQuery.limit).then(response => {
        this.list = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
      fetchShareTotal().then(response => {
        this.total = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },

    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },

    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },

    resetShareTemp() {
      this.shareTemp = {
        shareID: undefined,
        type: undefined,
        name: undefined,
        shareObj: '',
        contactInfo: '',
        shareMode: '',
        shareUse: '',
        shareNum: '',
        shareBeginTime: '',
        shareEndTime: ''
      }
    },
    handleCreateShareInfo(data) {
      this.resetShareTemp()
      this.enterTemp = Object.assign({}, data) // copy obj
      this.shareTemp.shareID = data.enterID
      // console.log(data.enterID)
      this.shareTemp.type = data.type
      this.shareTemp.name = data.name

      this.dialogSaveVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    createShareInfo() {
      this.$refs['dataForm'].validate((valid) => {
        // console.log(valid)
        if (valid) {
          // this.enterTemp.certifyYear = this.formatYear(this.enterTemp.certifyYear)
          this.shareTemp.shareBeginTime = this.formatDate(this.shareTemp.shareBeginTime)
          this.shareTemp.shareEndTime = this.formatDate(this.shareTemp.shareEndTime)
          createShare(this.shareTemp).then(() => {
            const index = this.list.findIndex(v => v.enterID === this.shareTemp.shareID)
            this.enterTemp.isContradict = 0
            this.enterTemp.status = 3
            this.list.splice(index, 1, this.enterTemp)
            this.dialogSaveVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },

    handleUpdate(row) {
      // console.log('--->' + row.saveID)
      this.shareTemp = Object.assign({}, row) // copy obj
      this.shareTemp.shareBeginTime = new Date()
      this.shareTemp.shareEndTime = new Date()
      this.dialogStatus = 'update'
      this.dialogCreateVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm2'].clearValidate()
      })
    },

    updateEnterInfo() {
      this.shareTemp.shareBeginTime = this.formatYear(this.shareTemp.shareBeginTime)
      this.shareTemp.shareEndTime = this.formatYear(this.shareTemp.shareEndTime)
      this.$refs['dataForm2'].validate((valid) => {
        // console.log(valid)
        if (valid) {
          const tempData = Object.assign({}, this.shareTemp)
          updateShare(tempData).then(() => {
            const index = this.list.findIndex(v => v.shareID === this.shareTemp.shareID)
            this.shareTemp.isContradict = 0
            this.list.splice(index, 1, this.shareTemp)
            this.dialogCreateVisible = false
            this.$notify({
              title: 'Success',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },

    handleFetchEnter(id) {
      fetchShare(id).then(response => {
        this.shareInfo = response.data
        // console.log(response.data)
        this.dialogCollectionVisible = true
      })
    },

    handleDelete(row) {
      this.$confirm('确定删除这条信息吗', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const index = this.list.findIndex(v => v.shareID === row.shareID)
          this.list.splice(index, 1)
          deleteShare(row.shareID)
          this.$notify({
            title: 'Success',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        })
        .catch(err => {
          console.error(err)
        })
    },

    handleRefuse(row) {
      this.dialogRefuseVisible = true
      this.shareTemp = row
      this.refuseID = row.shareID
    },

    cancelRefuse() {
      this.dialogRefuseVisible = false
      this.refuseID = undefined
    },

    refuseEnter() {
      const index = this.list.findIndex(v => v.shareID === this.refuseID)
      this.shareTemp.isContradict = 1
      this.list.splice(index, 1, this.shareTemp)
      contradictShare(this.refuseID)
        .catch(err => {
          console.error(err)
        })
      this.dialogRefuseVisible = false
      this.$notify({
        title: 'Success',
        message: '反驳成功',
        type: 'success',
        duration: 2000
      })

    },

    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['ShareID', 'Type', 'Name', 'ShareObj', 'ContactInfo', 'ShareMode', 'ShareUse', 'ShareNum', 'ShareBeginTime', 'ShareEndTime']
        const filterVal = ['shareID', 'type', 'name', 'shareObj', 'contactInfo', 'shareMode', 'shareUse', 'shareNum', 'shareBeginTime', 'shareEndTime']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          console.log(j + '--->' + v[j])
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>


<style scoped>
.buttons-row {
  display: flex;
  justify-content: center;
}

.buttons-row > * {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #409EFF;
  background-color: transparent;
  border-color: transparent;
  margin: 2px;
  width: 80px;
  height: 30px;
  font-size: 14px;
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
  font-size: 16px;
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
