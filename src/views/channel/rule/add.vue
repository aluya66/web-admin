<template>
  <el-form
    ref="formRef"
    :rules="rules"
    :model="formModel"
    label-width="120px"
    class="form"
    label-position="right"
  >
    <el-form-item label="规则名称:" prop="ruleName">
      <el-input v-model.trim="formModel.ruleName" class="form-item" :disabled="isEdit" placeholder="请输入规则名称"/>
    </el-form-item>
    <el-form-item label="商品品牌:" prop="brands">
      <el-select v-model="formModel.brands" class="form-item" filterable value-key="code" multiple :disabled="isEdit">
        <el-option v-for="item in brandList" :key="item.id" :label="item.name" :value="item"></el-option>
      </el-select>
      <c-table
        v-show="formModel.brands && formModel.brands.length"
        hasBorder
        noPage
        :size="size"
        :loading="isLoading"
        :table-header="tableHeader"
        :table-list="tableList"
        :table-inner-btns="!isEdit ? tableInnerBtns : []"
      ></c-table>
    </el-form-item>
    <el-form-item label="价格设置:">
      <el-checkbox-group v-model="priceList">
        <el-checkbox
          v-for="(item, index) in priceSettingList"
          :key="index"
          :disabled="isEdit"
          :label="item.value"
        >{{ item.label }}</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <!-- <el-form-item label="库存设置:" prop="store">
      <el-checkbox v-model="formModel.store" disabled>默认全部</el-checkbox>
    </el-form-item>
    <el-form-item label="支付方式:" prop="payment">
      <el-checkbox-group v-model="formModel.payment">
        <el-checkbox
          v-for="(item, index) in payTypeList"
          :label="item.value"
          :key="index"
        >{{item.label}}</el-checkbox>
      </el-checkbox-group>
    </el-form-item> -->
  </el-form>
</template>
<script>
import mixinTable from 'mixins/table'
import MixinForm from 'mixins/form'

export default {
  mixins: [mixinTable, MixinForm],
  props: {
    initData: {
      type: Object,
      default() {
        return {
          ruleCode: '',
          ruleName: '',
          brands: [], // 选中品牌
          // payment: [1, 2, 4], // 支付方式：1-支付宝,2-微信,4-银行卡
          costPrice: 1, // 成衣成本价
          largeBatchPrice: 1, // 成衣大批价
          memberPrice: 1, // 会员价
          retailPrice: 1, // 零售价
          supplyPrice: 1, // 成衣供货价
          wholesalePrice: 1 // 成衣散批价
          // store: 0 // 库存设置:0-默认全部，其他待定
        }
      }
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    'formModel.brands'(value) {
      value && this.getCurBrand(value)
    },
    priceList(value) {
      const curObj = {}
      value && value.forEach(res => {
        curObj[res] = 1
      })
      this.formModel.submitPriceObj = {
        ...this.initPriceObj,
        ...curObj
      }
    }
  },
  data(vm) {
    return {
      formModel: {}, // 表单集合
      brandList: [], // 品牌列表
      priceList: [], // 价格设置集合
      initPriceObj: {}, // 设置价格集合初始值
      priceSettingList: [{
        label: '成衣成本价',
        value: 'costPrice'
      }, {
        label: '成衣供货价',
        value: 'supplyPrice'
      }, {
        label: '成衣大批价',
        value: 'largeBatchPrice'
      }, {
        label: '成衣散批价',
        value: 'wholesalePrice'
      }, {
        label: '成衣会员价',
        value: 'memberPrice'
      }, {
        label: '零售价',
        value: 'retailPrice'
      }],
      payTypeList: [{ // 支付类型
        label: '支付宝',
        value: 1
      }, {
        label: '微信',
        value: 2
      }, {
        label: '银行卡',
        value: 4
      }],
      tableInnerBtns: [{
        name: '删除',
        icon: 'el-icon-detail',
        handle({ code }) {
          vm.deleteBrand(code)
        }
      }],
      tableHeader: [{
        label: '品牌ID',
        prop: 'id'
      }, {
        label: '品牌名称',
        prop: 'name'
      }],
      rules: {
        ruleName: [
          { required: true, message: '规则名称不能为空', trigger: 'blur' }
        ],
        brands: [
          { required: true, message: '商品品牌不能为空', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.searchBrand()
    const { costPrice, largeBatchPrice, memberPrice, retailPrice, supplyPrice, wholesalePrice, store, brands, ...other } = this.initData
    const priceList = {
      costPrice,
      largeBatchPrice,
      memberPrice,
      retailPrice,
      supplyPrice,
      wholesalePrice
    }
    const curPriceList = [] // 操作时用
    const submitPriceObj = {} // 保存提交用
    const initPriceObj = {} // 初始化默认
    Object.keys(priceList).forEach(res => {
      if (priceList[res] === 1) {
        curPriceList.push(res)
      }
      initPriceObj[res] = 0
      submitPriceObj[res] = priceList[res]
    })
    this.priceList = curPriceList
    this.initPriceObj = initPriceObj

    this.formModel = {
      ...other,
      brands,
      priceList,
      submitPriceObj
    }
  },
  methods: {
    // 搜索品牌
    searchBrand() {
      this.$api.basic.brandList({ pageNo: 1, pageSize: 100, status: 1 }).then(res => {
        if (res && res.totalCount) {
          this.brandList = res.data
          this.getCurBrand(this.formModel.brands)
        }
      })
    },
    // 设置当前表格数据
    getCurBrand(curBrands) {
      if (curBrands && curBrands.length) {
        const curList = []
        curBrands.forEach(res => {
          const list = this.brandList.find(val => res.code === val.code)
          if (list) {
            curList.push(list)
          }
        })
        this.tableList = curList
      }
    },
    // 删除品牌
    deleteBrand(code) {
      let idx = this.formModel.brands.findIndex(item => item.code === code)
      idx !== -1 && this.formModel.brands.splice(idx, 1)
    }
  }
}
</script>

<style lang='less' scoped>
.form {
  width: 90%;
  .form-item {
    width: 100%;
  }
  .select-item {
    width: 50%;
  }
  .input-select {
    width: 80px;
  }
}
</style>
