<template>
  <c-card :name="title" class="form-card" id="form-base">
    <el-form
      ref="basicFormRef"
      :model="formModel"
      label-width="120px"
      class="form"
      label-position="right"
    >
      <el-form-item label="活动名称:" prop="activityName">
        <el-input
          disabled
          class="select-item"
          v-model.trim="formModel.activityName"
          :size="size"
          placeholder="请输入活动名称"
          clearable
        />
      </el-form-item>
      <el-form-item label="活动类型:" prop="activityType">
        <query-dict
          :dict-list="activityTypeList"
          class="search-item"
          placeholder="请选择活动类型"
          :value.sync="formModel.activityType"
        ></query-dict>
      </el-form-item>
      <el-form-item label="使用渠道:" prop="platformList">
        <query-dict
          :dict-list="lobList"
          class="search-item"
          placeholder="请选择使用渠道"
          :value.sync="formModel.platformList"
        ></query-dict>
      </el-form-item>
      <!-- 活动类型：满件折 开始 -->
      <!-- <el-form-item label="折扣条件:"
            v-for="(item, index) in formModel.marketPreferentialRules"
            :key="index"
          >
            <el-col :span="8">
              <el-form-item
                inline
                :prop="'marketPreferentialRules.' + index + '.preferentialLevel'"
                :rules="{
                  required: true, validator: checkNumber, trigger: 'blur'
                }"
              >
                <el-input
                  class="discount-item"
                  v-model.trim="item.preferentialLevel"
                  size="medium"
                  placeholder="输入订单金额，0为不限制"
                  clearable
                  style="width: 100%"
                >
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                inline
                :prop="'marketPreferentialRules.' + index + '.preferentiaMaxlLevel'"
                :rules="{
                  required: true, validator: checkNumber, trigger: 'blur'
                }"
              >
                <el-input
                  class="discount-item"
                  v-model.trim="item.preferentialLevel"
                  size="medium"
                  placeholder="输入订单金额，0为不限制"
                  clearable
                  style="width: 100%"
                >
                  <template slot="append">件，</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col class="discount-type" :span="2">享受</el-col>
            <el-col :span="8">
              <el-form-item
                :prop="'couponPreferentialRules.' + index + '.preferentialValue'"
                :rules="{
                  required: true, validator: checkNumber, trigger: 'blur'
                }"
              >
                <el-input
                  class="discount-item"
                  v-model.trim="item.preferentialValue"
                  size="medium"
                  placeholder="优惠的金额"
                  clearable
                  style="width: 100%"
                >
                  <template slot="append">折</template>
                </el-input>
              </el-form-item>
            </el-col>
      </el-form-item>-->

      <!-- 活动类型：满件折 结束 -->
      <el-form-item label="活动时间类型:" prop="activateDayType">
        <query-dict
          :dict-list="activateDayTypeList"
          class="search-item"
          placeholder="请选择活动时间类型"
          :value.sync="formModel.activateDayType"
        ></query-dict>
      </el-form-item>
      <el-form-item label="设置固定周期:" prop="activateTime">
        <el-date-picker
          size="medium"
          v-model="formModel.activateTime"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          format="yyyy-MM-dd HH:mm:ss"
          end-placeholder="截止日期"
          :default-time="['00:00:00', '23:59:59']"
          align="right"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="设置固定月份:" prop="activateMonths">
        <el-checkbox-group v-model="formModel.activateMonths">
          <el-checkbox
            class="checkbox-item"
            :label="item"
            v-for="(item, index) in 12"
            :key="index"
          >{{ item + '月' }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="设置固定日期:" prop="activateDays">
        <el-checkbox-group v-model="formModel.activateDays">
          <el-checkbox
            class="checkbox-item"
            :label="item"
            v-for="(item, index) in 31"
            :key="index"
          >{{ item + '号' }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
  </c-card>
</template>
<script>
import MixinForm from 'mixins/form'
import CCard from 'components/card'
import utils from 'utils'
import dictObj from '@/store/dictData'

export default {
  mixins: [MixinForm],
  data() {
    return {
      pickerOptions: utils.pickerOptions,
      activateDayTypeList: [{ // 活动时间类型
        label: '固定时间可领取',
        value: 0
      }, {
        label: '所有时间可领取',
        value: 1
      }],
      monthList: [ // 月份
        '1月',
        '2月',
        '3月',
        '4月',
        '5月',
        '6月',
        '7月',
        '8月',
        '9月',
        '10月',
        '11月',
        '12月'
      ],
      activityTypeList: dictObj.activityTypeList, // 活动类型
      lobList: dictObj.lobList, // 渠道
      formModel: {
        activateMonths: [],
        activateDays: [],
        activateTime: ''
      }
    }
  },
  props: {
    title: String,
    isTag: {
      type: Boolean,
      default: false
    },
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
  created() {
    this.getCategoryList()
    // this.initData()
    if (!this.isTag) {
      this.getbrandList()
    }
  },
  methods: {
    initData() {
      const {
        goodsName, // 商品图片
        operationName, // 运营名称
        categoryCode, // 分类code
        categoryName, // 分类名称
        goodsBn, // 商品款号
        supplierCode, // 供应商款号
        supplierName, // 供应商
        brandName, // 商品品牌
        goodsStyleName, // 款式来源
        saleYear, // 年份
        season, // 季节
        sourceSupplierName, // 货源商
        coverImg, // 识别图/封面图
        marketable, // 是否可售
        updatebyName, // 上货人
        skus,
        updated,
        created
        // categoryCode,
        // businessValue,
        // goodsTypeId,
        // brandName,
        // brandId,
        // goodsName,
        // goodsShortName,
        // goodsStaticFiles,
        // goodsBrief,
        // goodsBn,
        // origin,
        // categoryName,
        // skus,
        // updated,
        // created
      } = this.dataObj
      let seasonCN = ''
      switch (season) {
        case 1:
          seasonCN = '春'
          break
        case 2:
          seasonCN = '夏'
          break
        case 3:
          seasonCN = '秋'
          break
        case 4:
          seasonCN = '冬'
          break
      }
      let skuList = [] // 商品打标签下 sku 图片列表
      if (this.isTag) {
        skus && skus.forEach(({ imageUrl }) => {
          skuList.push(imageUrl)
        })
        skuList = utils.uniqueArr(skuList) // 去重sku图片
      }

      const curCategoryCode = []
      if (categoryCode) {
        const codeLen = categoryCode.split('')
        codeLen.forEach((res, index) => {
          if (index % 2 === 0 && index + 2 <= codeLen.length) {
            curCategoryCode.push(categoryCode.substr(0, index + 2))
          }
        })
      }
      this.formModel = {
        goodsName, // 商品图片
        operationName, // 运营名称
        categoryCode, // 分类code
        categoryName, // 分类名称
        goodsBn, // 商品款号
        supplierCode, // 供应商款号
        supplierName, // 供应商
        brandName, // 商品品牌
        goodsStyleName, // 款式来源
        saleYear, // 年份
        season: seasonCN, // 季节
        sourceSupplierName, // 货源商
        coverImg, // 识别图/封面图
        marketable, // 是否可售
        updatebyName,
        skus,
        updated,
        created
      }
    },
    getCategoryList() {
      this.$api.basic.queryCategoryAll().then(res => {
        this.categoryList = utils.formartLevelData(res)
      })
    },
    getbrandList() {
      this.$api.basic.brandList({
        pageNo: 1,
        pageSize: 100,
        status: 1
      }).then(res => {
        const { data, totalCount } = res
        if (totalCount) {
          this.brandList = data.map(val => ({
            label: val.name,
            value: val.id
          }))
        }
      })
    },
    uploadSuccess(response, file, fileList) {
      this.fileList = fileList
    },
    uploadRemove(file, fileList) {
      this.fileList = fileList
    },
    uploadReview(file) {
      this.$emit('show-image', file)
    }
  },
  components: {
    CCard
  }
}
</script>
<style lang="less" scoped>
.form-card {
  .el-form-item {
    width: 98%;
    margin-bottom: 15px;
  }
  .select-item {
    width: 30%;
  }
}
</style>
