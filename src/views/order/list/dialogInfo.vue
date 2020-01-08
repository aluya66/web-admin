<template>
  <el-form
    ref="formRef"
    :model="formModel"
    :rules="rules"
    label-width="140px"
    class="form"
    label-position="right"
    status-icon
  >
    <el-form-item label="订单号:" prop="type">
      <query-dict
        :disabled="isEdit"
        :dict-list="salesTypeList"
        class="select-item"
        placeholder="请选择交易类型"
        :value.sync="formModel.type"
      ></query-dict>
    </el-form-item>
    <el-form-item label="区域地址:" prop="companyAddressCode">
      <el-cascader
        clearable
        class="select-item"
        :props="optionsProps"
        v-model="formModel.companyAddressCode"
        placeholder="请选择省市区"
        filterable
      ></el-cascader>
    </el-form-item>
    <el-form-item label="详细地址:" prop="companyAddress">
      <el-input
        v-model.trim="formModel.companyAddress"
        placeholder="请输入详细地址"
        class="form-item"
        clearable
      ></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
import dictObj from '@/store/dictData'
import MixinForm from 'mixins/form'

export default {
  mixins: [MixinForm],
  props: {
    initData: {
      type: Object,
      default() {
        return {
          type: '', // 交易类型
          transactionAmount: '', // 交易金额
          orderNo: '', // 交易单号
          remark: '' // 备注
        }
      }
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data(vm) {
    return {
      salesTypeList: dictObj.salesTypeList, // 交易类型集合
      rules: {
        type: [
          { required: true, message: '交易类型不能为空', trigger: 'change' }
        ],
        orderNo: [
          { required: true, message: '交易编号不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    formModel: {
      get() {
        return this.initData
      },
      set(val) {
        this.$emit('update:init-data', val)
      }
    }
  }
}
</script>
