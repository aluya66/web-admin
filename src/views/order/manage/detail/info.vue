<template>
  <div class="detail-info">
    <line-card title="订单信息" v-if="orderInfo.orderNewResp">
      <div class="row">
        <span>订单号：{{orderInfo.orderNewResp.parentCode}}</span>
        <span>子订单：{{orderInfo.orderNewResp.orderCode}}</span>
        <span>订单类型：{{setEnumValue(orderInfo.orderNewResp.orderCategory, shopTypeList)}}</span>
        <span>订单渠道：{{setEnumValue(orderInfo.orderNewResp.appCode, lobList)}}</span>
      </div>
      <div class="row">
        <span>所属店铺：{{orderInfo.orderNewResp.storeName}}</span>
        <span>结算状态：{{setEnumValue(orderInfo.orderNewResp.settleStatus, orderSettleStatusList)}}</span>
        <span v-if="orderInfo.orderNewResp.orderSourceWay===2">销售员：{{orderInfo.orderNewResp.staff}}</span>
        <span v-if="orderInfo.orderNewResp.orderSourceWay===2">销售员手机号：{{orderInfo.orderNewResp.staffPhone}}</span>
      </div>
      <div class="row">
        <span>客户名称：{{orderInfo.orderNewResp.buyerNick}}</span>
        <span>客户手机：{{orderInfo.orderNewResp.buyerMobile}}</span>
        <span>下单方式：{{setEnumValue(orderInfo.orderNewResp.orderSourceWay, orderSourceWayList)}}</span>
        <span>下单时间：{{orderInfo.orderNewResp.created}}</span>
        <span>订单状态：{{setEnumValue(orderInfo.orderNewResp.orderStatus, orderStatusList)}}</span>
      </div>
      <div class="row">
        <span>订单备注：{{orderInfo.orderNewResp.remark}}</span>
      </div>
    </line-card>
    <line-card title="支付信息" v-if="orderInfo.orderPayResp">
      <div class="row">
        <span>支付方式：{{setEnumValue((orderInfo.orderPayResp[0].payType).split(','),payTypeList)}}</span>
        <span>支付状态：{{setEnumValue(orderInfo.orderPayResp[0].status, payStatusList)}}</span>
        <span>支付时间：{{orderInfo.orderPayResp[0].created}}</span>
      </div>
      <div class="row">
        <span>支付单号：{{orderInfo.orderPayResp[0].flowCode}}</span>
        <span>第三方流水号：{{orderInfo.orderPayResp[0].thirdPartyPaycode}}</span>
      </div>
    </line-card>
    <line-card title="付款信息" v-if="orderInfo.orderNewResp">
      <div class="row">
        <span>订单总金额(元)：{{orderInfo.orderNewResp.orderTotalAmount}}</span>
        <span>优惠券金额(元)：{{orderInfo.orderNewResp.couponAmount}}</span>
        <span>售后金额(元)：{{orderInfo.orderNewResp.afterSalesAmount}}</span>
        <!-- <span>订单支付手续费(元)：{{orderInfo.orderNewResp.orderCode}}</span> -->
        <span>余额抵扣(元)：{{orderInfo.orderNewResp.walletAmount}}</span>
        <span>积分抵扣金额(元)：{{orderInfo.orderNewResp.payPointAmount}}</span>
      </div>
      <div class="row">
        <span>代金券抵扣(元)：{{orderInfo.orderNewResp.voucherAmount}}</span>
        <span>第三方支付(元)：{{orderInfo.orderNewResp.paidAmount}}</span>
        <span>订单商品金额(元)：{{orderInfo.orderNewResp.itemTotalAmount}}</span>
      </div>
      <div class="row">
        <span>星购卡支付金额(元)：{{orderInfo.orderNewResp.storedCardAmount}}</span>
        <span>订单结算金额(元)：{{orderInfo.orderNewResp.actualAmount}}</span>
        <span>订单价格折让(元)：{{orderInfo.orderNewResp.letProfitAmount}}</span>
      </div>
    </line-card>
    <line-card title="发票信息" v-if="orderInfo.orderInvoiceResp">
      <div class="row">
        <span>发票类型：{{setEnumValue(orderInfo.orderInvoiceResp.invoiceType, invoiceTypeList)}}</span>
        <span>发票抬头：{{orderInfo.orderInvoiceResp.title}}</span>
        <span>发票内容：{{orderInfo.orderInvoiceResp.content}}</span>
      </div>
      <div class="row">
        <span>电子邮箱：{{orderInfo.orderInvoiceResp.recipientMail}}</span>
        <span>发票备注：</span>
      </div>
    </line-card>
    <line-card title="收货信息" v-if="orderInfo.orderDeliveryAddressResp">
      <div class="row">
        <span>收货人：{{orderInfo.orderDeliveryAddressResp.name}}</span>
        <span>联系电话：{{orderInfo.orderDeliveryAddressResp.mobile}}</span>
        <span>收货时间：{{orderInfo.orderDeliveryAddressResp.signTime}}</span>
      </div>
      <div class="row">
        <span>配送方式：{{orderInfo.orderDeliveryAddressResp.deliveryTimeType === 1 ? '门店自提' : '快递'}}</span>
        <span>收货区域：{{orderInfo.orderDeliveryAddressResp.provinceName}}-{{orderInfo.orderDeliveryAddressResp.cityName}}-{{orderInfo.orderDeliveryAddressResp.regionName}}</span>
      </div>
      <div class="row">
        <span>收货地址：{{orderInfo.orderDeliveryAddressResp.address}}</span>
      </div>
    </line-card>
    <line-card title="买家信息" v-if="orderInfo.memberResp">
      <div class="row">
        <span>会员名称：{{orderInfo.memberResp.name}}</span>
        <span>会员昵称：{{orderInfo.memberResp.nickname}}</span>
        <span>会员账户：{{orderInfo.memberResp.phoneNumber}}</span>
      </div>
      <div class="row">
        <span>会员等级：{{orderInfo.memberResp.memberTypeId!==undefined?memberTransferList[orderInfo.memberResp.memberTypeId].label:'普通会员'}}</span>
        <!-- <span>会员身份证：</span> -->
        <span>联系电话：{{orderInfo.memberResp.phoneNumber}}</span>
      </div>
    </line-card>
    <line-card title="店铺信息" v-if="orderInfo.shopInfoResp">
      <div class="row">
        <span>所属店铺：{{orderInfo.shopInfoResp.shopName}}</span>
        <span>联系人：{{orderInfo.shopInfoResp.contact}}</span>
        <span>联系电话：{{orderInfo.shopInfoResp.contactTel}}</span>
      </div>
    </line-card>
  </div>
