<template>
  <c-card :name="title" class="form-card">
    <el-form-item label="店铺类型:" required>
      <query-dict
        :dict-list="shopTypeList"
        class="select-item"
        placeholder="请选择店铺类型"
        :value.sync="formModel.shopType"
      ></query-dict>
    </el-form-item>
    <el-form-item label="选择商户:" prop="businessCode">
      <el-select
        class="select-item"
        :disabled="isDisabled"
        v-model="formModel.businessCode"
        placeholder="请选择商户"
      >
        <el-option
          v-for="item in businessList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="门店LOGO:" prop="shopLogo">
      <c-upload
        ref="curUpload"
        class="pic"
        auto-upload
        action="/api/upload/file"
        list-type="picture-card"
        :size="20"
        :limit="5"
        :fileList="formModel.shopLogo"
        :on-success="uploadSuccess"
        :on-remove="uploadRemove"
        :on-preview="uploadReview"
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
          :label="item.type"
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
    <el-form-item label="是否推荐" prop="isRecommend" v-if="formModel.shopType === 1">
      <el-radio-group v-model="formModel.isRecommend">
        <el-radio
          class="checkbox-item"
          :label="item.value"
          v-for="(item, index) in isRecommendStatusList"
          :key="index"
        >{{ item.label }}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="门店风格" prop="style" v-if="formModel.shopType === 1">
      <el-select
        class="select-item"
        :disabled="isDisabled"
        v-model="formModel.style"
        placeholder="请选择商户"
      >
        <el-option
          v-for="item in styleList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="店招:" prop="shopImage" v-if="formModel.shopType === 1">
      <c-upload
        ref="curUpload"
        class="pic"
        auto-upload
        action="/api/upload/file"
        list-type="picture-card"
        :size="20"
        :limit="5"
        :fileList="formModel.shopImage"
        :on-success="uploadSuccess"
        :on-remove="uploadRemove"
        :on-preview="uploadReview"
      >
        <i class="el-icon-plus"></i>
        <div class="info">750px*350px</div>
      </c-upload>
    </el-form-item>
    <el-form-item label="展馆图:" prop="exhibitionImage" v-if="formModel.shopType === 1">
      <c-upload
        ref="curUpload"
        class="pic"
        auto-upload
        action="/api/upload/file"
        list-type="picture-card"
        :size="20"
        :limit="5"
        :fileList="formModel.exhibitionImage"
        :on-success="uploadSuccess"
        :on-remove="uploadRemove"
        :on-preview="uploadReview"
      >
        <i class="el-icon-plus"></i>
        <div class="info">750px*350px</div>
      </c-upload>
    </el-form-item>
    <el-form-item label="店铺视频:" prop="videoUrl" v-if="formModel.shopType === 1">
      <c-upload
        ref="curUpload"
        class="pic"
        auto-upload
        action="/api/upload/file"
        list-type="picture-card"
        :size="20"
        :limit="5"
        :fileList="formModel.videoUrl"
        :on-success="uploadSuccess"
        :on-remove="uploadRemove"
        :on-preview="uploadReview"
      >
        <i class="el-icon-plus"></i>
      </c-upload>
    </el-form-item>
    <el-form-item label="营业时间:" prop="businessHours" v-if="formModel.shopType === 1">
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
    <el-form-item label="描述:" prop="shopDescription" v-if="formModel.shopType === 1">
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
    <el-form-item label="经营方式:" prop="businessType">
      <el-select
        class="select-item"
        :disabled="isDisabled"
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
    <el-form-item label="结算方式:" prop="settleType">
      <el-select
        class="select-item"
        :disabled="isDisabled"
        v-model="formModel.settleType"
        placeholder="请选择结算方式"
      >
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
  </c-card>
</template>

<script>
import CCard from 'components/card'
import dictObj from '@/store/dictData'
import utils from 'utils'
import MixinForm from 'mixins/form'
import MixinFormCard from 'mixins/formCard'
import mixinTable from 'mixins/table'
// import CImage from 'components/image'
import CUpload from 'components/upload'

export default {
  components: {
    CCard,
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
    },
    isDisabled: {
      type: Boolean,
      default: false
    }
  },
  mixins: [MixinForm, MixinFormCard, mixinTable],
  data() {
    return {
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
      settleTypeList: [{  // 结算方式
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
      }],
    }
  },
  methods: {
    uploadSuccess(response, file, fileList) {
      this.fileList = fileList
    },
    uploadRemove(file, fileList) {
      this.fileList = fileList
    },
    uploadReview(file) {
      this.$emit('show-image', file)
    }
  }
}
</script>

<style lang="less" scoped>
.form {
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
