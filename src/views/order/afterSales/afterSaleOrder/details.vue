<template>
  <div class="detail">
    <div class="row">
      <span>订单号：{{formModel.thirdOrderCode}}</span>
      <span>售后单号：{{formModel.afterSalesCode}}</span>
    </div>
    <div class="row">
      <span>所属店铺：{{formModel.storeName}}</span>
      <span>售后时间：{{formModel.created}}</span>
    </div>
    <div class="row">
      <span>客户名称：{{formModel.buyerNick}}</span>
      <span>客户电话：{{formModel.buyerMobile}}</span>
    </div>
    <div class="row">
      <span>售后状态：{{formModel.statusName}}</span>
      <span>
        售后类型：
        <span v-if="formModel.dialogType === 1">{{formModel.afterSalesTypeName}}</span>
        <query-dict
          v-else
          showType="select"
          class="select-item"
          :dict-list="afterSalesTypes"
          placeholder="请选择"
          :value.sync="formModel.afterSalesType"
        ></query-dict>
      </span>
    </div>
    <div class="row" v-if="formModel.dialogType === '1'">
      <span>星购卡优惠：{{formModel.totalStoredCardDiscountAmount}}</span>
      <span>星购卡抵扣：{{formModel.totalStoredCardAmount}}</span>
    </div>
    <div class="table-row">
      <el-divider content-position="left">退货商品信息</el-divider>
      <c-table
        ref="cTable"
        hasBorder
        noPage
        :loading="false"
        :max-height="300"
        :size="size"
        :table-header="tableHeader"
        :table-list="formModel.detailList"
      ></c-table>
    </div>
    <div class="row">
      <span>物流公司：{{formModel.deliveryList.length ? formModel.deliveryList[0].deliveryName : ''}}</span>
      <span>物流单号：{{formModel.deliveryList.length ? formModel.deliveryList[0].deliveryNo : ''}}</span>
    </div>
    <div class="row">
      <span>操作物流发货时间：{{formModel.deliveryList.length ? formModel.deliveryList[0].created : ''}}</span>
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
      afterSalesTypes: dictObj.afterSalesTypes,
      tableHeader: [
        {
          label: '商品编码',
          prop: 'skuCode'
        },
        {
          label: '商品图片',
          prop: 'picturePath',
          width: 100,
          isImage: true
        },
        {
          label: '商品名称',
          prop: 'productAtrName'
        },
        {
          label: '商品规格',
          prop: 'specifications'
        },
        {
          label: '商品单价',
          prop: 'salePrice'
        },
        {
          label: '售后数量',
          prop: 'skuQty'
        },
        {
          label: '商品总价',
          formatter(row) {
            return (row.salePrice * row.skuQty).toFixed(2)
          }
        },
        {
          label: '退款金额',
          prop: 'refundAmount'
        },
        {
          label: '备注',
          prop: 'remark'
        }
      ]
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
.detail {
  .row {
    padding: 0 80px;
    display: flex;
    flex-wrap: wrap;
    span {
      display: flex;
      align-items: center;
      margin: 10px 20px 10px 0;
      min-width: 220px;
    }
  }
  .table-row {
    padding: 0 80px 30px 80px;
  }
}
</style>
