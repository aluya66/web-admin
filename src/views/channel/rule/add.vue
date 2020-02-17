<template>
  <el-form
    ref="formRef"
    :rules="rules"
    :model="formModel"
    label-width="120px"
    class="dialog-form"
    label-position="right"
  >
    <el-form-item label="规则名称:" prop="ruleName">
      <el-input v-model.trim="formModel.ruleName" class="input-item" placeholder="请输入规则名称"/>
    </el-form-item>
    <el-form-item label="商品品牌:" prop="brands">
      <el-select v-model="formModel.brands" class="input-item" filterable value-key="code" multiple >
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
        :table-inner-btns="tableInnerBtns"
      ></c-table>
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
          brands: [] // 选中品牌
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
    }
  },
  data(vm) {
    return {
      formModel: {}, // 表单集合
      brandList: [], // 品牌列表
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
    const { brands, ...other } = this.initData

    this.formModel = {
      ...other,
      brands
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
