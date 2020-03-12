<template>
  <el-form
    ref="shopFormRef"
    :model="formModel"
    label-width="120px"
    class="form"
    label-position="right"
    :rules="rules"
  >
    <el-form-item label="门店类型:" prop="shopType">
      <query-dict
        :disabled="!!formModel.shopId"
        :dict-list="shopTypeList"
        class="select-item"
        placeholder="请选择店铺类型"
        :value.sync="formModel.shopType"
        @visible-change="cacheOldShopType"
        @change="changeShopType"
      ></query-dict>
    </el-form-item>
    <el-form-item label="选择商户:" prop="businessCode">
      <el-select
        class="select-item"
        v-model="formModel.businessCode"
        placeholder="请选择商户"
        :disabled="!!formModel.shopId"
      >
        <el-option
          v-for="item in businessList"
          :key="item.businessCode"
          :label="item.businessName"
          :value="item.businessCode"
        ></el-option>
      </el-select>
    </el-form-item>
     <el-form-item label="选择运营中心:" prop="operationCode">
      <el-select
        class="select-item"
        v-model="formModel.operationCode"
        placeholder="请选择运营中心"
        :disabled="!formModel.canEditOperation"
      >
        <el-option
          v-for="item in operationList"
          :key="item.operationCode"
          :label="item.operationName"
          :value="item.operationCode"
        ></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="门店LOGO:" prop="shopLogo">
      <c-upload
        ref="shopLogo"
        class="pic"
        auto-upload
        action="/api/upload/file"
        list-type="picture-card"
        :http-request="uploadHandle"
        :size="20"
        :limit="1"
        :fileList="formModel.shopLogo"
        @on-success="uploadSuccess"
        :on-remove="uploadRemove.bind(this,'shopLogo')"
        :on-preview="uploadReview"
        @before-upload="uploadBefore('shopLogo')"
      >
        <i class="el-icon-plus"></i>
        <div class="info">60px*60px</div>
      </c-upload>
    </el-form-item>
    <el-form-item label="门店名称:" prop="shopName">
      <el-input
        class="form-item"
        v-model.trim="formModel.shopName"
        :size="size"
        placeholder="请输入门店名称"
        clearable
        maxlength="30"
      />
    </el-form-item>
    <el-form-item label="门店地址:" prop="shopAddress">
      <el-cascader
        clearable
        class="select-item"
        v-model="formModel.shopAddress"
        :props="optionsProps"
        :options="areaOptions"
        placeholder="请选择门店地址"
        filterable
      ></el-cascader>
    </el-form-item>
    <el-form-item label="详细地址:" prop="address">
      <el-input
        class="form-item"
        v-model.trim="formModel.address"
        :size="size"
        placeholder="请输入详细地址"
        clearable
        maxlength="50"
      />
    </el-form-item>
    <el-form-item label="门店坐标:" prop="coordinate">
      <el-input
        class="form-item"
        v-model.trim="formModel.coordinate"
        :size="size"
        placeholder="请输入门店坐标"
        clearable
        maxlength="30"
      />
    </el-form-item>
    <el-form-item label="联系人:" prop="contact">
      <el-input
        class="form-item"
        v-model.trim="formModel.contact"
        :size="size"
        placeholder="请输入联系人"
        clearable
        maxlength="30"
      />
    </el-form-item>
    <el-form-item label="联系手机:" prop="contactTel">
      <el-input
        class="form-item"
        v-model.trim="formModel.contactTel"
        :size="size"
        placeholder="请输入联系手机"
        clearable
      />
    </el-form-item>
    <el-form-item label="使用POS">
      <el-radio-group v-model="formModel.usePos">
        <el-radio
          class="checkbox-item"
          :label="item.value"
          v-for="(item, index) in disStatus"
          :key="index"
        >{{ item.label }}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="关联打印机">
      <el-radio-group v-model="formModel.isConnectPrinter">
        <el-radio
          class="checkbox-item"
          :label="item.value"
          v-for="(item, index) in disStatus"
          :key="index"
        >{{ item.label }}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="打印机编号:">
      <el-input
        class="form-item"
        v-model.trim="formModel.printer"
        :size="size"
        placeholder="请输入打印机编号"
        clearable
        maxlength="30"
      />
    </el-form-item>
    <el-form-item label="是否推荐" prop="isRecommend" v-if="formModel.shopType === 1" required>
      <el-radio-group v-model="formModel.isRecommend">
        <el-radio
          class="checkbox-item"
          :label="item.value"
          v-for="(item, index) in isRecommendStatusList"
          :key="index"
        >{{ item.label }}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="门店风格" prop="style" v-if="formModel.shopType === 1" required>
      <el-select class="select-item" v-model="formModel.style" placeholder="请选择商户">
        <el-option
          v-for="item in styleList"
          :key="item.styleId"
          :label="item.styleName"
          :value="item.styleId"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="店招:" prop="shopImage" v-if="formModel.shopType === 1" required>
      <c-upload
        ref="shopImage"
        class="pic"
        auto-upload
        action="/api/upload/file"
        :http-request="uploadHandle"
        list-type="picture-card"
        :size="20"
        :limit="1"
        :fileList="formModel.shopImage"
        @on-success="uploadSuccess"
        :on-remove="uploadRemove.bind(this,'shopImage')"
        :on-preview="uploadReview"
        @before-upload="uploadBefore('shopImage')"
      >
        <i class="el-icon-plus"></i>
        <div class="info">750px*350px</div>
      </c-upload>
    </el-form-item>
    <el-form-item label="展馆图:" prop="exhibitionImage" v-if="formModel.shopType === 1" required>
      <c-upload
        ref="exhibitionImage"
        class="pic"
        auto-upload
        action="/api/upload/file"
        :http-request="uploadHandle"
        list-type="picture-card"
        :size="20"
        :limit="1"
        :fileList="formModel.exhibitionImage"
        @on-success="uploadSuccess"
        :on-remove="uploadRemove.bind(this,'exhibitionImage')"
        :on-preview="uploadReview"
        @before-upload="uploadBefore('exhibitionImage')"
      >
        <i class="el-icon-plus"></i>
        <div class="info">750px*350px</div>
      </c-upload>
    </el-form-item>
    <el-form-item label="店铺视频:" prop="videoUrl" v-if="formModel.shopType === 1">
      <c-upload
        ref="videoUrl"
        class="pic"
        auto-upload
        fileType="video"
        action="/api/upload/file"
        :http-request="uploadHandle"
        list-type="picture-card"
        :size="20"
        :limit="1"
        :fileList="formModel.videoUrl"
        @on-success="uploadSuccess"
        :on-remove="uploadRemove.bind(this,'videoUrl')"
        :on-preview="uploadReview"
        @before-upload="uploadBefore('videoUrl')"
      >
        <i class="el-icon-plus"></i>
        <div class="info">格式：mp4</div>
        <div slot="file">
          <img class="el-upload-list__item-thumbnail" src="/static/default-video.png" />
        </div>
      </c-upload>
    </el-form-item>
    <el-form-item label="营业时间:" prop="businessHours" v-if="formModel.shopType === 1">
      <el-time-picker
        is-range
        :size="size"
        value-format="hh:mm"
        v-model="formModel.businessHours"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        align="right"
      ></el-time-picker>
    </el-form-item>
    <el-form-item label="描述:" prop="shopDescription" v-if="formModel.shopType === 1" required>
      <el-input
        type="textarea"
        placeholder="请输入描述"
        maxlength="100"
        show-word-limit
        class="form-item"
        v-model.trim="formModel.shopDescription"
        clearable
      ></el-input>
    </el-form-item>
    <el-form-item label="隐藏门店" v-if="formModel.shopType === 1">
      <el-radio-group v-model="formModel.isVisible">
        <el-radio
          class="checkbox-item"
          :label="item.value"
          v-for="(item, index) in disStatus"
          :key="index"
        >{{ item.label }}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="支持盘点" v-if="formModel.shopType === 1">
      <el-radio-group v-model="formModel.stockCheck">
        <el-radio
          class="checkbox-item"
          :label="item.value"
          v-for="(item, index) in disStatus"
          :key="index"
        >{{ item.label }}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="经营方式:" prop="businessType" required>
      <el-select
        class="select-item"
        disabled
        v-model="formModel.businessType"
        placeholder="请选择经营方式"
      >
        <el-option
          v-for="item in businessTypeList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="结算方式:" prop="settleType" required>
      <el-select class="select-item" disabled v-model="formModel.settleType" placeholder="请选择结算方式">
        <el-option
          v-for="item in settleTypeList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="状态">
      <el-radio-group v-model="formModel.status">
        <el-radio
          class="checkbox-item"
          :label="item.value"
          v-for="(item, index) in disStatus"
          :key="index"
        >{{ item.label }}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="关联渠道:">
      <el-button :size="size" @click.native.prevent="showDialog">关联渠道</el-button>
      <div class="selected-box" v-show="formModel.channelCode.length">
        <c-table
          noPage
          hasBorder
          :max-height="400"
          size="medium"
          :loading="isLoading"
          :table-header="tableHeader"
          :table-list="formModel.channelCode"
        ></c-table>
      </div>
    </el-form-item>
    <el-form-item label="开单调价">
      <el-radio-group v-model="formModel.changeStatus">
        <el-radio
          class="checkbox-item"
          :label="item.value"
          v-for="(item, index) in disStatus"
          :key="index"
        >{{ item.label }}</el-radio>
      </el-radio-group>
      <el-form-item label="调价底线:" prop="changeType" v-if="formModel.changeStatus === 1">
        <el-select class="select-item" v-model="formModel.changeType" placeholder="请选择调价底线">
          <el-option
            v-for="item in changeTypeList"
            :key="item.priceId"
            :label="item.priceName"
            :value="item.priceId"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form-item>
    <el-form-item label="支持代开会员">
      <el-radio-group v-model="formModel.openVipStatus">
        <el-radio
          class="checkbox-item"
          :label="item.value"
          v-for="(item, index) in disStatus"
          :key="index"
        >{{ item.label }}</el-radio>
      </el-radio-group>
    </el-form-item>
  </el-form>