</template>

<script>
import LineCard from '@/views/common/lineCard'
import dictObj from '@/store/dictData'

export default {
  props: {
    orderInfo: {
      type: Object,
      default() {
        return {
          orderNewResp: {},
          orderInvoiceDto: {},
          orderDeliveryAddressResp: {},
          memberResp: {},
          shopInfoResp: {}
        }
      }
    }
  },
  data() {
    return {
      // 订单类型
      shopTypeList: dictObj.shopTypeList,
      orderSourceWayList: [{
        label: '线上订单',
        value: 1
      }, {
        label: '线下订单',
        value: 2
      }],
      lobList: dictObj.lobList,
      payStatusList: // 支付状态
      [{
        label: '未支付',
        value: 0
      }, {
        label: '已支付',
        value: 1
      }],
      orderSettleStatusList: dictObj.orderSettleStatusList,
      orderStatusList: dictObj.orderStatusList,
      invoiceTypeList: dictObj.invoiceTypeList,
      memberTransferList: dictObj.customLevelList,
      payTypeList: dictObj.payTypeList
    }
  },
  components: {
    LineCard
  },
  methods: {
    /**
     * 获取枚举值
     */
    setEnumValue(value, curArr) {
      if (Array.isArray(value)) { // value 为数组
        let arr = []
        value.forEach((item) => {
          let curVal = curArr.find(res => item === res.value)
          curVal && arr.push(curVal.label)
        })
        return arr.join(',')
      } else {
        let curVal = curArr.find(res => value === res.value)
        return curVal ? curVal.label : (value || '')
      }
    }
  }
}
</script>
