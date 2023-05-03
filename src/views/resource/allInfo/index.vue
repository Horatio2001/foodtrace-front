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
      style="width: auto;"
      @sort-change="sortChange"
    >
      <el-table-column label="收集号" prop="collectID" sortable="custom" align="center" width="80"
                       :class-name="getSortClass('collectID')"
      >
        <template slot-scope="{row}">
          <span>{{ row.collectID }}</span>
        </template>
      </el-table-column>
      <el-table-column label="流程状态" prop="status" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row | statusFilter" :effect="row | effectFilter">
            <span v-if="row.status === 0">待保存</span>
            <span v-else-if="row.status === 1">待录入</span>
            <span v-else-if="row.status === 2">待共享</span>
            <span v-else-if="row.status === 3 && row.isLoaded === 0">已共享</span>
            <span v-else-if="row.status === 3 && row.isLoaded === 1 && row.isCertified === 0">尚无证书</span>
            <span v-else-if="row.status === 3 && row.isLoaded === 1 && row.isCertified === 1">已存证</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="作物类别" prop="type" align="center" width="100">
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
      <el-table-column label="种质名称" prop="germplasmName" align="center" width="100">
        <template slot-scope="{row}">
          <span>
            {{ row.germplasmName }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="科名" prop="sectionName" align="center" width="100">
        <template slot-scope="{row}">
          <span>
            {{ row.sectionName }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="属名" prop="genericName" align="center" width="100">
        <template slot-scope="{row}">
          <span>
            {{ row.genericName }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="学名" prop="scientificName" align="center" width="100">
        <template slot-scope="{row}">
          <span>
            {{ row.scientificName }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="种质资源类型" prop="resourceType" align="center" width="100">
        <template slot-scope="{row}">
          <span>
            {{ row.resourceType | resourceTypeFilter }}
          </span>
        </template>
      </el-table-column>

      <el-table-column label="项目归口" prop="speciesName" align="center" width="100">
        <template slot-scope="{row}">
          <span>
            {{ row.speciesName }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="采集人" prop="collectPeople" align="center" width="100">
        <template slot-scope="{row}">
          <span>
            {{ row.collectPeople }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="采集单位" prop="collectUnit" align="center" width="100">
        <template slot-scope="{row}">
          <span>
            {{ row.collectUnit }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="采集时间" prop="collectTime" align="center" width="100">
        <template slot-scope="{row}">
          <span>
            {{ formatDate(row.collectTime) }}
          </span>
        </template>
      </el-table-column>

      <el-table-column label="操作状态" prop="idContradict" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.isContradict | contadictFilter" :effect="row | loadedFilter">
            <span v-if="row.isLoaded === 1">已上链</span>
            <span v-else-if="row.isContradict === 0">正常</span>
            <span v-else-if="row.isContradict === 1">反驳中</span>
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <div class="buttons-row">
            <el-button type="primary" size="small" @click="viewDetails(row.collectID)">
              查看详情
            </el-button>
            <el-button v-if="row.isLoaded === 0" type="primary" size="small" @click="handleDelete(row)">
              删除
            </el-button>
          </div>
          <div class="buttons-row">
            <el-button v-if="row.isLoaded === 0 && row.status === 3 && row.isContradict === 0" type="primary"
                       size="small" @click="handleLoad(row)"
            >
              存证
            </el-button>
            <el-button v-if="row.isLoaded === 1 && row.isCertified === 0" type="primary"
                       size="small" @click="handleGenerateCertificate(row)"
            >
              生成证书
            </el-button>
            <el-button v-if="row.isLoaded === 1 && row.isCertified === 1" type="primary"
                       size="small" @click="handleQueryCertificate(row)"
            >
              查看证书
            </el-button>
          </div>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                @pagination="getList"
    />

    <el-dialog :visible.sync="dialogCollectionVisible" title="信息详情" :close-on-click-modal="true"
               :show-close="true"
               class="collection-dialog"
    >
      <h2 class="detail-title">收集信息：</h2>
      <div class="detail-table" title="收集信息">
        <div class="detail-row">
          <div class="detail-label">收集号:</div>
          <div class="detail-value">{{ this.collectInfo.collectID }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">作物类别:</div>
          <div class="detail-value">{{ this.collectInfo.type | fruitTypeFilter }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">作物名称:</div>
          <div class="detail-value">{{ this.collectInfo.name }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">种质名称:</div>
          <div class="detail-value">{{ this.collectInfo.germplasmName }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">种质外文名称:</div>
          <div class="detail-value">{{ this.collectInfo.germplasmNameEn }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">科名:</div>
          <div class="detail-value">{{ this.collectInfo.sectionName }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">属名:</div>
          <div class="detail-value">{{ this.collectInfo.genericName }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">学名:</div>
          <div class="detail-value">{{ this.collectInfo.scientificName }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">种质资源类型:</div>
          <div class="detail-value">{{ this.collectInfo.resourceType | resourceTypeFilter }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">收集方式:</div>
          <div class="detail-value">{{ this.collectInfo.collectMethod | collectMethodFilter }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">种质来源:</div>
          <div class="detail-value">{{ this.collectInfo.germplasmSource }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">来源国:</div>
          <div class="detail-value">{{ this.collectInfo.sourceCountry }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">来源省(州、邦):</div>
          <div class="detail-value">{{ this.collectInfo.sourceProvince }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">来源地:</div>
          <div class="detail-value">{{ this.collectInfo.source }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">来源机构:</div>
          <div class="detail-value">{{ this.collectInfo.sourceOrg }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">原产国:</div>
          <div class="detail-value">{{ this.collectInfo.originCountry }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">原产地:</div>
          <div class="detail-value">{{ this.collectInfo.originPlace }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">收集地经度:</div>
          <div class="detail-value">{{ this.collectInfo.collectPlaceLongitude }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">收集地纬度:</div>
          <div class="detail-value">{{ this.collectInfo.collectPlaceLatitude }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">收集地海拔:</div>
          <div class="detail-value">{{ this.collectInfo.collectPlaceAltitude }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">收集地土壤类型:</div>
          <div class="detail-value">{{ this.collectInfo.collectPlaceSoilType | soilTypeFilter }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">收集地生态类型:</div>
          <div class="detail-value">{{ this.collectInfo.collectPlaceEcologyType | collectPlaceEcologyFilter }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">收集材料类型:</div>
          <div class="detail-value">{{ this.collectInfo.collectMaterialType | collectMaterialTypeFilter }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">收集人:</div>
          <div class="detail-value">{{ this.collectInfo.collectPeople }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">收集单位:</div>
          <div class="detail-value">{{ this.collectInfo.collectUnit }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">收集时间:</div>
          <div class="detail-value">{{ formatDate(this.collectInfo.collectTime) }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">原生境图片:</div>
          <div class="detail-value">{{ this.collectInfo.image }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">项目归口:</div>
          <div class="detail-value">{{ this.collectInfo.speciesName }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">备注:</div>
          <div class="detail-value">{{ this.collectInfo.collectRemark }}</div>
        </div>
      </div>

      <h2 class="detail-title">保存信息：</h2>

      <span v-if="collectInfo.status > 0">
      <div class="detail-table">
        <div class="detail-row">
          <div class="detail-label">主要特征:</div>
          <div class="detail-value">{{ this.saveInfo.mainPreference | mainPreferenceFilter }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">主要用途:</div>
          <div class="detail-value">{{ this.saveInfo.mainUse }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">保存设施:</div>
          <div class="detail-value">{{ this.saveInfo.preservationFacility }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">种质类型:</div>
          <div class="detail-value">{{ this.saveInfo.germplasmType }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">保存数量:</div>
          <div class="detail-value">{{ this.saveInfo.saveQuantity }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">计量单位:</div>
          <div class="detail-value">{{ this.saveInfo.measuringUnit }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">保存单位:</div>
          <div class="detail-value">{{ this.saveInfo.saveUnit }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">保存库:</div>
          <div class="detail-value">{{ this.saveInfo.saveVault }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">保存地点:</div>
          <div class="detail-value">{{ this.saveInfo.savePlace }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">入库年份:</div>
          <div class="detail-value">{{ formatYear(this.saveInfo.warehousingYear) }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">保存性质:</div>
          <div class="detail-value">{{ this.saveInfo.saveProperty }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">种质图片:</div>
          <div class="detail-value">{{ this.saveInfo.germplasmImage }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">资源描述:</div>
          <div class="detail-value">{{ this.saveInfo.resourceDescription }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">资源备注:</div>
          <div class="detail-value">{{ this.saveInfo.resourceRemark }}</div>
        </div>
      </div>
      </span>
      <span v-else-if="collectInfo.status < 1">
        <h4>暂无保存信息</h4>
      </span>

      <h2 class="detail-title">录入信息：</h2>
      <span v-if="collectInfo.status > 1">
        <div class="detail-table">
        <div class="detail-row">
          <div class="detail-label">鉴定人:</div>
          <div class="detail-value">{{ this.enterInfo.certifier }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">鉴定机构:</div>
          <div class="detail-value">{{ this.enterInfo.certifyOrg }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">鉴定地点:</div>
          <div class="detail-value">{{ this.enterInfo.certifyPlace }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">鉴定年份:</div>
          <div class="detail-value">{{ this.formatYear(this.enterInfo.certifyYear) }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">操作范围:</div>
          <div class="detail-value">{{ this.enterInfo.operationRange }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">录入备注:</div>
          <div class="detail-value">{{ this.enterInfo.enterRemark }}</div>
        </div>
      </div>
      </span>
      <span v-else-if="collectInfo.status < 2">
        <h4>暂无录入信息</h4>
      </span>

      <h2 class="detail-title">共享信息：</h2>
      <span v-if="collectInfo.status > 2">
        <div class="detail-table">
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
          <div class="detail-value">{{ this.shareInfo.shareMode | shareModeFilter }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">共享用途:</div>
          <div class="detail-value">{{ this.shareInfo.shareUse | shareUseFilter }}</div>
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
      </span>
      <span v-else-if="collectInfo.status < 3">
        <h4>暂无共享信息</h4>
      </span>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogCollectionVisible = false" type="primary">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import {
  fetchInfoListByPage,
  fetchInfo,
  fetchInfoTotal,
  loadInfo,
  deleteInfo,
  queryCertificate,
  generateCertificate
} from '@/api/allInfo'

import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import list from 'echarts/src/data/List'

const shareUseOptions = [
  { key: 1, display_name: '科学研究' },
  { key: 2, display_name: '组织培养' },
  { key: 3, display_name: '成份分析' },
  { key: 4, display_name: '资源交换' },
  { key: 5, display_name: '样品补充' },
  { key: 6, display_name: '实验耗材' },
  { key: 7, display_name: '信息交换' }
]

const shareUseKeyValue = shareUseOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

const shareModeOptions = [
  { key: 1, display_name: '全部共享' },
  { key: 2, display_name: '部分共享' },
  { key: 3, display_name: '信息共享' },
  { key: 4, display_name: '实体共享' }
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
      return fruitTypeKeyValue[this.collectionTemp.type]
    },
    saveTypeCompute() {
      return fruitTypeKeyValue[this.saveTemp.type]
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

    statusFilter(row) {
      const statusMap = {
        0: 'primary',
        1: 'success',
        2: 'warning',
        3: 'danger'
      }
      return statusMap[row.status]
    },

    effectFilter(row) {
      const statusMap = {
        0: 'light',
        1: 'dark'
      }
      return statusMap[row.isLoaded]
    },

    loadedFilter(row) {
      const statusMap = {
        0: 'light',
        1: 'dark'
      }
      return statusMap[row.isLoaded]
    },

    contadictFilter(status) {
      const statusMap = {
        0: 'success',
        1: 'danger'
      }
      return statusMap[status]
    },
    shareModeFilter(type) {
      return shareModeKeyValue[type]
    },
    shareUseFilter(type) {
      return shareUseKeyValue[type]
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
      dialogRefuseVisible: false,
      refuseID: undefined,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '新建'
      },
      dialogCollectionVisible: false,
      dialogCreateVisible: false,
      info: {},
      collectInfo: {},
      saveInfo: {},
      enterInfo: {},
      shareInfo: {},
      dialogSaveVisible: false,
      certificate: {},
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

    getList() {
      this.listLoading = true
      fetchInfoListByPage(this.listQuery.page, this.listQuery.limit).then(response => {
        this.list = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
      fetchInfoTotal().then(response => {
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

    handleLoad(row) {
      this.$confirm('存证后将无法再修改，确定进行存证吗?', '确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          loadInfo(row.collectID).then(() => {
            const temp = Object.assign({}, row)
            const index = this.list.findIndex(v => v.collectID === row.collectID)
            temp.isLoaded = 1
            this.list.splice(index, 1, temp)
            this.$notify({
              title: 'Success',
              message: '存证成功',
              type: 'success',
              duration: 2000
            })
          })
        })
    },

    handleGenerateCertificate(row) {
      this.$confirm('确定生成数权证书吗?', '确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          generateCertificate(row.collectID).then(() => {
            this.$notify({
              title: 'Success',
              message: '您已成功生成授权证书，请稍后点击查看',
              type: 'success',
              duration: 2000
            })
          })
          const index = this.list.findIndex(v => v.collectID === row.collectID)
          this.collectionTemp = row
          this.collectionTemp.isCertified = 1
          this.list.splice(index, 1, this.collectionTemp)
        })
    },
    handleQueryCertificate(data) {
      queryCertificate(data.collectID).then(response => {
        this.certificate = response.data
        console.log(this.certificate)
      })
    },

    viewDetails(id) {
      this.handleFetchCollection(id)
    },

    handleFetchCollection(id) {
      fetchInfo(id).then(response => {
        // console.log(response.data)
        this.collectInfo = response.data.collectInfo
        this.enterInfo = response.data.enterInfo
        this.saveInfo = response.data.saveInfo
        this.shareInfo = response.data.shareInfo

        // this.info = response.data
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
          const index = this.list.findIndex(v => v.collectID === row.collectID)
          this.list.splice(index, 1)
          deleteInfo(row.collectID)
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

    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['CollectID', 'Type', 'Name', 'GermplasmName', 'GermplasmNameEn', 'SectionName', 'GenericName', 'ScientificName', 'ResourceType', 'CollectMethod', 'GermplasmSource', 'SourceCountry', 'SourceProvince', 'Source', 'SourceOrg', 'OriginCountry', 'OriginPlace', 'CollectPlaceLongitude', 'CollectPlaceLatitude', 'CollectPlaceAltitude', 'CollectPlaceSoilType', 'CollectPlaceEcologyType', 'CollectMaterialType', 'CollectPeople', 'CollectUnit', 'CollectTime', 'SpeciesName', 'Image', 'CollectRemark']
        const filterVal = ['collectID', 'type', 'name', 'germplasmName', 'germplasmNameEn', 'sectionName', 'genericName', 'scientificName', 'resourceType', 'collectMethod', 'germplasmSource', 'sourceCountry', 'sourceProvince', 'source', 'sourceOrg', 'originCountry', 'originPlace', 'collectPlaceLongitude', 'collectPlaceLatitude', 'collectPlaceAltitude', 'collectPlaceSoilType', 'collectPlaceEcologyType', 'collectMaterialType', 'collectPeople', 'collectUnit', 'collectTime', 'speciesName', 'image', 'collectRemark']
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

.detail-title {
  /*font-size: 18px;*/
  font-weight: bold;
  color: #333;
  border-radius: 30px;
  margin-bottom: 10px;
  background-color: #f8f8f8;
  border: 1px solid #ccc;
  padding: 20px;
  text-align: center;
}
</style>
