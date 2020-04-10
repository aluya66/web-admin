<template>
  <c-card :name="title" class="form-card" id="form-base">
    <el-form
      ref="formRef"
      :model="formModel"
      label-width="120px"
      class="form"
      label-position="right"
    >
      <el-form-item label="商品名称:" prop="goodsName">
        <el-input
          v-if="!isView"
          disabled
          class="select-item"
          v-model.trim="formModel.goodsName"
          :size="size"
          placeholder="请输入商品名称"
          clearable
        />
        <span v-else>{{formModel.goodsName}}</span>
      </el-form-item>
      <template v-if="!isTag">
        <el-form-item label="运营名称:">
          <el-input
            v-if="!isView"
            class="select-item"
            v-model.trim="formModel.operationName"
            :size="size"
            :disabled="isDisabled"
            placeholder="请输入运营名称"
            clearable
          />
          <span v-else>{{formModel.operationName}}</span>
        </el-form-item>
        <el-form-item
          label="商品完善状态:"
          v-if="formModel.perfectName !== '已完善' && formModel.perfectName !== '完善'"
        >
          <el-input
            v-if="!isView"
            class="select-item"
            v-model.trim="formModel.perfectName"
            :size="size"
            disabled
            clearable
          />
          <span v-else>{{formModel.perfectName}}</span>
        </el-form-item>
      </template>
      <template v-else>
        <el-form-item label="经营类型:">{{formModel.businessValue}}</el-form-item>
      </template>
       <el-form-item label="商品类型:">
        <div>{{productTypeMap[formModel.productType]}}</div>
        <div>注：以下情况任何一种均为代销货品，代销货品的订单需要人工手动处理订单，代销货品不进云尚星仓库，由第三方承接货品出库及配送</div>
      </el-form-item>
      <el-form-item label="基础分类:">
        <el-cascader
          v-if="!isView"
          disabled
          class="select-item"
          placeholder="搜索商品类目名称"
          v-model="formModel.categoryCode"
          :options="categoryList"
          filterable
        ></el-cascader>
        <span v-else>{{formModel.categoryName}}</span>
      </el-form-item>
      <el-form-item label="商品款号:">
        <el-input
          v-if="!isView"
          disabled
          class="select-item"
          v-model.trim="formModel.goodsBn"
          :size="size"
          placeholder="请输入商品款号"
          clearable
        />
        <span v-else>{{formModel.goodsBn}}</span>
      </el-form-item>
      <template v-if="!isTag">
        <el-form-item label="供应商款号:">
          <el-input
            v-if="!isView"
            class="select-item"
            disabled
            v-model.trim="formModel.supplierNumber"
            :size="size"
            placeholder="请输入供应商款号"
            clearable
          />
          <span v-else>{{formModel.supplierNumber}}</span>
        </el-form-item>
        <el-form-item label="供应商:">
          <el-input
            v-if="!isView"
            class="select-item"
            disabled
            v-model.trim="formModel.supplierName"
            :size="size"
            placeholder="请输入供应商"
            clearable
          />
          <span v-else>{{formModel.supplierName}}</span>
        </el-form-item>
        <el-form-item label="商品品牌:">
          <el-input
            v-if="!isView"
            class="select-item"
            disabled
            v-model.trim="formModel.brandName"
            :size="size"
            placeholder="请输入商品品牌"
            clearable
          />
          <span v-else>{{formModel.brandName}}</span>
        </el-form-item>
        <el-form-item label="款式来源:">
          <el-input
            v-if="!isView"
            class="select-item"
            disabled
            v-model.trim="formModel.goodsStyleName"
            :size="size"
            placeholder="请输入款式来源"
            clearable
          />
          <span v-else>{{formModel.goodsStyleName}}</span>
        </el-form-item>
        <el-form-item label="年份:">
          <el-input
            v-if="!isView"
            class="select-item"
            disabled
            v-model.trim="formModel.saleYear"
            :size="size"
            placeholder="请输入年份"
            clearable
          />
          <span v-else>{{formModel.saleYear}}</span>
        </el-form-item>
        <el-form-item label="季节:">
          <el-input
            v-if="!isView"
            class="select-item"
            disabled
            v-model.trim="formModel.season"
            :size="size"
            placeholder="请输入季节"
            clearable
          />
          <span v-else>{{formModel.season}}</span>
        </el-form-item>
        <el-form-item label="货源商:">
          <el-input
            v-if="!isView"
            class="select-item"
            disabled
            v-model.trim="formModel.sourceSupplierName"
            :size="size"
            placeholder="请输入货源商"
            clearable
          />
          <span v-else>{{formModel.sourceSupplierName}}</span>
        </el-form-item>
        <el-form-item label="上货人:">
          <el-input
            v-if="!isView"
            class="select-item"
            disabled
            v-model.trim="formModel.publisher"
            :size="size"
            placeholder="请输入上货人"
            clearable
          />
          <span v-else>{{formModel.publisher}}</span>
        </el-form-item>
        <el-form-item label="创建时间:" prop="created">
          <el-date-picker
            disabled
            v-model="formModel.created"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="dateTime"
            class="select-item"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="更新时间:" prop="updated">
          <el-date-picker
            disabled
            v-model="formModel.updated"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="dateTime"
            class="select-item"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
         <el-form-item label="上新时间:" prop="newTime">
          <el-date-picker
            disabled
            v-model="formModel.newTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="dateTime"
            class="select-item"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="商品是否可售:" prop="marketable" required>
          <el-radio-group v-model="formModel.marketable" :disabled="formModel.perfectName !== '已完善' && formModel.perfectName !== '完善'">
            <el-radio :label="2">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
      </template>
      <!-- 商品打标签  -->
      <template v-if="isTag">
        <el-form-item label="封面图片:">
          <c-image
            class="coverImg"
            :url="formModel.coverImg"
            fit="contain"
            :preview-src-list="[formModel.coverImg]"
          ></c-image>
        </el-form-item>
        <el-form-item label="sku图片:" class="sku-image">
          <c-image
            v-for="(item, index) in formModel.skuList"
            :key="index"
            class="coverImg"
            :url="item"
            fit="contain"
            :preview-src-list="[item]"
          ></c-image>
        </el-form-item>
      </template>
    </el-form>
  </c-card>
