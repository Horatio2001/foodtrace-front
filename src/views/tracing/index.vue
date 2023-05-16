<template>
  <div class="mixin-components-container">
    <el-row :gutter="20" style="margin-top:50px;">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <p class="tit" align="center">区块链溯源查询</p>
        </div>
        <div style="height:100px;">
          <el-form :model="demo" :rules="demoRules">
            <el-form-item prop="title">
              <md-input v-model="demo.txHash" icon="el-icon-search" name="title" placeholder="输入确权编号">
                请输入溯源确权编号
              </md-input>
            </el-form-item>
          </el-form>
        </div>
        <el-button @click="handleTracing" class="pan-btn green-btn">溯源查询</el-button>
      </el-card>
    </el-row>

    <span v-if="isCertified===true">
      <el-dialog :visible.sync="dialogWaitingVisible" title="信息详情"
                 class="collection-dialog"
      >
        <p>各节点进行帐本验证中，请稍作等待</p>
      </el-dialog>


    <el-dialog :visible.sync="dialogCollectionVisible" title="信息详情" :close-on-click-modal="true"
               :show-close="true"
               class="collection-dialog"
    >
      <h2 class="detail-title">交易信息：</h2>
      <div class="detail-table" title="交易信息">
        <div class="detail-row">
          <div class="detail-label">交易创建者:</div>
          <div class="detail-value">{{ this.txInfo.creator }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">通道名称:</div>
          <div class="detail-value">{{ this.txInfo.channelName }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">交易哈希:</div>
          <div class="detail-value">{{ this.txInfo.txID }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">区块哈希:</div>
          <div class="detail-value">{{ this.txInfo.blockHash }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">交易类型:</div>
          <div class="detail-value">{{ this.txInfo.type }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">交易链码:</div>
          <div class="detail-value">{{ this.txInfo.chainCode }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">交易时间:</div>
          <div class="detail-value">{{ formatDate(this.txInfo.timeStamp) }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">交易负载哈希:</div>
          <div class="detail-value">{{ this.txInfo.payloadProposalHash }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">效用码:</div>
          <div class="detail-value">{{ this.txInfo.validationCode }}</div>
        </div>
      </div>

      <h2 class="detail-title">区块信息：</h2>
      <div class="detail-table" title="收集信息">
        <div class="detail-row">
          <div class="detail-label">区块号:</div>
          <div class="detail-value">{{ this.blockInfo.blockNumber }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">通道名称:</div>
          <div class="detail-value">{{ this.blockInfo.channelName }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">交易数量:</div>
          <div class="detail-value">{{ this.blockInfo.transactionCount }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">区块哈希:</div>
          <div class="detail-value">{{ this.blockInfo.blockHash }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">数据哈希:</div>
          <div class="detail-value">{{ this.blockInfo.dataHash }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">前一区块哈希:</div>
          <div class="detail-value">{{ this.blockInfo.previousHash }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">交易哈希:</div>
          <div class="detail-value">{{ this.blockInfo.transactions }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">区块类型:</div>
          <div class="detail-value">{{ this.blockInfo.type }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">区块创建时间:</div>
          <div class="detail-value">{{ formatDate(this.blockInfo.time) }}</div>
        </div>
      </div>

      <h2 class="detail-title">收集信息：</h2>
      <div class="detail-table" title="收集信息">
        <div class="detail-row">
          <div class="detail-label">收集号:</div>
          <div class="detail-value">{{ this.collectInfo.collect_id }}</div>
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
          <div class="detail-value">{{ this.collectInfo.germplasm_name }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">种质外文名称:</div>
          <div class="detail-value">{{ this.collectInfo.germplasm_Name_En }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">科名:</div>
          <div class="detail-value">{{ this.collectInfo.section_name }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">属名:</div>
          <div class="detail-value">{{ this.collectInfo.generic_name }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">学名:</div>
          <div class="detail-value">{{ this.collectInfo.scientific_name }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">种质资源类型:</div>
          <div class="detail-value">{{ this.collectInfo.resource_type | resourceTypeFilter }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">收集方式:</div>
          <div class="detail-value">{{ this.collectInfo.collect_method | collectMethodFilter }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">种质来源:</div>
          <div class="detail-value">{{ this.collectInfo.germplasm_source }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">来源国:</div>
          <div class="detail-value">{{ this.collectInfo.source_country }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">来源省(州、邦):</div>
          <div class="detail-value">{{ this.collectInfo.source_province }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">来源地:</div>
          <div class="detail-value">{{ this.collectInfo.source }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">来源机构:</div>
          <div class="detail-value">{{ this.collectInfo.source_org }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">原产国:</div>
          <div class="detail-value">{{ this.collectInfo.origin_country }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">原产地:</div>
          <div class="detail-value">{{ this.collectInfo.origin_place }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">收集地经度:</div>
          <div class="detail-value">{{ this.collectInfo.collect_place_longitude }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">收集地纬度:</div>
          <div class="detail-value">{{ this.collectInfo.collect_place_latitude }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">收集地海拔:</div>
          <div class="detail-value">{{ this.collectInfo.collect_place_altitude }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">收集地土壤类型:</div>
          <div class="detail-value">{{ this.collectInfo.collect_place_soil_type | soilTypeFilter }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">收集地生态类型:</div>
          <div class="detail-value">{{ this.collectInfo.collect_place_ecology_type | collectPlaceEcologyFilter }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">收集材料类型:</div>
          <div class="detail-value">{{ this.collectInfo.collect_material_type | collectMaterialTypeFilter }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">收集人:</div>
          <div class="detail-value">{{ this.collectInfo.collect_people }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">收集单位:</div>
          <div class="detail-value">{{ this.collectInfo.collect_unit }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">原生境图片:</div>
          <div class="detail-value">
            <img width="135px" height="140px" :src=" this.collectInfo.image===''?'http://101.43.206.180/defaultImage.png' : this.collectInfo.image.charAt[0]==='/'? ('http://101.43.206.180' + this.collectInfo.image) : ('http://101.43.206.180/' + this.collectInfo.image)">
          </div>
        </div>
        <div class="detail-row">
          <div class="detail-label">收集时间:</div>
          <div class="detail-value">{{ formatDate(this.collectInfo.collect_time) }}</div>
        </div>

        <div class="detail-row">
          <div class="detail-label">项目归口:</div>
          <div class="detail-value">{{ this.collectInfo.species_name }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">备注:</div>
          <div class="detail-value">{{ this.collectInfo.collect_remark }}</div>
        </div>
      </div>

      <h2 class="detail-title">保存信息：</h2>

      <div class="detail-table">
        <div class="detail-row">
          <div class="detail-label">主要特征:</div>
          <div class="detail-value">{{ this.saveInfo.main_preference | mainPreferenceFilter }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">主要用途:</div>
          <div class="detail-value">{{ this.saveInfo.main_use }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">保存设施:</div>
          <div class="detail-value">{{ this.saveInfo.preservation_facility }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">种质类型:</div>
          <div class="detail-value">{{ this.saveInfo.germplasm_type }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">保存数量:</div>
          <div class="detail-value">{{ this.saveInfo.save_quantity }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">计量单位:</div>
          <div class="detail-value">{{ this.saveInfo.measuring_unit }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">保存单位:</div>
          <div class="detail-value">{{ this.saveInfo.save_unit }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">保存库:</div>
          <div class="detail-value">{{ this.saveInfo.save_vault }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">保存地点:</div>
          <div class="detail-value">{{ this.saveInfo.save_place }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">入库年份:</div>
          <div class="detail-value">{{ formatYear(this.saveInfo.ware_housing_year) }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">保存性质:</div>
          <div class="detail-value">{{ this.saveInfo.save_property }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">种质图片:</div>
          <div class="detail-value">
            <img width="135px" height="140px" :src="(this.saveInfo.germplasm_image === '')?'http://101.43.206.180/defaultImage.png' : this.saveInfo.germplasm_image.charAt[0] === '/'? ('http://101.43.206.180' + this.saveInfo.germplasm_image) : ('http://101.43.206.180/' + this.saveInfo.germplasm_image)">
          </div>
        </div>
        <div class="detail-row">
          <div class="detail-label">资源描述:</div>
          <div class="detail-value">{{ this.saveInfo.resource_description }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">资源备注:</div>
          <div class="detail-value">{{ this.saveInfo.resource_remark }}</div>
        </div>
      </div>
      <h2 class="detail-title">录入信息：</h2>
        <div class="detail-table">
        <div class="detail-row">
          <div class="detail-label">鉴定人:</div>
          <div class="detail-value">{{ this.enterInfo.certifier }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">鉴定机构:</div>
          <div class="detail-value">{{ this.enterInfo.certify_org }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">鉴定地点:</div>
          <div class="detail-value">{{ this.enterInfo.certify_place }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">鉴定年份:</div>
          <div class="detail-value">{{ this.formatYear(this.enterInfo.certify_year) }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">操作范围:</div>
          <div class="detail-value">{{ this.enterInfo.operation_range }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">录入备注:</div>
          <div class="detail-value">{{ this.enterInfo.enter_remark }}</div>
        </div>
      </div>
      <h2 class="detail-title">共享信息：</h2>
        <div class="detail-table">
        <div class="detail-row">
          <div class="detail-label">共享对象:</div>
          <div class="detail-value">{{ this.shareInfo.share_obj }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">联系方式:</div>
          <div class="detail-value">{{ this.shareInfo.contact_info }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">共享方式:</div>
          <div class="detail-value">{{ this.shareInfo.share_mode | shareModeFilter }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">共享用途:</div>
          <div class="detail-value">{{ this.shareInfo.share_use | shareUseFilter }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">共享份次:</div>
          <div class="detail-value">{{ this.shareInfo.share_num }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">共享开始时间:</div>
          <div class="detail-value">{{ formatDate(this.shareInfo.share_begin_time) }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">共享结束时间:</div>
          <div class="detail-value">{{ formatDate(this.shareInfo.share_end_time) }}</div>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleDownload()" type="primary">下载历史记录</el-button>
        <el-button @click="dialogCollectionVisible = false" type="primary">关闭</el-button>
      </span>
    </el-dialog>
  </span>
    <span v-else-if="isCertified===false">
    <el-dialog :visible.sync="dialogCollectionVisible" title="信息详情" :close-on-click-modal="true"
               :show-close="true"
               class="collection-dialog"
    >
      <p>该确权编号不存在！</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogCollectionVisible = false" class="pan-btn light-blue-btn">关闭</el-button>
      </span>
    </el-dialog>
  </span>

  </div>
</template>

<script>
import PanThumb from '@/components/PanThumb'
import MdInput from '@/components/MDinput'
import Mallki from '@/components/TextHoverEffect/Mallki'
import waves from '@/directive/waves/index.js' // 水波纹指令

import { getHistory, fetchBlockByHash, fetchCertificateByHash, fetchTxByID, getCertifiedInfoById } from '@/api/tracing'

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
  name: 'ComponentMixinDemo',
  components: {
    PanThumb,
    Mallki,
    MdInput
  },
  directives: {
    waves
  },
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
    shareModeFilter(type) {
      return shareModeKeyValue[type]
    },
    shareUseFilter(type) {
      return shareUseKeyValue[type]
    }

  },
  data() {
    return {
      info: {},
      collectInfo: {},
      saveInfo: {},
      enterInfo: {},
      shareInfo: {},
      txInfo: {},
      blockInfo: {},
      downloadData: null,
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

      dialogCollectionVisible: false,
      dialogWaitingVisible: false,
      demo: {
        txHash: ''
      },
      demoRules: {
        txHash: [{ required: true, message: '尚未输入确权编号', trigger: 'change' }]
      },
      certificate: '',
      isCertified: false,
      datas: [],
      fields: []
    }
  },
  methods: {
    formatYear(value) {
      if (value === '') {
        return ''
      }
      var dt = new Date(value)
      let year = dt.getFullYear()
      return `${year}`
    },
    formatDate(value) {
      if (value === '') {
        return ''
      }
      var dt = new Date(value)
      let year = dt.getFullYear()
      let month = (dt.getMonth() + 1).toString().padStart(2, '0')
      let date = dt.getDate().toString().padStart(2, '0')
      let hour = dt.getHours().toString().padStart(2, '0')
      let minute = dt.getMinutes().toString().padStart(2, '0')
      let second = dt.getSeconds().toString().padStart(2, '0')
      return `${year}-${month}-${date} ${hour}:${minute}:${second}`
    },

    handleTracing() {
      fetchCertificateByHash(this.demo.txHash).then(response => {
        // console.log(this.demo.txHash)
        let hash = this.demo.txHash
        this.certificate = response.data
        this.isCertified = response.data !== 200
        if (this.isCertified === true) {
          this.dialogWaitingVisible = true
          fetchTxByID(hash).then(response => {
            this.txInfo = response.data
            fetchBlockByHash(this.txInfo.blockHash).then(response => {
              this.blockInfo = response.data
            })
            getCertifiedInfoById(this.certificate.id).then(response => {
              this.info = response.data
              this.collectInfo = response.data.collect_info
              // console.log('--->' + this.collectInfo.Image)
              // if (this.collectInfo.Image === '') {
              //   this.collectInfo.Image = '/defaultImage.png'
              // }
              this.saveInfo = response.data.save_info
              // if (this.saveInfo.germplasmImage === '') {
              //   this.saveInfo.germplasmImage = '/defaultImage.png'
              // }
              this.enterInfo = response.data.enter_info
              this.shareInfo = response.data.share_info
              this.dialogCollectionVisible = true
              this.dialogWaitingVisible = false
            })
          })
        } else {
          this.dialogCollectionVisible = true
        }
      })
    },
    handleDownload() {
      let data = this.collectInfo.collect_id
      getHistory(data).then(response => {
        this.downloadData = response.data
        let arr = { 'history': this.downloadData }
        let str = JSON.stringify(arr, null, 2)
        let uri = 'data:text/csv;charset=utf-8, \ufeff' + encodeURIComponent(str)
        let link = document.createElement('a')
        link.href = uri
        link.download = data + '_history.json'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
    },
    saveJSON(jsonData, asFilename) {
      const filename = asFilename || `${(new Date()).toISOString()}.json`
      const data = typeof jsonData === 'object' ? JSON.stringify(jsonData, undefined, 2) : jsonData
      const blob = new Blob([data], { type: 'text/json' })
      const link = document.createElement('a')
      link.setAttribute('style', 'display: none')
      link.download = filename
      link.href = window.URL.createObjectURL(blob)
      link.dataset.downloadurl = ['text/json', link.download, link.href].join(':')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },

    handleFetchTxInfo(TxHash) {
      fetchTxByID(TxHash).then(response => {
        this.txInfo = response.data
      })
    },
    handleFetchBlockInfo(TxHash) {
      fetchBlockByHash(TxHash).then(response => {
        this.blockInfo = response.data
      })
    },
    handleFetchInfo(Id) {
      getCertifiedInfoById(Id).then(response => {
        this.info = response.data
        this.collectInfo = response.data.collect_info
        this.saveInfo = response.data.save_info
        this.enterInfo = response.data.enter_info
        this.shareInfo = response.data.share_info
      })
    }
  }
}
</script>

<style scoped>
.mixin-components-container {
  background-color: #f0f2f5;
  padding: 30px;
  min-height: calc(100vh - 84px);
}

.component-item {
  min-height: 100px;
}

.tit {
  color: #388648;
  font-size: 36px;
  font-weight: 700;
  position: relative;
  top: -6px;
  left: 8px;
  letter-spacing: 20px;
  font-family: STHeiti;
  margin: 20px 0;
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
