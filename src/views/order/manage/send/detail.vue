<template>
  <div class="pay-detail">
    <div class="row">
      <span>发货单号：{{formModel.outboundCode}}</span>
      <span>订单号：{{formModel.orderCode}}</span>
    </div>
    <div class="row">
      <span>用户名：{{formModel.buyerNick}}</span>
      <span>收货人：{{formModel.name}}</span>
    </div>
    <div class="row">
      <span>快递公司：{{formModel.deliveryName}}</span>
      <span>快递单号：{{formModel.deliveryNo}}</span>
    </div>
    <div class="row">
      <span>创建时间：{{formModel.created}}</span>
    </div>
    <div class="row">
      <span>收货地址：{{formModel.provinceName}}-{{formModel.cityName}}-{{formModel.regionName}} {{formModel.address}}</span>
    </div>
    <div class="row">
      <span>明细：</span>
    </div>
    <div class="table-row">
      <c-table
        ref="cTable"
        hasBorder
        noPage
        :loading="false"
        :max-height="300"
        :size="size"
        :table-header="tableHeader"
        :table-list="formModel.orderDetails"
      ></c-table>
    </div>
  </div>
</template>

<script>
import dictObj from '@/store/dictData'
import mixinTable from 'mixins/table'

export default {
  mixins: [mixinTable],
  props: {
    initData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      formModel: {},
      tableHeader: [
        {
          label: '图片',
          prop: 'picturePath',
          width: 100,
          isImage: true
        },
        {
          label: '名称',
          prop: 'productName'
        },
        {
          label: '数量',
          prop: 'quantity'
        }
      ],
      payTypeList: dictObj.payTypeList,
      orderBusinessTypeList: dictObj.orderBusinessTypeList
    }
  },
  created() {
    this.getDeliveryDetail()
  },
  methods: {
    getDeliveryDetail() {
      const { orderCode } = this.initData
      this.$api.order.queryDeliveryDetail({ orderCode }).then(res => {
        this.formModel = res
      })
    }
  }
}
</script>
<style lang="less" scoped>
.pay-detail {
  .row {
    padding: 0 80px;
    display: flex;
    flex-wrap: wrap;
    span {
      display: inline-block;
      margin: 10px 20px 10px 0;
      min-width: 220px;
    }
  }
  .table-row {
    padding: 0 80px 30px 80px;
  }
}
</style>
