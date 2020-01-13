<template>
  <div class="pay-detail">
    <div class="row">
      <span>支付单号：{{formModel.flowCode}}</span>
      <span>用户手机号：{{formModel.buyerMobile}}</span>
    </div>
    <div class="row">
      <span>支付方式：{{setTableColumnLabel(formModel.payType, 'payStatusList')}}</span>
      <span>支付金额(元)：{{formModel.payAmount}}</span>
    </div>
    <div class="row">
      <span>订单类型：{{setTableColumnLabel(formModel.orderBusinessType, 'orderBusinessTypeList')}}</span>
      <span>支付状态：{{formModel.status === 1 ? '已支付' : '未支付'}}</span>
    </div>
    <div class="row">
      <span>创建时间：{{formModel.created}}</span>
      <span>更新时间：{{formModel.updated}}</span>
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
        :table-list="formModel.orderPays"
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
      tableHeader: [{
        label: '单号',
        prop: 'orderCode'
      }, {
        label: '金额(元)',
        prop: 'payAmount'
      }],
      payTypeList: dictObj.payTypeList,
      orderBusinessTypeList: dictObj.orderBusinessTypeList
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
