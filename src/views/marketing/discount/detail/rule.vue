<template>
  <c-card :name="title" class="form-card" id="form-apply">
    <el-form
      ref="ruleFormRef"
      :model="formModel"
      label-width="120px"
      class="form"
      label-position="right"
    >
      <el-form-item label="门店:">
        <el-select :size="size" v-model="formModel.shopType" class="form-item" disabled>
          <el-option
            v-for="(item, index) in shopTypeList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-select
          v-model="formModel.marketUseStoreRuleLists.storeCodes"
          class="form-item"
          :size="size"
          filterable
          value-key="shopId"
          multiple
        >
          <el-option
            v-for="item in shopList"
            :key="item.shopId"
            :label="item.shopName"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品品牌:">
        <el-select
          v-model="formModel.marketUseProductRule.useBrandCodes"
          class="form-item"
          :size="size"
          multiple
        >
          <el-option v-for="item in brandList" :key="item.id" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品类目:">
        <el-cascader
          class="select-item"
          placeholder="搜索商品类目名称"
          :size="size"
          v-model="formModel.marketUseProductRule.useCategoryCodes"
          :options="categoryList"
          filterable
          :props="cascaderProp"
          collapse-tags
        ></el-cascader>
      </el-form-item>
      <el-form-item label="指定商品:">
        <el-button size="small" @click="showDialog('goods', '选择商品')">选择商品</el-button>
        商品：
        <div class="goods-box" v-for="(item, index) in goodsList" :key="index">
          <div class="goods-item">{{ item.goodsBn }}</div>
        </div>
        商品sku:
        <div class="goods-box" v-for="(item, index) in skuArr" :key="index">
          <div class="goods-item" v-for="(sku) in item.arr" :key="sku.goodsSkuSn">{{ sku.goodsSkuSn }}</div>
        </div>
      </el-form-item>
      <!-- <el-form-item label="用户类型:">
        <el-checkbox-group v-model="formModel.customerType">
          <el-checkbox
            v-for="(item, index) in customerTypeList"
            :key="index"
            :label="item.label"
            :value="item.label"
          >{{ item.label }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="指定用户:">
        <el-button size="small" @click="showDialog('customer', '选择用户')">选择用户</el-button>
        <div>
          <el-tag
            class="tag-item"
            v-for="(tag, index) in formModel.selectedCustomerList"
            :key="index"
            closable
            @close="cancelSelect(index)"
          >{{tag.name + '【' +tag.phone + '】'}}</el-tag>
        </div>
      </el-form-item>-->
    </el-form>
  </c-card>
</template>
<script>
import MixinForm from 'mixins/form'
import CCard from 'components/card'
import utils from 'utils'
// import dictObj from '@/store/dictData'

export default {
  mixins: [MixinForm],
  data() {
    return {
      brands: [],
      cascaderProp: { multiple: true },
      shopTypeList: [{
        label: '全部',
        value: 1
      }, {
        label: '直营店',
        value: 2
      }, {
        label: '加盟店',
        value: 3
      }],
      customerTypeList: [{
        label: '全部用户'
      }, {
        label: '全部会员'
      }, {
        label: '白金会员'
      }, {
        label: '钻石会员'
      }, {
        label: '非会员'
      }],
      categoryList: [],
      brandList: [],
      shopList: [],
      formModel: {},
      skuArr: []
    }
  },
  watch: {
    skuList: {
      handler(val) {
        this.skuArr = val
        console.log(this.skuArr, 'skuArr')
      },
      deep: true
    }
  },
  props: {
    title: String,
    dataObj: {
      type: Object,
      required: true
    },
    skuList: {
      type: Array,
      default() {
        return []
      }
    },
    goodsList: {
      type: Array,
      default() {
        return []
      }
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
  beforeMount() {
    this.getCategoryList()
    this.getbrandList()
    this.formModel = { ...this.dataObj, shopType: 2 }
  },
  methods: {
    getShopList(appCode) {
      this.$api.basic.getShopListByChannel({
        appCode,
        pageNo: 1,
        pageSize: 100
      }).then(res => {
        this.shopList = res || []
      })
    },
    cancelSelect(index) {
      this.formModel.selectedCustomerList.splice(index, 1)
    },
    showDialog(type, title) {
      this.$emit('show-dialog', type, title)
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
          this.brandList = data
        }
      })
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
  .tag-item {
    margin: 5px;
  }
}
</style>
