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
      <el-input v-model.trim="formModel.ruleName" class="form-item" placeholder="请输入规则名称"/>
    </el-form-item>
    <el-form-item label="商品品牌:" prop="brands">
      <el-select
        v-model="formModel.brands"
        class="form-item"
        filterable
        value-key="code"
        multiple
      >
        <el-option
          v-for="item in brandList"
          :key="item.id"
          :label="item.name"
          :value="item"
        ></el-option>
      </el-select>
      <c-table
        v-show="formModel.brands && formModel.brands.length"
        hasBorder
        noPage
        :size="size"
        :loading="isLoading"
        :table-header="tableHeader"
        :table-list="tableList"
        :table-inner-btns="tableInnerBtns"
      ></c-table>
    </el-form-item>
    <el-form-item label="价格设置:">
      <el-checkbox-group v-model="priceSettingList">
        <el-checkbox
          v-for="(item, index) in priceSettingList"
          :key="index"
          :label="item"
          disabled
        >{{ item }}</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="库存设置:" prop="store">
      <el-checkbox v-model="formModel.store" disabled>默认全部</el-checkbox>
    </el-form-item>
    <el-form-item label="支付方式:" prop="payment">
      <el-radio-group v-model="formModel.payment">
        <el-radio
          v-for="(item, index) in payTypeList"
          :key="index"
          :label="item.value"
          disabled
        >{{ item.name }}</el-radio>
      </el-radio-group>
    </el-form-item>
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
          payment: 2, // 支付方式：1-支付宝,2-微信,4-银行卡
          costPrice: 1, // 成衣成本价
          largeBatchPrice: 1, // 成衣大批价
          memberPrice: 1, // 会员价
          retailPrice: 1, // 零售价
          supplyPrice: 1, // 成衣供货价
          wholesalePrice: 1, // 成衣散批价
          store: 0 // 库存设置:0-默认全部，其他待定
        }
      }
    }
  },
  watch: {
    'formModel.brands'(val) {
      val && this.getCurBrand(val)
    }
  },
  data(vm) {
    return {
      formModel: {}, // 表单集合
      brandList: [], // 品牌列表
      priceSettingList: ['成衣成本价', '成衣供货价', '成衣批发价', '成衣散批价', '成衣会员价', '零售价'], // 价格设置列表
      payTypeList: [{ // 支付类型
        name: '支付宝',
        value: 1
      }, {
        name: '微信',
        value: 2
      }, {
        name: '银行卡',
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
    this.formModel = {
      ...other,
      brands,
      costPrice: Boolean(costPrice),
      largeBatchPrice: Boolean(largeBatchPrice),
      memberPrice: Boolean(memberPrice),
      retailPrice: Boolean(retailPrice),
      supplyPrice: Boolean(supplyPrice),
      wholesalePrice: Boolean(wholesalePrice),
      store: true
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