</template>
<script>
import CCard from 'components/card'
import CImage from 'components/image'
import utils from 'utils'

export default {
  data() {
    return {
      productTypeMap: { 1: '代销', 2: '采买' },
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
      formModel: {}
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
        perfectName, // 商品完善状态
        categoryCode, // 分类code
        categoryName, // 分类名称
        goodsBn, // 商品款号
        supplierNumber, // 供应商款号
        supplierName, // 供应商
        brandName, // 商品品牌
        goodsStyleName, // 款式来源
        saleYear, // 年份
        season, // 季节
        sourceSupplierName, // 货源商
        coverImg, // 封面图
        marketable, // 是否可售
        publisher, // 上货人
        businessValue, // 经营类型
        skus,
        newTime, // 上新时间
        updated,
        created,
        productType//商品分类
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
        perfectName, // 商品完善状态
        categoryCode, // 分类code
        categoryName, // 分类名称
        goodsBn, // 商品款号
        supplierNumber, // 供应商款号
        supplierName, // 供应商
        brandName, // 商品品牌
        goodsStyleName, // 款式来源
        saleYear, // 年份
        season: seasonCN, // 季节
        sourceSupplierName, // 货源商
        coverImg, // 识别图/封面图
        marketable, // 是否可售
        businessValue,
        publisher,
        skus,
        skuList,
        newTime, // 上新时间
        updated,
        created,
        productType,//商品分类
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
    CCard,
    CImage
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
  .coverImg {
    width: 200px;
    height: 200px;
    display: inline-block;
    margin-right: 5px;
  }
}
</style>
