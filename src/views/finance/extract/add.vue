<template>
  <div class="check-container">
    <div v-if="showType === 1 || showType === 3">
      <div class="check-info">
        <div class="label">{{showType === 1 ? "申请信息：" : "审核结果："}}</div>
        <ul class="extract-info">
          <li>
            <span>提现金额(元)：</span>
            <span>{{initData.extractAmount}}</span>
          </li>
          <li v-if="showType === 3">
            <span>审核金额(元)：</span>
            <span>{{initData.checkAmount}}</span>
          </li>
          <li v-if="showType === 3">
            <span>手续费(元)：</span>
            <span>{{initData.checkServiceFee}}</span>
          </li>
          <li>
            <span>持卡人：</span>
            <span>{{initData.cardholder}}</span>
          </li>
          <li>
            <span>开户行：</span>
            <span>{{initData.bankName}}</span>
          </li>
          <li>
            <span>银行卡号：</span>
            <span>{{initData.bankCardNo}}</span>
          </li>
          <li>
            <span>开户支行：</span>
            <span>{{initData.branchBankName}}</span>
          </li>
          <li v-if="showType === 3 && initData.checkReason">
            <span>拒绝原因：</span>
            <span>{{initData.checkReason}}</span>
          </li>
        </ul>
        <template v-if="showType === 1">
          <div class="label">审核信息：</div>
          <el-form
            ref="formRef"
            class="check-form"
            :model="formModel"
            :inline="true"
            :rules="rules"
          >
            <el-form-item label="审核金额(元)：" prop="checkAmount">
              <el-input
                v-model.trim="formModel.checkAmount"
                :size="size"
                placeholder="请输入审核金额"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="手续费(元)：" prop="checkServiceFee">
              <el-input
                v-model.trim="formModel.checkServiceFee"
                placeholder="请输入提现手续费"
                :size="size"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="交易流水号：" prop="serialNumber">
              <el-input
                v-model.trim="formModel.serialNumber"
                placeholder="请输入交易流水号"
                :size="size"
                clearable
              ></el-input>
            </el-form-item>
          </el-form>
        </template>
      </div>
    </div>
    <div v-if="showType === 2">
      <el-form ref="formRef" :model="formModel" :rules="rules">
        <el-form-item prop="checkReason">
          <el-input
            :rows="4"
            type="textarea"
            v-model.trim="formModel.checkReason"
            placeholder="请输入拒绝提现的原因"
            maxlength="300"
            show-word-limit
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    initData: Object,
    showType: {
      type: Number,
      default: 1
    }
  },
  data(vm) {
    const checkNumber = (rule, value, callback) => {
      if (!value || (!Number(value) && Number(value) !== 0) || Number(value) < 0) {
        return callback(new Error('手续费为正数字或零'))
      }
      if (Number(vm.initData.extractAmount) < Number(value)) {
        return callback(new Error('手续费不能大于提现金额'))
      }
      if (vm.formModel.checkAmount && Number(vm.initData.extractAmount) < Number(value) + Number(vm.formModel.checkAmount)) {
        return callback(new Error('手续费与审核金额之和不能大于提现金额'))
      }
      callback()
    }
    const checkAmountNumber = (rule, value, callback) => {
      if (!value || !Number(value) || Number(value) < 0) {
        return callback(new Error('审核金额为正数字'))
      }
      if (Number(vm.initData.extractAmount) < Number(value)) {
        return callback(new Error('审核金额不能大于提现金额'))
      }
      if ((vm.formModel.checkServiceFee || Number(vm.formModel.checkServiceFee) === 0) && Number(vm.initData.extractAmount) < Number(value) + Number(vm.formModel.checkServiceFee)) {
        return callback(new Error('审核金额与手续费之和不能大于提现金额'))
      }
      callback()
    }
    return {
      size: 'small',
      formModel: {
        checkAmount: '',
        checkServiceFee: '',
        serialNumber: '',
        checkReason: '',
        id: vm.initData.id
      },
      rules: {
        checkAmount: [
          { required: true, validator: checkAmountNumber, trigger: 'blur' }
        ],
        checkServiceFee: [
          { required: true, validator: checkNumber, trigger: 'blur' }
        ],
        serialNumber: [
          { required: true, message: '交易流水号不能为空', trigger: 'blur' }
        ],
        checkReason: [
          { required: true, message: '拒绝原因不能为空', trigger: 'blur' }
        ]
      }
    }
  }
}
</script>

<style lang='less' scoped>
.check-info {
  min-height: 280px;
  .label {
    font-weight: bold;
    margin-bottom: 10px;
  }
  .extract-info {
    border: 1px solid @border-default;
    border-radius: 4px;
    padding: 10px 10px;
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 10px;
    li {
      min-width: 290px;
      line-height: 30px;
      span {
        display: inline-block;
        &:first-child {
          width: 100px;
          text-align: right;
        }
      }
    }
  }
  .check-form {
    padding: 10px 0 15px 15px;
    border: 1px solid @border-default;
    border-radius: 4px;
  }
}
</style>
