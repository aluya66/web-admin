<template>
  <div class="detail-info">
    <line-card title="订单信息">
      <div class="row">
        <span>订单号：</span>
        <span>子订单：</span>
        <span>订单类型：</span>
        <span>订单渠道：</span>
      </div>
      <div class="row">
        <span>所属店铺：</span>
        <span>结算状态：</span>
      </div>
      <div class="row">
        <span>客户名称：</span>
        <span>客户手机：</span>
        <span>下单方式：</span>
        <span>下单时间：</span>
        <span>订单状态：</span>
      </div>
    </line-card>
    <line-card title="支付信息">
      <div class="row">
        <span>支付方式：</span>
        <span>支付状态：</span>
        <span>支付时间：</span>
      </div>
      <div class="row">
        <span>支付单号：</span>
        <span>第三方流水号：</span>
      </div>
    </line-card>
    <line-card title="付款信息">
      <div class="row">
        <span>订单金额：</span>
        <span>优惠券金额：</span>
        <span>售后金额：</span>
        <span>订单支付手续费：</span>
        <span>余额抵扣：</span>
        <span>积分抵扣金额：</span>
      </div>
      <div class="row">
        <span>代金券抵扣：</span>
        <span>第三方支付：</span>
        <span>订单商品金额：</span>
      </div>
      <div class="row">
        <span>星购卡支付金额：</span>
        <span>订单结算金额：</span>
        <span>订单价格折让：</span>
      </div>
    </line-card>
    <line-card title="发票信息">
      <div class="row">
        <span>发券类型：</span>
        <span>发票抬头：</span>
      </div>
      <div class="row">
        <span>发票内容：</span>
      </div>
    </line-card>
    <line-card title="收获信息">
      <div class="row">
        <span>收货人：</span>
        <span>联系电话：</span>
        <span>配送方式：</span>
        <span>收货时间：</span>
      </div>
      <div class="row">
        <span>收货地址：</span>
      </div>
    </line-card>
    <line-card title="买家信息">
      <div class="row">
        <span>会员名称：</span>
        <span>会员昵称：</span>
        <span>会员账户：</span>
      </div>
      <div class="row">
        <span>会员等级：</span>
        <span>会员身份证：</span>
        <span>联系电话：</span>
      </div>
      <div class="row">
        <span>订单备注：</span>
      </div>
    </line-card>
    <line-card title="店铺信息">
      <div class="row">
        <span>所属店铺：</span>
        <span>联系人：</span>
        <span>联系电话：</span>
      </div>
    </line-card>
  </div>
</template>

<script>
import LineCard from '@/views/common/lineCard'

export default {
  data() {
    return {}
  },

  methods: {

  },

  components: {
    LineCard
  }
}
</script>

<style lang='less' scoped>
</style>
