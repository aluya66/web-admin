<template>
  <c-card :name="title" class="form-card" id="form-apply">
    <el-form
      ref="applyFormRef"
      :model="formModel"
      label-width="120px"
      class="form"
      label-position="right"
    >
      <el-form-item label="申请人:">
        <el-input
          disabled
          class="select-item"
          v-model.trim="formModel.applicants"
          :size="size"
          placeholder="请输入申请人"
          clearable
        />
      </el-form-item>
      <el-form-item label="申请部门:">
       <el-input
          disabled
          class="select-item"
          v-model.trim="formModel.applyingDepartment"
          :size="size"
          placeholder="请输入申请部门"
          clearable
        />
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" v-model.trim="formModel.remark" :disabled="isDisabled"/>
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
      activityTypeList: dictObj.activityTypeList, // 活动类型
      lobList: dictObj.lobList, // 渠道
      businessArr: [{
        label: '自营',
        value: 1
      }],
      goodsTypeArr: [{
        label: '服装',
        value: 1
      }],
      originList: [{
        label: '门店挂板',
        value: 1
      }, {
        label: '代销商品',
        value: 2
      }, {
        label: '自营商品',
        value: 3
      }],
      categoryList: [],
      brandList: [],
      formModel: {
        marketPreferentialRules: [1, 2, 3]
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
    this.initData()
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
