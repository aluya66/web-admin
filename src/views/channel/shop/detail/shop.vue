<template>
  <el-form
    ref="shopFormRef"
    :model="formModel"
    label-width="120px"
    class="form"
    label-position="right"
    :rules="rules"
  >
    <el-form-item label="店铺类型:" required>
      <query-dict
        :dict-list="shopTypeList"
        class="select-item"
        placeholder="请选择店铺类型"
        :value.sync="formModel.shopType"
        @visible-change="cacheOldShopType"
        @change="changeShopType"
      ></query-dict>
    </el-form-item>
    <el-form-item label="选择商户:" prop="businessCode">
      <el-select class="select-item" v-model="formModel.businessCode" placeholder="请选择商户">
        <el-option
          v-for="item in businessList"
          :key="item.businessCode"
          :label="item.businessName"
          :value="item.businessCode"
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
        :on-remove="uploadRemove"
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
      />
    </el-form-item>
    <el-form-item label="门店坐标:" prop="coordinate">
      <el-input
        class="form-item"
        v-model.trim="formModel.coordinate"
        :size="size"
        placeholder="请输入门店坐标"
        clearable
      />
    </el-form-item>
    <el-form-item label="联系人:" prop="contact">
      <el-input
        class="form-item"
        v-model.trim="formModel.contact"
        :size="size"
        placeholder="请输入联系人"
        clearable
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
          :key="item.id"
          :label="item.labelName"
          :value="item.id"
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
        :limit="5"
        :fileList="formModel.shopImage"
        @on-success="uploadSuccess"
        :on-remove="uploadRemove"
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
        :limit="5"
        :fileList="formModel.exhibitionImage"
        :on-success="uploadSuccess"
        :on-remove="uploadRemove"
        :on-preview="uploadReview"
        @before-upload="uploadBefore('exhibitionImage')"
      >
        <i class="el-icon-plus"></i>
        <div class="info">750px*350px</div>
      </c-upload>
    </el-form-item>
    <el-form-item label="店铺视频:" prop="videoUrl" v-if="formModel.shopType === 1" required>
      <c-upload
        ref="videoUrl"
        class="pic"
        auto-upload
        fileType="video"
        action="/api/upload/file"
        :http-request="uploadHandle"
        list-type="picture-card"
        :size="20"
        :limit="5"
        :fileList="formModel.videoUrl"
        :on-success="uploadSuccess"
        :on-remove="uploadRemove"
        :on-preview="uploadReview"
        @before-upload="uploadBefore('videoUrl')"
      >
        <i class="el-icon-plus"></i>
      </c-upload>
    </el-form-item>
    <el-form-item label="营业时间:" prop="businessHours" v-if="formModel.shopType === 1" required>
      <el-date-picker
        :size="size"
        v-model="formModel.businessHours"
        type="datetimerange"
        value-format="yyyy-MM-dd HH:mm:ss"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="截止日期"
        :default-time="['00:00:00', '23:59:59']"
        align="right"
      ></el-date-picker>
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
          :table-inner-btns="tableInnerBtns"
          :rowStyle="{height:0}"
          :cellStyle="{padding:0}"
        ></c-table>
      </div>
    </el-form-item>
  </el-form>
</template>

<script>
import dictObj from '@/store/dictData'
import utils from 'utils'
import MixinForm from 'mixins/form'
import MixinFormCard from 'mixins/formCard'
import mixinTable from 'mixins/table'
// import CImage from 'components/image'
import CUpload from 'components/upload'

export default {
  components: {
    CUpload
  },
  props: {
    title: String,
    dataObj: {
      type: Object,
      required: true
    },
    isView: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'medium'
    }
  },
  mixins: [MixinForm, MixinFormCard, mixinTable],
  data(vm) {
    return {
      areaOptions: [], // 地区列表: [],
      optionsProps: {
        expandTrigger: 'click',
        lazy: true,
        lazyLoad(node, resolve) {
          vm.fetchAreaData(node, (data) => {
            // 通过调用resolve将子节点数据返回，通知组件数据加载完成
            resolve(data)
          })
        }
      },
      uploadType: '',
      rules: {
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
          { required: true, message: '请输入联系人电话', trigger: 'blur' }
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
        ],
        videoUrl: [
          { required: true, message: '请上传店铺视频', trigger: 'blur' }
        ]
      },
      cacheShopType: '', // 缓存旧的门店类型
      tableHeader: [
        {
          label: '子渠道号',
          prop: 'goodsBn'
        },
        {
          label: '子渠道名称',
          prop: 'goodsName'
        }
      ],
      tableInnerBtns: [
        {
          width: 100,
          name: '编辑',
          icon: 'el-icon-edit',
          handle(row) {

          }
        }
      ],
      isLoading: false,
      pickerOptions: utils.pickerOptions,
      shopTypeList: dictObj.shopTypeList, // 门店类型
      disStatus: dictObj.disStatus, // 禁用启用
      businessList: [], // 商户列表
      styleList: [], // 风格列表
      settleTypeList: [{ // 结算方式
        label: '先款后贷',
        value: 1
      }],
      businessTypeList: [{ // 经营方式
        label: '加盟',
        value: 1
      }],
      isRecommendStatusList: [{ // 是否推荐
        label: '推荐',
        value: '1'
      }, {
        label: '非推荐',
        value: '2'
      }]
    }
  },
  created() {
    this.getShopList()
    this.getStyleList()
  },
  methods: {
    showDialog() {
      this.$emit('open-dialog')
    },
    getStyleList() {
      this.$api.channel
        .getShopStyle({
          pageSize: 10,
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
    fetchAreaData(node = {}, callBack) {
      const { level, value } = node
      this.$api.basic.queryAllRegion({
        parentCode: value || 0
      }).then(res => {
        const data = res.totalCount ? res.data : res
        let curData = []
        if (data && data.length) {
          curData = data.map(res => ({
            leaf: level ? level >= 2 : 0,
            value: res.code,
            label: res.name
          }))
        }
        if (value === 0) {
          this.areaOptions = curData
        } else {
          typeof callBack === 'function' && callBack(curData)
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
      this.$confirm('您填写的信息将被重置，确定要更换吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.formModel.businessCode = ''
          this.getShopList()
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
      // shopLogoRef、shopImageRef、exhibitionImageRef、videoUrl
      // if (this.uploadType === 'videoUrl') {
      //   this.formModel[this.uploadType] = fileList
      //   this.formModel.videoUrlCoverImage = fileList
      // }
      console.log(this.formModel[this.uploadType], this.uploadType)
      this.formModel[this.uploadType] = fileList
    },
    uploadRemove(file, fileList) {
      this.fileList = fileList
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
}
</style>
