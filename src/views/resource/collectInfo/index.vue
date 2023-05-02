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
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
                 @click="handleCreateCollectionInfo"
      >
        新增
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
      <el-table-column label="收集号" prop="collectID" sortable="custom" align="center" width="80"
                       :class-name="getSortClass('collectID')"
      >
        <template slot-scope="{row}">
          <span>{{ row.collectID }}</span>
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
      <el-table-column label="作物类别" prop="type" align="center" width="110">
        <template slot-scope="{row}">
          <span>
            {{ row.type | fruitTypeFilter }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="作物名称" prop="name" align="center" width="80">
        <template slot-scope="{row}">
          <span>
            {{ row.name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="种质名称" prop="germplasmName" align="center" width="80">
        <template slot-scope="{row}">
          <span>
            {{ row.germplasmName }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="科名" prop="sectionName" align="center" width="80">
        <template slot-scope="{row}">
          <span>
            {{ row.sectionName }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="属名" prop="genericName" align="center" width="80">
        <template slot-scope="{row}">
          <span>
            {{ row.genericName }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="学名" prop="scientificName" align="center" width="80">
        <template slot-scope="{row}">
          <span>
            {{ row.scientificName }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="种质资源类型" prop="resourceType" align="center" width="80">
        <template slot-scope="{row}">
          <span>
            {{ row.resourceType | resourceTypeFilter }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="收集方式" prop="collectMethod" align="center" width="80">
        <template slot-scope="{row}">
          <span>
            {{ row.collectMethod | collectMethodFilter }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="收集人" prop="collectPeople" align="center" width="80">
        <template slot-scope="{row}">
          <span>
            {{ row.collectPeople }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="收集单位" prop="collectUnit" align="center" width="80">
        <template slot-scope="{row}">
          <span>
            {{ row.collectUnit }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="原生境图片" prop="image" align="center" width="80">
        <template slot-scope="{row}">
          <span>
            {{ row.image }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="项目归口" prop="speciesName" align="center" width="80">
        <template slot-scope="{row}">
          <span>
            {{ row.speciesName }}
          </span>
        </template>
      </el-table-column>

      <el-table-column label="操作状态" prop="idContradict" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.isContradict | contadictFilter">
            <span v-if="row.isLoaded === 1">已上链</span>
            <span v-else-if="row.isContradict === 0">正常</span>
            <span v-else-if="row.isContradict === 1">反驳中</span>

          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作员" prop="type" sortable="custom" align="center" width="80">
        <template slot-scope="{row}">
          <span>
            admin
          </span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <div class="buttons-row">
            <el-button type="primary" size="small" @click="viewDetails(row.collectID)">
              查看详情
            </el-button>
            <el-button v-if="row.isLoaded === 0 && row.status === 0" type="primary" size="small" @click="handleUpdate(row)">
              修改
            </el-button>
            <el-button v-if="row.isLoaded === 0" type="primary" size="small" @click="handleDelete(row)">
              删除
            </el-button>
          </div>
          <div class="buttons-row">
            <el-button v-if="row.isLoaded === 0 && row.status === 0 && row.isContradict === 0" type="primary"
                       size="small" @click="handleRefuse(row.collectID)"
            >
              反驳
            </el-button>
            <el-button v-if="row.isLoaded === 0 && row.status === 0 && row.isContradict === 0" type="primary"
                       size="small" @click="handleCreateSaveInfo(row)"
            >
              保存
            </el-button>
          </div>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                @pagination="getList"
    />

    <el-dialog :visible.sync="dialogCollectionVisible" title="收集信息详情" :close-on-click-modal="false"
               :show-close="false"
               class="collection-dialog"
    >
      <div class="detail-table">
        <div class="detail-row">
          <div class="detail-label">收集号:</div>
          <div class="detail-value">{{ this.collectionInfo.collectID }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">作物类别:</div>
          <div class="detail-value">{{ this.collectionInfo.type | fruitTypeFilter }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">作物名称:</div>
          <div class="detail-value">{{ this.collectionInfo.name }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">种质名称:</div>
          <div class="detail-value">{{ this.collectionInfo.germplasmName }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">种质外文名称:</div>
          <div class="detail-value">{{ this.collectionInfo.germplasmNameEn }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">科名:</div>
          <div class="detail-value">{{ this.collectionInfo.sectionName }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">属名:</div>
          <div class="detail-value">{{ this.collectionInfo.genericName }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">学名:</div>
          <div class="detail-value">{{ this.collectionInfo.scientificName }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">种质资源类型:</div>
          <div class="detail-value">{{ this.collectionInfo.resourceType | resourceTypeFilter }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">收集方式:</div>
          <div class="detail-value">{{ this.collectionInfo.collectMethod | collectMethodFilter }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">种质来源:</div>
          <div class="detail-value">{{ this.collectionInfo.germplasmSource }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">来源国:</div>
          <div class="detail-value">{{ this.collectionInfo.sourceCountry }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">来源省(州、邦):</div>
          <div class="detail-value">{{ this.collectionInfo.sourceProvince }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">来源地:</div>
          <div class="detail-value">{{ this.collectionInfo.source }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">来源机构:</div>
          <div class="detail-value">{{ this.collectionInfo.sourceOrg }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">原产国:</div>
          <div class="detail-value">{{ this.collectionInfo.originCountry }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">原产地:</div>
          <div class="detail-value">{{ this.collectionInfo.originPlace }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">收集地经度:</div>
          <div class="detail-value">{{ this.collectionInfo.collectPlaceLongitude }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">收集地纬度:</div>
          <div class="detail-value">{{ this.collectionInfo.collectPlaceLatitude }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">收集地海拔:</div>
          <div class="detail-value">{{ this.collectionInfo.collectPlaceAltitude }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">收集地土壤类型:</div>
          <div class="detail-value">{{ this.collectionInfo.collectPlaceSoilType | soilTypeFilter }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">收集地生态类型:</div>
          <div class="detail-value">{{ this.collectionInfo.collectPlaceEcologyType | collectPlaceEcologyFilter }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">收集材料类型:</div>
          <div class="detail-value">{{ this.collectionInfo.collectMaterialType | collectMaterialTypeFilter }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">收集人:</div>
          <div class="detail-value">{{ this.collectionInfo.collectPeople }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">收集单位:</div>
          <div class="detail-value">{{ this.collectionInfo.collectUnit }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">收集时间:</div>
          <div class="detail-value">{{ this.collectionInfo.collectTime }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">原生境图片:</div>
          <div class="detail-value">{{ this.collectionInfo.image }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">项目归口:</div>
          <div class="detail-value">{{ this.collectionInfo.speciesName }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">操作员:</div>
          <div class="detail-value">admin</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">备注:</div>
          <div class="detail-value">{{ this.collectionInfo.collectRemark }}</div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogCollectionVisible = false" type="primary">关闭</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogCreateVisible">
      <el-form ref="dataForm" :rules="rules" :model="collectionTemp" label-position="left" label-width="130px"
               style="width: auto; margin-left:50px;"
      >

        <el-form-item label="收集号" prop="collectID">
          <!--          <span v-if="row.status === 0">待保存</span>-->
          <div v-if="dialogStatus==='create'">
            <el-input v-model="collectionTemp.collectID" placeholder="请输入收集号"/>
          </div>
          <div v-else-if="dialogStatus!=='create'">
            <el-input :disabled="true" :readonly="true" v-model="collectionTemp.collectID"/>
          </div>
        </el-form-item>

        <el-form-item label="作物类别" prop="type">
          <div v-if="dialogStatus==='create'">
            <el-select v-model="collectionTemp.type" class="filter-item" placeholder="请选择作物类别">
              <el-option v-for="item in fruitTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
            </el-select>
          </div>
          <div v-else-if="dialogStatus!=='create'">
            <el-input :disabled="true" :readonly="true" v-model="fruitTypeCompute"/>
          </div>
        </el-form-item>

        <el-form-item label="作物名称" prop="name">
          <div v-if="dialogStatus==='create'">
            <el-input v-model="collectionTemp.name" placeholder="请输入作物名称"/>
          </div>
          <div v-else-if="dialogStatus!=='create'">
            <el-input :disabled="true" :readonly="true" v-model="collectionTemp.name"/>
          </div>
        </el-form-item>

        <el-form-item label="种质名称" prop="germplasmName">
          <el-input v-model="collectionTemp.germplasmName" placeholder="请输入种质名称"/>
        </el-form-item>

        <el-form-item label="种质外文名称" prop="germplasmNameEn">
          <el-input v-model="collectionTemp.germplasmNameEn" placeholder="请输入种质外文名称"/>
        </el-form-item>

        <el-form-item label="科名" prop="sectionName">
          <el-input v-model="collectionTemp.sectionName" placeholder="请输入科名"/>
        </el-form-item>

        <el-form-item label="属名" prop="genericName">
          <el-input v-model="collectionTemp.genericName" placeholder="请输入属名"/>
        </el-form-item>

        <el-form-item label="学名" prop="scientificName">
          <el-input v-model="collectionTemp.scientificName" placeholder="请输入学名"/>
        </el-form-item>

        <el-form-item label="种质资源类型" prop="resourceType">
          <el-select v-model="collectionTemp.resourceType" class="filter-item" placeholder="请选择种质资源类型">
            <el-option v-for="item in resourceTypeOptions " :key="item.key" :label="item.display_name"
                       :value="item.key"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="收集方式" prop="collectMethod">
          <el-select v-model="collectionTemp.collectMethod" class="filter-item" placeholder="请选择收集方式">
            <el-option v-for="item in collectMethodOptions " :key="item.key" :label="item.display_name"
                       :value="item.key"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="种质来源" prop="germplasmSource">
          <el-input v-model="collectionTemp.germplasmSource" placeholder="请输入种质来源"/>
        </el-form-item>

        <el-form-item label="来源国" prop="sourceCountry">
          <el-input v-model="collectionTemp.sourceCountry" placeholder="请输入来源国"/>
        </el-form-item>

        <el-form-item label="来源省(州、邦)" prop="sourceProvince">
          <el-input v-model="collectionTemp.sourceProvince" placeholder="请输入来源省(州、邦)"/>
        </el-form-item>

        <el-form-item label="来源地" prop="source">
          <el-input v-model="collectionTemp.source" placeholder="请输入来源地"/>
        </el-form-item>

        <el-form-item label="来源机构" prop="sourceOrg">
          <el-input v-model="collectionTemp.sourceOrg" placeholder="请输入来源机构"/>
        </el-form-item>

        <el-form-item label="原产国" prop="originCountry">
          <el-input v-model="collectionTemp.originCountry" placeholder="请输入原产国"/>
        </el-form-item>

        <el-form-item label="原产地" prop="originPlace">
          <el-input v-model="collectionTemp.originPlace" placeholder="请输入原产地"/>
        </el-form-item>

        <el-form-item label="收集地经度" prop="collectPlaceLongitude">
          <el-input v-model="collectionTemp.collectPlaceLongitude" placeholder="请输入收集地经度"/>
        </el-form-item>
        <el-form-item label="收集地纬度" prop="collectPlaceLatitude">
          <el-input v-model="collectionTemp.collectPlaceLatitude" placeholder="请输入收集地纬度"/>
        </el-form-item>

        <el-form-item label="收集地海拔" prop="collectPlaceAltitude">
          <el-input v-model="collectionTemp.collectPlaceAltitude" placeholder="请输入收集地海拔"/>
        </el-form-item>
        <el-form-item label="收集地土壤类型" prop="collectPlaceSoilType">
          <el-select v-model="collectionTemp.collectPlaceSoilType" class="filter-item"
                     placeholder="请选择收集地土壤类型"
          >
            <el-option v-for="item in soilTypeOptions " :key="item.key" :label="item.display_name" :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item label="收集地生态类型" prop="collectPlaceEcologyType">
          <el-select v-model="collectionTemp.collectPlaceEcologyType" class="filter-item"
                     placeholder="请选择收集地生态类型"
          >
            <el-option v-for="item in collectPlaceEcologyTypeOptions " :key="item.key" :label="item.display_name"
                       :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="收集材料类型" prop="collectMaterialType">
          <el-select v-model="collectionTemp.collectMaterialType" class="filter-item" placeholder="请选择收集材料类型">
            <el-option v-for="item in collectMaterialTypeOptions " :key="item.key" :label="item.display_name"
                       :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="收集人" prop="collectPeople">
          <el-input v-model="collectionTemp.collectPeople" placeholder="请输入收集人"/>
        </el-form-item>
        <el-form-item label="收集单位" prop="collectUnit">
          <el-input v-model="collectionTemp.collectUnit" placeholder="请输入收集单位"/>
        </el-form-item>
        <el-form-item label="收集时间" prop="collectTime">
          <el-date-picker v-model="collectionTemp.collectTime" type="datetime" placeholder="选择日期"
                          style="width:100%"
          />
        </el-form-item>
        <el-form-item label="原生境图片" prop="image">
          <el-input v-model="collectionTemp.image" placeholder="请输入原生境图片"/>
        </el-form-item>
        <el-form-item label="项目归口" prop="speciesName">
          <el-input v-model="collectionTemp.speciesName" placeholder="请输入项目归口"/>
        </el-form-item>
        <el-form-item label="操作员" prop="operator">
          <span>admin</span>
        </el-form-item>
        <el-form-item label="备注" prop="collectRemark">
          <el-input v-model="collectionTemp.collectRemark" placeholder="请输入备注"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCreateVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createCollectionInfo():updateCollectionInfo()">
          确认新建
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
        <el-button type="primary" @click="refuseCollect()">
          确认反驳
        </el-button>
      </div>
    </el-dialog>


    <el-dialog :title="'保存'" :visible.sync="dialogSaveVisible">
      <el-form ref="dataForm" :rules="saveRules" :model="saveTemp" label-position="left" label-width="130px"
               style="width: auto; margin-left:50px;"
      >

        <el-form-item label="收集号" prop="collectID">
            <el-input :disabled="true" :readonly="true" v-model="saveTemp.saveID" placeholder="请输入收集号"/>
        </el-form-item>

        <el-form-item label="作物类别" prop="type">
          <el-input :disabled="true" :readonly="true" v-model="saveTypeCompute"/>
        </el-form-item>

        <el-form-item label="作物名称" prop="name">
          <el-input :disabled="true" :readonly="true" v-model="saveTemp.name"/>
        </el-form-item>

        <el-form-item label="主要特征" prop="mainPreference">
          <el-select v-model="saveTemp.mainPreference" class="filter-item" placeholder="请输入主要特征">
            <el-option v-for="item in mainPreferenceOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
          </el-select>
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
            <el-option v-for="item in measuringUnitOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
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

        <el-form-item label="资源描述" prop="resourceDescription">
          <el-input v-model="saveTemp.resourceDescription" placeholder="请输入资源描述"/>
        </el-form-item>

        <el-form-item label="备注" prop="resourceRemark">
          <el-input v-model="saveTemp.resourceRemark" placeholder="请输入备注"/>
        </el-form-item>

        <el-form-item label="种质图片" prop="germplasmImage">
          <el-input v-model="saveTemp.germplasmImage" placeholder="请输入种质图片"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSaveVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="createSaveInfo()">
          确认保存
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {
  contradictCollection,
  deleteCollection,
  createCollection,
  fetchCollection,
  fetchCollectionListByPage,
  fetchCollectionTotal,
  updateCollection, createSave
} from '@/api/collectInfo'

import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import Da from 'element-ui/src/locale/lang/da'

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
  { key: 7, display_name: '其他' },
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
  { key: 5, display_name: '株' },
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
        mainPreference:'',
        preservationFacility:'',
        germplasmType:'',
        saveQuantity:'',
        measuringUnit:'',
        saveUnit:'',
        saveVault:'',
        savePlace:'',
        warehousingYear:'',
        saveProperty:'',
        resourceDescription:'',
        resourceRemark:'',
        germplasmImage:''
      },

      collectionTemp: {
        collectID: undefined,
        type: '',
        name: '',
        germplasmName: '',
        germplasmNameEn: '',
        sectionName: '',
        genericName: '',
        scientificName: '',
        resourceType: '',
        collectMethod: '',
        germplasmSource: '',
        sourceCountry: '',
        sourceProvince: '',
        source: '',
        sourceOrg: '',
        originCountry: '',
        originPlace: '',
        collectPlaceLongitude: '',
        collectPlaceLatitude: '',
        collectPlaceAltitude: '',
        collectPlaceSoilType: '',
        collectPlaceEcologyType: '',
        collectMaterialType: '',
        collectPeople: '',
        collectUnit: '',
        collectTime: new Date(),
        speciesName: '',
        image: '',
        collectRemark: '',
        collectStatus:'',
        isLoaded:'',
        isContradicted:'',
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
      collectionInfo: {},

      dialogSaveVisible: false,
      saveInfo: {},

      saveRules:{
        saveID: [{ required: true, message: 'saveID is required', trigger: 'blur' }],
        mainPreference: [{ required: true, message: 'mainPreference is required', trigger: 'blur' }]
      },

      rules: {
        collectID: [{ required: true, message: 'collectID is required', trigger: 'blur' }],
        type: [{ required: true, message: 'type is required', trigger: 'blur' }],
        name: [{ required: true, message: 'name is required', trigger: 'blur' }],
        germplasmName: [{ required: true, message: 'germplasm is required', trigger: 'blur' }],
        genericName: [{ required: true, message: 'genericName is required', trigger: 'blur' }],
        collectMethod: [{ required: true, message: 'collectMethod is required', trigger: 'blur' }],
        germplasmSource: [{ required: true, message: 'germplasmsource is required', trigger: 'blur' }],
        sourceCountry: [{ required: true, message: 'sourceCountry is required', trigger: 'blur' }],
        sourceProvince: [{ required: true, message: 'sourceProvince is required', trigger: 'blur' }],
        sourceOrg: [{ required: true, message: 'sourceOrg is required', trigger: 'blur' }],
        originCountry: [{ required: true, message: 'originCountry is required', trigger: 'blur' }],
        collectPlaceLatitude: [{ required: true, message: 'Latitude is required', trigger: 'blur' }],
        collectPlaceLongitude: [{ required: true, message: 'Longitude is required', trigger: 'blur' }],
        collectPlaceAltitude: [{ required: true, message: 'Altitude is required', trigger: 'blur' }],
        collectPlaceSoilType: [{ required: true, message: 'soilType is required', trigger: 'blur' }],
        collectPeople: [{ required: true, message: 'collectPeople is required', trigger: 'blur' }],
        collectUnit: [{ required: true, message: 'collectUnit is required', trigger: 'blur' }]
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
      this.handleFetchCollection(id)
    },

    getList() {
      this.listLoading = true
      fetchCollectionListByPage(this.listQuery.page, this.listQuery.limit).then(response => {
        this.list = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
      fetchCollectionTotal().then(response => {
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

    resetSaveTemp() {
      this.saveTemp = {
        saveID: undefined,
        type: undefined,
        name: undefined,
        mainPreference:'',
        preservationFacility:'',
        germplasmType:'',
        saveQuantity:'',
        measuringUnit:'',
        saveUnit:'',
        saveVault:'',
        savePlace:'',
        warehousingYear:'',
        saveProperty:'',
        resourceDescription:'',
        resourceRemark:'',
        germplasmImage:''
      }
    },
    handleCreateSaveInfo(data) {
      this.resetSaveTemp()
      this.collectionTemp = Object.assign({}, data) // copy obj
      this.saveTemp.saveID = data.collectID
      this.saveTemp.type = data.type
      this.saveTemp.name = data.name

      this.dialogSaveVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createSaveInfo() {
      // console.log(this.collectionTemp.collectTime)
      this.saveTemp.warehousingYear = this.formatYear(this.saveTemp.warehousingYear)
      this.$refs['dataForm'].validate((valid) => {
        // console.log(valid)
        if (valid) {
          createSave(this.saveTemp).then(() => {
            const index = this.list.findIndex(v => v.collectID === this.collectionTemp.collectID)
            this.collectionTemp.isContradict = 0
            this.collectionTemp.status = 1
            this.list.splice(index, 1, this.collectionTemp)
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

    resetCollectionTemp() {
      this.collectionTemp = {
        collectID: undefined,
        type: '',
        name: '',
        germplasmName: '',
        germplasmNameEn: '',
        sectionName: '',
        genericName: '',
        scientificName: '',
        resourceType: '',
        collectMethod: '',
        germplasmSource: '',
        sourceCountry: '',
        sourceProvince: '',
        source: '',
        sourceOrg: '',
        originCountry: '',
        originPlace: '',
        collectPlaceLongitude: '',
        collectPlaceLatitude: '',
        collectPlaceAltitude: '',
        collectPlaceSoilType: '',
        collectPlaceEcologyType: '',
        collectMaterialType: '',
        collectPeople: '',
        collectUnit: '',
        collectTime: new Date(),
        speciesName: '',
        image: '',
        collectRemark: '',
        collectStatus:'',
        isLoaded:'',
        isContradicted:'',
      }
    },

    handleCreateCollectionInfo() {
      this.resetCollectionTemp()
      this.dialogStatus = 'create'
      this.dialogCreateVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createCollectionInfo() {
      this.collectionTemp.collectTime = this.formatDate(this.collectionTemp.collectTime)
      this.collectionTemp.collectStatus = 0
      this.collectionTemp.status = 0
      this.collectionTemp.isLoaded = 0
      this.collectionTemp.isContradicted = 0
      // console.log(this.collectionTemp.collectTime)
      this.$refs['dataForm'].validate((valid) => {
        // console.log(valid)
        if (valid) {
          createCollection(this.collectionTemp).then(() => {
            this.list.unshift(this.collectionTemp)
            this.dialogCreateVisible = false
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
      this.collectionTemp = Object.assign({}, row) // copy obj
      this.collectionTemp.collectTime = new Date()
      this.dialogStatus = 'update'
      this.dialogCreateVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    updateCollectionInfo() {
      this.collectionTemp.collectTime = this.formatDate(this.collectionTemp.collectTime)
      // console.log(this.collectionTemp.collectTime)
      this.$refs['dataForm'].validate((valid) => {
        // console.log(valid)
        if (valid) {
          const tempData = Object.assign({}, this.collectionTemp)
          updateCollection(tempData).then(() => {
            const index = this.list.findIndex(v => v.collectID === this.collectionTemp.collectID)
            this.collectionTemp.isContradict = 0
            this.list.splice(index, 1, this.collectionTemp)
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

    handleFetchCollection(id) {
      fetchCollection(id).then(response => {
        this.collectionInfo = response.data
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
          deleteCollection(row.collectID)
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

    handleRefuse(data) {
      this.dialogRefuseVisible = true
      this.refuseID = data
    },

    cancelRefuse() {
      this.dialogRefuseVisible = false
      this.refuseID = undefined
    },

    refuseCollect() {
      // this.$confirm('确定反驳采集信息吗', '警告', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(async() => {
      const index = this.list.findIndex(v => v.collectID === this.collectionTemp.collectID)
      this.collectionTemp.isContradict = 1
      this.collectionTemp.status = 0
      this.list.splice(index, 1, this.collectionTemp)
      contradictCollection(this.refuseID)
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
    save(){

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
</style>
