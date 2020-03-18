<template>
  <div class="order-info">
    <div class="info-item">
      <i class="el-icon-tickets big-icon"></i>
      <p>
        <span>订单总数：{{dataInfo.orderQuantity}}</span>
        <span>销售订单：{{dataInfo.saleQuantity}}</span>
        <span>售后订单：{{dataInfo.afterSalesQuantity}}</span>
      </p>
    </div>
    <div class="info-item">
      <i class="el-icon-discount big-icon"></i>
      <p>
        <span>YOSHOP：{{dataInfo.ysOrderQuantity}}</span>
        <span>星GO：{{dataInfo.xgOrderQuantity}}</span>
        <span>IPX：{{dataInfo.ipxOrderQuantity}}</span>
        <span>YOSHOPS：{{dataInfo.yssOrderQuantity}}</span>
      </p>
    </div>
    <div class="info-item">
      <i class="el-icon-truck big-icon"></i>
      <p>
        <span>顺丰：{{dataInfo.sfExpressQuantity}}</span>
        <span>申通：{{dataInfo.stExpressQuantity}}</span>
        <span>圆通：{{dataInfo.ytExpressQuantity}}</span>
        <span>其他：{{dataInfo.otherExpressQuantity}}</span>
      </p>
    </div>
    <div class="info-item">
      <i class="el-icon-coin big-icon"></i>
      <p>
        <span>订单总金额(元)：{{dataInfo.orderTotalAmount}}</span>
        <span>优惠券抵扣总额(元)：{{dataInfo.couponAmount}}</span>
        <!-- <span>优惠券使用总额(元)：{{dataInfo.couponFaceAmount}}</span> -->
        <span>代金券抵扣总额(元)：{{dataInfo.voucherAmount}}</span>
      </p>
      <p>
        <span>售后总金额(元)：{{dataInfo.afterSalesAmount}}</span>
        <span>余额抵扣总金额(元)：{{dataInfo.walletAmount}}</span>
        <span>积分抵扣总金额(元)：{{dataInfo.payPointAmount}}</span>
        <span>星GO卡抵扣总额(元)：{{dataInfo.storedCardAmount}}</span>
      </p>
      <p class="top">
        <span>第三方支付(元)：{{dataInfo.confirmPaidAmount}}</span>
        <span>运费(元)：{{dataInfo.totalFreightAmount}}</span>
      </p>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    initData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    dataInfo: {
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

<style lang='less' scoped>
.order-info {
  display: flex;
  margin-bottom: 10px;

  .info-item {
    display: flex;
    align-items: center;
    margin-right: 10px;
    padding: 0px 20px;
    background-color: @light_gray;
    border-radius: 4px;
    .big-icon {
      font-size: @f24;
    }
    p {
      padding: 5px 20px;
      span {
        min-width: 150px;
        display: block;
        padding: 10px 0;
      }
    }
  }
}
</style>
