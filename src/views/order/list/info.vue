<template>
  <div class="order-info">
    <div class="info-item">
      <i class="el-icon-view"></i>
      <p>
        <span>订单总数：</span>
        <span>销售订单：</span>
        <span>售后订单：</span>
      </p>
    </div>
    <div class="info-item">
      <i class="el-icon-view"></i>
      <p>
        <span>YOSHOP：</span>
        <span>星GO：</span>
        <span>IPX：</span>
      </p>
    </div>
    <div class="info-item">
      <i class="el-icon-view"></i>
      <p>
        <span>顺丰：</span>
        <span>申通：</span>
        <span>圆通：</span>
        <span>其他：</span>
      </p>
    </div>
    <div class="info-item">
      <i class="el-icon-view"></i>
      <p>
        <span>订单总金额(元)：</span>
        <span>优惠券抵扣总额(元)：</span>
        <span>优惠券使用总额(元)：</span>
        <span>代金券抵扣总额(元)：</span>
      </p>
      <p>
        <span>售后总金额(元)：</span>
        <span>余额抵扣总金额(元)：</span>
        <span>积分抵扣总金额(元)：</span>
        <span>星GO卡抵扣总额(元)：</span>
      </p>
      <p>
        <span>第三方支付(元)：</span>
        <span>运费(元)：</span>
      </p>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {}
  },

  methods: {

  },

  components: {
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
    margin-right: 20px;
    padding: 0px 20px;
    background-color: @light_gray;
    border-radius: 4px;
    p {
      padding: 5px 20px;
      span {
        min-width: 160px;
        display: block;
        padding: 10px 0;
      }
    }
  }
}
</style>
