<template>
  <el-form
    ref="formRef"
    :model="formModel"
    label-width="150px"
    class="form"
    :rules="rules"
    label-position="right"
    status-icon
  >
    <el-form-item label="应结算总金额(元):" v-if="showType === 1 || showType === 3">
      <span class="red">{{formModel.settleStatus === 2 ? formModel.settleActualPay : formModel.settleWaitPay}}</span>
    </el-form-item>
    <template v-if="showType === 1">
      <el-form-item label="实际结算金额(元):" prop="settleActualPay">
        <el-input v-model.trim="formModel.settleActualPay" placeholder="请输入实际结算金额" clearable></el-input>
      </el-form-item>
    </template>
    <template v-if="showType === 3">
      <el-form-item label="已结算总金额(元):"><span class="blue">{{formModel.curPayAmount || "0.00"}}</span></el-form-item>
      <el-form-item label="付款金额(元):" prop="payAmount">
        <el-input v-model.trim="formModel.payAmount" placeholder="请输入付款金额" clearable></el-input>
      </el-form-item>
      <el-form-item label="手续费(元):" prop="serviceFee">
        <el-input v-model.trim="formModel.serviceFee" placeholder="请输入手续费" clearable></el-input>
      </el-form-item>
      <el-form-item label="打款流水号:" prop="paySerialNumber">
        <el-input v-model.trim="formModel.paySerialNumber" placeholder="请输入打款流水号" clearable></el-input>
      </el-form-item>
    </template>
    <el-form-item label="备注:" :prop="showType === 2 ? 'remark' : ''">
      <el-input
        type="textarea"
        v-model.trim="formModel.remark"
        placeholder="请输入备注"
        :rows="3"
        maxlength="300"
        show-word-limit
      ></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
import MixinForm from 'mixins/form'
import utils from 'utils'

export default {
  mixins: [MixinForm],
  props: {
    dataObj: Object,
    showType: Number
  },
  data(vm) {
    const checkCheckNumber = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('实际结算金额不能为空'))
      } else if ((/^([1-9]{1}\d{0,6})(\.\d{0,2})?$/.test(value) || /^(0{1})(\.\d{0,2})?$/.test(value)) && Number(value)) {
        if (Number(vm.formModel.settleWaitPay) < Number(value)) {
          return callback(new Error('实际结算金额不能大于应结算总金额'))
        }
        callback()
      } else {
        return callback(new Error('实际结算金额为大于0小于等于9999999.99，且最多两位小数的有效数字'))
      }
    }

    const checkNumber = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手续费不能为空'))
      } else if (/^([1-9]{1}\d{0,6})(\.\d{0,2})?$/.test(value) || /^(0{1})(\.\d{0,2})?$/.test(value)) {
        if (utils.sumPack([vm.formModel.settleActualPay, -vm.formModel.curPayAmount]) < Number(value)) {
          return callback(new Error('手续费不能大于应结算总金额减去已结算总金额的额度'))
        }
        if (vm.formModel.payAmount && (utils.sumPack([vm.formModel.settleActualPay, -vm.formModel.curPayAmount]) < utils.sumPack([value, vm.formModel.payAmount]))) {
          return callback(new Error('手续费与付款金额之和不能大于应结算金额减去已结算金额的额度'))
        }
        callback()
      } else {
        return callback(new Error('手续费为0～9999999.99，且最多两位小数的有效数字'))
      }
    }

    const checkAmountNumber = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('付款金额不能为空'))
      } else if ((/^([1-9]{1}\d{0,6})(\.\d{0,2})?$/.test(value) || /^(0{1})(\.\d{1,2})$/.test(value)) && Number(value)) {
        if (utils.sumPack([vm.formModel.settleActualPay, -vm.formModel.curPayAmount]) < Number(value)) {
          return callback(new Error('付款金额不能大于应结算总金额减去已结算总金额的额度'))
        }
        if ((vm.formModel.serviceFee || Number(vm.formModel.serviceFee) === 0) && (utils.sumPack([vm.formModel.settleActualPay, -vm.formModel.curPayAmount]) < utils.sumPack([value, vm.formModel.serviceFee]))) {
          return callback(new Error('付款金额与手续费之和不能大于应结算总金额减去已结算总金额的额度'))
        }
        callback()
      } else {
        return callback(new Error('付款金额为大于0小于等于9999999.99，且最多两位小数的有效数字'))
      }
    }
    return {
      rules: {
        settleActualPay: [
          { required: true, validator: checkCheckNumber, trigger: 'blur' }
        ],
        payAmount: [
          { required: true, validator: checkAmountNumber, trigger: 'blur' }
        ],
        serviceFee: [
          { required: true, validator: checkNumber, trigger: 'blur' }
        ],
        paySerialNumber: [
          { required: true, message: '交易流水号不能为空', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '备注说明不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    formModel: {
      get() {
        return this.dataObj
      },
      set(val) {
        this.$emit('update:data-obj', val)
      }
    }
  }
}
</script>

<style lang='less' scoped>
.form {
  width: 92%;
}
</style>
