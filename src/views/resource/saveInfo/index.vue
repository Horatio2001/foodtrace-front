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
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="收集号" prop="saveID" sortable="custom" align="center" width="89"
                       :class-name="getSortClass('saveID')"
      >
        <template slot-scope="{row}">
          <span>{{ row.saveID }}</span>
        </template>
      </el-table-column>
      <el-table-column label="流程状态" prop="status" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter" :effect="row | effectFilter">
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
      <el-table-column label="主要特征" prop="mainPreference" align="center" width="100">
        <template slot-scope="{row}">
          <span>
            {{ row.mainPreference | mainPreferenceFilter }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="主要用途" prop="mainUse" align="center" width="100">
        <template slot-scope="{row}">
          <span>
            {{ row.mainUse }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="保存设施" prop="preservationFacility" align="center" width="100">
        <template slot-scope="{row}">
          <span>
            {{ row.preservationFacility }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="种质类型" prop="gerplasmType" align="center" width="100">
        <template slot-scope="{row}">
          <span>
            {{ row.germplasmType }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="保存单位" prop="saveUnit" align="center" width="100">
        <template slot-scope="{row}">
          <span>
            {{ row.saveUnit }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="保存库" prop="saveVault" align="center" width="100">
        <template slot-scope="{row}">
          <span>
            {{ row.saveVault }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="保存性质" prop="SaveProperty" align="center" width="100">
        <template slot-scope="{row}">
          <span>
            {{ row.saveProperty }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="种质图片" prop="GermplasmImage" align="center" width="160">
        <template slot-scope="{row}">
          <span>
            <img width="135px" height="140px" :src="'http://101.43.206.180' + row.germplasmImage">
          </span>
        </template>
      </el-table-column>

      <el-table-column label="操作状态" prop="idContradict" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.isContradict | contadictFilter" :effect="row | effectFilter">
            <span v-if="row.isLoaded === 1">已上链</span>
            <span v-else-if="row.isContradict === 0">正常</span>
            <span v-else-if="row.isContradict === 1">反驳中</span>

          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作员" prop="type" sortable="custom" align="center" width="90">
        <template slot-scope="{row}">
          <span>
            admin
          </span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="250" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <div class="buttons-row">
            <el-button type="primary" size="small" @click="viewDetails(row.saveID)">
              查看详情
            </el-button>
            <el-button v-if="row.isLoaded === 0 && row.status === 1" type="primary" size="small"
                       @click="handleUpdate(row)"
            >
              修改
            </el-button>
            <el-button v-if="row.isLoaded === 0" type="primary" size="small" @click="handleDelete(row)">
              删除
            </el-button>
          </div>
          <div class="buttons-row">
            <el-button v-if="row.isLoaded === 0 && row.status === 1 && row.isContradict === 0" type="primary"
                       size="small" @click="handleRefuse(row)"
            >
              反驳
            </el-button>
            <el-button v-if="row.isLoaded === 0 && row.status === 1 && row.isContradict === 0" type="primary"
                       size="small" @click="handleCreateEnterInfo(row)"
            >
              录入
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                @pagination="getList"
    />

    <el-dialog :visible.sync="dialogCollectionVisible" title="保存信息详情" :close-on-click-modal="true"
               :show-close="true"
               class="collection-dialog"
    >
      <div class="detail-table">
        <div class="detail-row">
          <div class="detail-label">收集号:</div>
          <div class="detail-value">{{ this.saveInfo.saveID }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">作物类别:</div>
          <div class="detail-value">{{ this.saveInfo.type | fruitTypeFilter }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">作物名称:</div>
          <div class="detail-value">{{ this.saveInfo.name }}</div>
        </div>
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
          <div class="detail-value">{{ this.saveInfo.warehousingYear }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">保存性质:</div>
          <div class="detail-value">{{ this.saveInfo.saveProperty }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">种质图片:</div>
          <div class="detail-value">
            <img width="135px" height="140px" :src="'http://101.43.206.180' + this.saveInfo.germplasmImage">
          </div>
        </div>
        <div class="detail-row">
          <div class="detail-label">操作员:</div>
          <div class="detail-value">admin</div>
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
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogCollectionVisible = false" type="primary">关闭</el-button>
      </span>
    </el-dialog>


    <el-dialog :title="'修改'" :visible.sync="dialogCreateVisible">
      <el-form ref="dataForm" :rules="saveRules" :model="saveTemp" label-position="left" label-width="130px"
               style="width: auto; margin-left:50px;"
      >

        <el-form-item label="收集号" prop="collectID">
          <!--          <span v-if="row.status === 0">待保存</span>-->
          <el-input :disabled="true" :readonly="true" v-model="saveTemp.saveID"/>
        </el-form-item>

        <el-form-item label="作物类别" prop="type">
          <el-input :disabled="true" :readonly="true" v-model="fruitTypeCompute"/>
        </el-form-item>

        <el-form-item label="作物名称" prop="name">
          <el-input :disabled="true" :readonly="true" v-model="saveTemp.name"/>
        </el-form-item>

        <el-form-item label="主要特征" prop="mainPreference">
          <!--          <el-input v-model="mainPreferenceCompute" placeholder="请输入主要特征"/>-->
          <el-select v-model="saveTemp.mainPreference" class="filter-item" placeholder="请输入主要特征">
            <el-option v-for="item in mainPreferenceOptions" :key="item.key" :label="item.display_name"
                       :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="主要用途" prop="mainUse">
          <el-input v-model="saveTemp.mainUse" placeholder="请输入主要用途"/>
        </el-form-item>
        <el-form-item label="保存设施" prop="preservationFacility">
          <el-input v-model="saveTemp.preservationFacility" placeholder="请输入保存设施"/>
        </el-form-item>
        <el-form-item label="种质类型" prop="germplasmType">
          <el-input v-model="saveTemp.germplasmType" placeholder="请输入种质类型"/>
        </el-form-item>
        <el-form-item label="保存数量" prop="saveQuantity">
          <el-input v-model="saveTemp.saveQuantity" placeholder="请输入保存数量"/>
        </el-form-item>
        <el-form-item label="计量单位" prop="measuringUnit">
          <el-select v-model="saveTemp.measuringUnit" class="filter-item" placeholder="请输入计量单位">
            <el-option v-for="item in measuringUnitOptions" :key="item.key" :label="item.display_name"
                       :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="保存单位" prop="saveUnit">
          <el-input v-model="saveTemp.saveUnit" placeholder="请输入保存单位"/>
        </el-form-item>
        <el-form-item label="保存库" prop="saveVault">
          <el-input v-model="saveTemp.saveVault" placeholder="请输入保存库"/>
        </el-form-item>
        <el-form-item label="保存地点" prop="savePlace">
          <el-input v-model="saveTemp.savePlace" placeholder="请输入保存地点"/>
        </el-form-item>
        <el-form-item label="入库年份" prop="warehousingYear">
          <!--          <el-input v-model="saveTemp.warehousingYear" placeholder="请输入入库年份"/>-->
          <el-date-picker v-model="saveTemp.warehousingYear" type="year" placeholder="请输入入库年份"
                          style="width:100%"
          />
        </el-form-item>
        <el-form-item label="保存性质" prop="saveProperty">
          <el-input v-model="saveTemp.saveProperty" placeholder="请输入保存性质"/>
        </el-form-item>


        <div class="Post_formbox ">
          <el-form-item label="种质图片" prop="image">
            <div class="uploadImage">
              <el-upload
                action="#"
                accept=""
                :limit="1"
                :before-upload="beforeUpload1"
                :on-change="getLocalImg1"
                list-type="picture-card"
                v-show="!savePic"
              >
                <div class="need_upload">
                  <i slot="default" class="el-icon-plus"></i>
                </div>
              </el-upload>
              <transition name="el-zoom-in-top">
                <div v-show="savePic" class="good_img">
                  <img :src="savePic"/>
                  <i class="el-icon-delete-solid" @click="removePic1"></i>
                </div>
              </transition>
              <transition name="el-fade-in">
                <el-alert
                  title="文件太大了"
                  type="error"
                  description="请上传2M以下的图片"
                  show-icon
                  v-show="picoversizeWarning"
                  @close="closeAlert11"
                >
                </el-alert>
              </transition>
            </div>
          </el-form-item>
        </div>
<!--        <el-form-item label="种质图片" prop="germplasmImage">-->
<!--          <el-input v-model="saveTemp.germplasmImage" placeholder="请输入种质图片"/>-->
<!--        </el-form-item>-->


        <el-form-item label="操作员" prop="operator">
          <span>admin</span>
        </el-form-item>
        <el-form-item label="资源描述" prop="resourceDescription">
          <el-input v-model="saveTemp.resourceDescription" placeholder="请输入资源描述"/>
        </el-form-item>
        <el-form-item label="资源备注" prop="resourceRemark">
          <el-input v-model="saveTemp.resourceRemark" placeholder="请输入资源备注"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCreateVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateSaveInfo()">
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
        <el-button type="primary" @click="refuseSave()">
          确认反驳
        </el-button>
      </div>
    </el-dialog>


    <el-dialog :title="'录入'" :visible.sync="dialogSaveVisible">
      <el-form ref="dataForm" :rules="enterRules" :model="enterTemp" label-position="left" label-width="130px"
               style="width: auto; margin-left:50px;"
      >
        <el-form-item label="收集号" prop="collectID">
          <el-input :disabled="true" :readonly="true" v-model="enterTemp.enterID" placeholder="请输入收集号"/>
        </el-form-item>
        <el-form-item label="作物类别" prop="type">
          <el-input :disabled="true" :readonly="true" v-model="enterTypeCompute"/>
        </el-form-item>
        <el-form-item label="作物名称" prop="name">
          <el-input :disabled="true" :readonly="true" v-model="enterTemp.name"/>
        </el-form-item>
        <el-form-item label="鉴定人" prop="certifier">
          <el-input v-model="enterTemp.certifier" placeholder="请输入鉴定人"/>
        </el-form-item>
        <el-form-item label="鉴定机构" prop="certifyOrg">
          <el-input v-model="enterTemp.certifyOrg" placeholder="请输入鉴定机构"/>
        </el-form-item>
        <el-form-item label="鉴定地点" prop="certifyPlace">
          <el-input v-model="enterTemp.certifyPlace" placeholder="请输入鉴定地点"/>
        </el-form-item>
        <el-form-item label="鉴定年份" prop="certifyYear">
          <el-date-picker v-model="enterTemp.certifyYear" type="year" placeholder="请输入鉴定年份"
                          style="width:100%"
          />
        </el-form-item>
        <el-form-item label="操作范围" prop="operationRange">
          <el-input v-model="enterTemp.operationRange" placeholder="请输入操作范围"/>
        </el-form-item>
        <el-form-item label="录入备注" prop="enterRemark">
          <el-input v-model="enterTemp.enterRemark" placeholder="请输入录入备注"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSaveVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="createEnterInfo()">
          确认录入
        </el-button>
      </div>

    </el-dialog>
  </div>
</template>

<script>

import {
  contradictSave,
  deleteSave,
  fetchSave,
  fetchSaveListByPage,
  fetchSaveTotal,
  updateSave,
  createEnter
} from '@/api/saveInfo'

import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import axios from 'axios'

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
      return fruitTypeKeyValue[this.saveTemp.type]
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
    }
  },
  filters: {
    effectFilter(row) {
      const statusMap = {
        0: 'light',
        1: 'dark',
      }
      return statusMap[row.isLoaded]
    },

    loadedFilter(row) {
      const statusMap = {
        0: 'light',
        1: 'dark',
      }
      return statusMap[row.isLoaded]
    },
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
      collectFile: null,
      saveFile:null,
      formData: new FormData(),
      collectPic: null,
      savePic:null,
      picoversizeWarning: false,
      fruitTypeOptions,
      resourceTypeOptions,
      collectMethodOptions,
      soilTypeOptions,
      collectPlaceEcologyTypeOptions,
      collectMaterialTypeOptions,
      mainPreferenceOptions,
      measuringUnitOptions,
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
      saveTemp: {
        saveID: undefined,
        type: undefined,
        name: undefined,
        mainPreference: '',
        mainUse: '',
        preservationFacility: '',
        germplasmType: '',
        saveQuantity: '',
        measuringUnit: '',
        saveUnit: '',
        saveVault: '',
        savePlace: '',
        warehousingYear: '',
        saveProperty: '',
        resourceDescription: '',
        resourceRemark: '',
        germplasmImage: ''
      },
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
      saveRules: {
        saveID: [{ required: true, message: 'saveID is required', trigger: 'blur' }],
        mainPreference: [{ required: true, message: 'mainPreference is required', trigger: 'blur' }]
      },
      enterRules: {
        enterID: [{ required: true, message: 'enterID is required', trigger: 'blur' }],
        certifier: [{ required: true, message: 'certifier is required', trigger: 'blur' }],
        certifyOrg: [{ required: true, message: 'certifyOrg is required', trigger: 'blur' }]
      },

      downloadLoading: false
    }
  },

  created() {
    this.getList()
  },
  methods: {
    beforeUpload1(file) {
      //限制图片大小为2M以下
      const isLt2M = file.size / 1024 / 1024 < 2
      if (isLt2M) {
        this.formData.append('Image', file)
        this.saveFile = file
        this.nopicWarning = false
      } else {
        this.picoversizeWarning = true
      }
      return false//禁止elementUI的组件自动上传
    },
    getLocalImg1(event) {
      // 获取上传图片的本地url，用于上传前的本地预览
      const isLt2M = event.size / 1024 / 1024 < 2
      if (isLt2M) {
        let url = ''
        if (window.createObjectURL !== undefined) {
          url = window.createObjectURL(event.raw)
        } else if (window.URL !== undefined) {
          url = window.URL.createObjectURL(event.raw)
        } else if (window.webkitURL !== undefined) {
          url = window.webkitURL.createObjectURL(event.raw)
        }
        this.savePic = url
        this.picoversizeWarning = false
      }
    },
    removePic1() {
      // this.form.goodpic=null;
      this.formData.delete('Image')
      this.saveFile = null
      this.savePic = null
    },
    closeAlert11() {
      this.picoversizeWarning = false
    },

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
      this.handleFetchSave(id)
    },

    getList() {
      this.listLoading = true
      fetchSaveListByPage(this.listQuery.page, this.listQuery.limit).then(response => {
        this.list = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
      fetchSaveTotal().then(response => {
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

    resetEnterTemp() {
      this.enterTemp = {
        enterID: undefined,
        type: undefined,
        name: undefined,
        certifier: '',
        certifyOrg: '',
        certifyPlace: '',
        certifyYear: '',
        operationRange: '',
        enterRemark: ''
      }
    },
    handleCreateEnterInfo(data) {
      this.resetEnterTemp()
      this.saveTemp = Object.assign({}, data) // copy obj
      this.enterTemp.enterID = data.saveID
      this.enterTemp.type = data.type
      this.enterTemp.name = data.name

      this.dialogSaveVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    createEnterInfo() {
      this.$refs['dataForm'].validate((valid) => {
        // console.log(valid)
        if (valid) {
          if (this.enterTemp.certifyYear !== '') {
            this.enterTemp.certifyYear = this.formatYear(this.enterTemp.certifyYear)
          }
          createEnter(this.enterTemp).then(() => {
            const index = this.list.findIndex(v => v.saveID === this.enterTemp.enterID)
            this.saveTemp.isContradict = 0
            this.saveTemp.status = 2
            this.list.splice(index, 1, this.saveTemp)
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
      this.saveTemp = Object.assign({}, row) // copy obj
      this.saveTemp.warehousingYear = new Date().getFullYear()
      this.dialogStatus = 'update'
      this.dialogCreateVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    updateSaveInfo() {
      this.saveTemp.warehousingYear = this.formatYear(this.saveTemp.warehousingYear)
      this.$refs['dataForm'].validate((valid) => {
        // console.log(valid)
        if (valid) {
          const tempData = Object.assign({}, this.saveTemp)
          const formData = new FormData();
          if (this.saveFile !== null) {
            formData.append('GermplasmImage', this.saveFile)
          }
          const data = this.saveTemp
          for (const key in data) {
            if (key === 'type' || key === 'isLoaded' || key === 'isContradicted' || key === 'image'
              || key ==='name' || key === 'type') {
              continue
            }
            // console.log(key)
            if (data.hasOwnProperty(key) && data[key] !== '') {
              formData.append(key.charAt(0).toUpperCase() + key.slice(1), data[key])
            }
          }

          axios.post('http://101.43.206.180:8083/Info/ModifySaveInfoInSql',formData,{
            headers:{
              'Content-Type':'multipart/form-data'
            }
          }).then(() => {
            const index = this.list.findIndex(v => v.saveID === this.saveTemp.saveID)
            this.saveTemp.isContradict = 0
            this.list.splice(index, 1, this.saveTemp)
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

    handleFetchSave(id) {
      fetchSave(id).then(response => {
        this.saveInfo = response.data
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
          const index = this.list.findIndex(v => v.saveID === row.saveID)
          this.list.splice(index, 1)
          deleteSave(row.saveID)
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
      this.saveTemp = row
      this.refuseID = row.saveID
    },

    cancelRefuse() {
      this.dialogRefuseVisible = false
      this.refuseID = undefined
    },

    refuseSave() {
      const index = this.list.findIndex(v => v.saveID === this.refuseID)
      this.saveTemp.isContradict = 1
      this.list.splice(index, 1, this.saveTemp)
      contradictSave(this.refuseID)
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
        const tHeader = ['SaveID', 'Type', 'Name', 'MainPreference', 'MainUse', 'PreservationFacility', 'GermplasmType', 'SaveQuantity', 'MeasuringUnit', 'SaveUnit', 'SaveVault', 'SavePlace', 'WarehousingYear', 'SaveProperty', 'ResourceDescription', 'ResourceRemark', 'GermplasmImage']
        const filterVal = ['saveID', 'type', 'name', 'mainPreference', 'mainUse', 'preservationFacility', 'germplasmType', 'saveQuantity', 'measuringUnit', 'saveUnit', 'saveVault', 'savePlace', 'warehousingYear', 'saveProperty', 'resourceDescription', 'resourceRemark', 'germplasmImage']
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
.Post_formbox .uploadImage {
  margin-bottom: 20px;
}

.Post_formbox .good_img {
  position: relative;
  width: 90%;
  height: 360px;
  background-color: white;
  box-shadow: 0 10px 9px 0 rgba(0, 0, 0, 0.2);
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;

}

.Post_formbox .good_img img {
  max-height: 90%;
  max-width: 95%;
  overflow: hidden;
  /*margin: 3% auto;*/
}

.Post_formbox .good_img i {
  display: none;
  position: absolute;
  float: left;
  font-size: 50px;
  color: white;
}

.Post_formbox .good_img:hover {
  box-shadow: 0 10px 9px 0 rgba(0, 0, 0, 0.4);
}

.Post_formbox .good_img:hover img {
  filter: brightness(40%);
}

.Post_formbox .good_img:hover i {
  display: block;
  cursor: pointer;
}
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