</template>

<script>
import dictObj from '@/store/dictData'
import utils from 'utils'
import MixinFormCard from 'mixins/formCard'
import mixinTable from 'mixins/table'
import CUpload from 'components/upload'

export default {
  components: {
    CUpload
  },
  mixins: [MixinFormCard, mixinTable],
  data(vm) {
    return {
      areaOptions: [], // 地区列表: [],
      optionsProps: {
        value: 'code',
        label: 'name'
      },
      uploadType: '',
      rules: {
        shopType: [
          { required: true, message: '请选择门店类型', trigger: 'blur' }
        ],
        activityName: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        businessCode: [
          { required: true, message: '请选择商户', trigger: 'blur' }
        ],
        shopName: [
          { required: true, message: '请输入门店名称', trigger: 'blur' }
        ],
        shopLogo: [
          { required: true, message: '请上传门店LOGO', trigger: 'blur' }
        ],
        shopAddress: [
          { required: true, message: '请选择门店地址', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ],
        contact: [
          { required: true, message: '请输入联系人', trigger: 'blur' }
        ],
        contactTel: [
          { required: true, validator: utils.validater.phoneNumber, trigger: 'blur' }
        ],
        style: [
          { required: true, message: '请选择风格', trigger: 'blur' }
        ],
        businessHours: [
          { required: true, message: '请选择营业时间', trigger: 'blur' }
        ],
        shopDescription: [
          { required: true, message: '请输入描述', trigger: 'blur' }
        ],
        shopImage: [
          { required: true, message: '请上传店招', trigger: 'blur' }
        ],
        exhibitionImage: [
          { required: true, message: '请上传展馆图', trigger: 'blur' }
        ]
        // videoUrl: [
        //   { required: true, message: '请上传店铺视频', trigger: 'blur' }
        // ]
      },
      cacheShopType: '', // 缓存旧的门店类型
      tableHeader: [
        {
          label: '子渠道号',
          prop: 'channelCode'
        },
        {
          label: '子渠道名称',
          prop: 'channelName'
        },
        {
          label: '描述',
          prop: 'channelDescription'
        }
      ],
      isLoading: false,
      pickerOptions: utils.pickerOptions,
      shopTypeList: dictObj.shopTypeList, // 门店类型
      disStatus: dictObj.disStatus, // 禁用启用
      businessList: [], // 商户列表
      operationList: [], // 运营中心列表
      styleList: [], // 风格列表
      changeTypeList: [], // 调价底线
      settleTypeList: [{ // 结算方式
        label: '先款后贷',
        value: 1
      }],
      businessTypeList: [{ // 经营方式
        label: '自营',
        value: 1
      }, {
        label: '加盟',
        value: 2
      }],
      isRecommendStatusList: [{ // 是否推荐
        label: '推荐',
        value: 1
      }, {
        label: '非推荐',
        value: 2
      }]
    }
  },
  created() {
    this.getStyleList()
    this.fetchAreaData()
    this.fetchChangeType()
    this.fetchOperationList()
  },
  watch: {
    'formModel.shopType'() {
      this.getShopList()
    }
  },
  methods: {
    // 获取运营中心列表数据
    fetchOperationList() {
      this.$api.operation.queryAllOperationList().then(res => {
        if (res && res.totalCount) {
          const { data } = res
          this.operationList = data || []
        } else {
          this.operationList = res || []
        }
      })
    },
    // 获取调价底线数据
    fetchChangeType() {
      this.$api.channel
        .getPrice().then(res => {
          if (res && res.totalCount) {
            const { data } = res
            this.changeTypeList = data || []
          } else {
            this.changeTypeList = res
          }
        })
    },
    showDialog() {
      this.$emit('open-dialog')
    },
    getStyleList() {
      this.$api.channel
        .getShopStyle({
          pageSize: 100,
          pageNo: 1
        })
        .then(res => {
          this.isLoading = false
          if (res && res.totalCount) {
            const { data } = res
            this.styleList = data || []
          } else {
            this.styleList = res || []
          }
        })
    },
    fetchAreaData() {
      this.$api.basic.getAreaAll().then(res => {
        if (res.length) {
          this.areaOptions = res
        }
      })
    },
    uploadHandle(file) {
      this.$refs[this.uploadType].customUpload(file)
    },
    cacheOldShopType(flag) { // 出现则为 true，隐藏则为 false
      if (flag) {
        this.cacheShopType = this.formModel.shopType
      }
    },
    changeShopType() {
      this.formModel.businessType = this.formModel.shopType
      if (!this.cacheShopType) {
        return
      }
      this.$confirm('您填写的信息将被重置，确定要更换吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.formModel.businessCode = ''
          // this.getShopList()
          this.$message({
            type: 'success',
            message: '已更新门店类型!'
          })
        })
        .catch(() => {
          this.formModel.shopType = this.cacheShopType
        })
    },
    // 获取商户
    getShopList() {
      this.$api.channel.queryBusinessList({
        pageSize: 100,
        pageNo: 1,
        businessType: this.formModel.shopType
      }).then(res => {
        this.isLoading = false
        if (res && res.totalCount) {
          const { data, totalCount } = res
          this.pageInfo.totalNum = totalCount
          this.businessList = data || []
        } else {
          this.businessList = res || []
        }
      })
    },
    uploadSuccess(response, file, fileList) {
      this.formModel[this.uploadType] = fileList.map((item) => {
        return {
          ...item,
          fileType: this.uploadType === 'videoUrl' ? 'video' : 'image'
        }
      })
    },
    uploadRemove(type, file, fileList) {
      this.formModel[type] = fileList
    },
    uploadReview(file) {
      this.$emit('show-image', file)
    },
    uploadBefore(ref) {
      this.uploadType = ref
    }
  }
}
</script>

<style lang="less" scoped>
.form {
  background-color: @white;
  padding: 15px 15px;
  .form-item {
    width: 50%;
  }
  .select-item {
    width: 30%;
  }
  .pic {
    padding-bottom: 25px;
    span {
      display: inline-block;
      margin-bottom: 10px;
    }
    .info {
      line-height: 20px;
      height: 20px;
      margin-top: 5px;
      font-size: @f12;
    }
  }
  .selected-box {
    width: 40vw;
  }
}
</style>
