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
    <el-form-item label="交易类型:" prop="type">
      <query-dict
        :disabled="isEdit"
        :dict-list="salesTypeList"
        class="select-item"
        placeholder="请选择交易类型"
        :value.sync="formModel.type"
      ></query-dict>
    </el-form-item>
    <el-form-item
      label="交易金额(元):"
      prop="transactionAmount"
      :rules="{
          required: true, validator: checkNumber, trigger: 'blur'
        }"
    >
      <el-input v-model.trim="formModel.transactionAmount" class="form-item" clearable></el-input>
    </el-form-item>
    <el-form-item label="交易单号:" prop="orderNo">
      <el-input v-model.trim="formModel.orderNo" class="form-item" clearable></el-input>
    </el-form-item>
    <el-form-item label="备注:" prop="remark">
      <el-input
        type="textarea"
        class="form-item"
        v-model.trim="formModel.remark"
        placeholder="请输入备注"
        maxlength="300"
        show-word-limit
      ></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
import dictObj from '@/store/dictData'
import MixinForm from 'mixins/form'
import utils from 'utils'

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
          { required: true, validator: utils.validater.enOrNumText, trigger: 'blur' }
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

<style lang="less" scoped>
.form {
  width: 90%;
  .form-item {
    width: 100%;
  }
  .select-item {
    width: 50%;
  }
}
</style>
