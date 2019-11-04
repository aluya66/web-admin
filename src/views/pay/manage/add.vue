<template>
  <el-form
    ref="formRef"
    :model="formModel"
    label-width="200px"
    class="form"
    label-position="right"
  >
    <el-form-item label="用户名称:">
      <span>{{ formModel.tradeUserName }}</span>
    </el-form-item>
    <el-form-item label="订单编号:">
      <span>{{ formModel.transactionCode }}</span>
    </el-form-item>
    <el-form-item label="交易支付总金额(元):">
      <span>{{ formModel.payTotalAmountYuan }}</span>
    </el-form-item>
    <el-form-item label="交易实际支付的金额(元):">
      <span>{{ formModel.paiedAmountYuan }}</span>
    </el-form-item>
    <el-form-item label="交易退款总金额(元):">
      <span>{{ formModel.refundTotalAmountYuan }}</span>
    </el-form-item>
    <el-form-item label="交易实际退款的金额(元):">
      <span>{{ formModel.refundAmountYuan }}</span>
    </el-form-item>
    <el-form-item label="交易状态:">
      <span>{{ formModel.tradeStatus }}</span>
    </el-form-item>
    <el-form-item label="交易时间:">
      <span>{{ formModel.tradeTime }}</span>
    </el-form-item>
    <el-form-item label="交易通知时间:">
      <span>{{ formModel.tradeNotifiedTime }}</span>
    </el-form-item>
    <el-form-item label="业务线编码:">
      <span>{{ formModel.appCode }}</span>
    </el-form-item>
    <el-form-item label="门店编码:">
      <span>{{ formModel.shopCode }}</span>
    </el-form-item>
    <el-form-item label="第三方交易编码:">
      <span>{{ formModel.thirdTradeCode }}</span>
    </el-form-item>
    <el-form-item label="交易的流水的标识编码:">
      <span>{{ formModel.tradeItemCode }}</span>
    </el-form-item>
    <el-form-item label="交易手续费:">
      <span>{{ formModel.fee }}</span>
    </el-form-item>
    <el-form-item label="交易现金金额*比例:">
      <span>{{ formModel.feeRate }}</span>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    initData: {
      type: Object,
      default() {
        return {
        }
      }
    }
  },
  data() {
    return {

    }
  },
  computed: {
    formModel() {
      return this.initData
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
}
</style>
