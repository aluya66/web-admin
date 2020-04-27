<template>
  <div>
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
        <span>售后类型：{{formModel.afterSalesTypeName}}</span>
      </div>
      <div class="row">
        <span>退款方式：{{formModel.returnType===1?'原路退回':formModel.returnType===2?'余额退回':formModel.returnType}}</span>
        <span v-if="formModel.afterRefundLogs">扣费项目：{{formModel.afterRefundLogs}}</span>
      </div>
      <div class="row">
        <span>应退金额：{{formModel.totalActualRefundAmount}}</span>
        <span>实退金额：{{formModel.realRefundAmount}}</span>
        <span v-if="formModel.afterRefundLogs">扣款金额：{{(formModel.totalActualRefundAmount-formModel.realRefundAmount).toFixed(2)}}</span>
      </div>
      <div class="row">
        <span>客服审核说明：{{formModel.approveRemark}}</span>
        <span>仓库拒收说明：{{formModel.confirmRemark}}</span>
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
          :table-list="formModel.detailList"
        ></c-table>
      </div>
      <div class="row">
        <span>物流公司：{{formModel.deliveryList.length ? formModel.deliveryList[0].deliveryName : ''}}</span>
        <span>物流单号：{{formModel.deliveryList.length ? formModel.deliveryList[0].deliveryNo : ''}}</span>
      </div>
      <!-- <div class="row">
        <span>发货备注：{{formModel.deliveryList.length && formModel.deliveryList.detailList && formModel.deliveryList.detailList.length ? formModel.deliveryList[0].detailList.remark : ''}}</span>
      </div> -->
      <div class="row">
        <span>操作物流发货时间：{{formModel.deliveryList.length ? formModel.deliveryList[0].created : ''}}</span>
      </div>
    </div>
        <!--售后信息-->
      <div class="detail">
        <el-divider content-position="left">申请售后的信息</el-divider>
        <div class="row">
          <span>售后类型：{{formModel.afterSalesTypeName}}</span>
          <span>货物状态：{{formModel.orderShipStatusName}}</span>
        </div>
        <div class="row">
          <span>选择的问题：{{formModel.reasonName}}</span>
          <span>售后说明：{{formModel.remark}}</span>
        </div>
        <div class="row">
          <span>凭证图片：
            <c-image
              v-for="(item,index) in formModel.attachmentList"
              :key="index"
              class="coverImg"
              :url="item.attachmentPath"
              fit="contain"
              :preview-src-list="[item.attachmentPath]"
            ></c-image>
            </span>
        </div>
      </div>
  </div>
</template>

<script>
import mixinTable from 'mixins/table'
import CImage from 'components/image'

export default {
  mixins: [mixinTable],
  components: {
    CImage
  },
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
        // {
        //   label: '购买数量',
        //   prop: 'salesSkuQty'
        // },
        {
          label: '退货数量',
          prop: 'skuQty'
        },
        {
          label: '商品总价',
          formatter(row) {
            return (row.salePrice * row.skuQty).toFixed(2)
          }
        },
        // {
        //   label: '应退金额',
        //   prop: 'refundAmount'
        // },
        // {
        //   label: '实退金额',
        //   prop: 'realRefundAmount',
        // },
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
  },
  created() {
    this.handleData()
  },
  methods: {
    handleData() {
      const { afterRefundLogs } = this.initData
      if (afterRefundLogs && afterRefundLogs.length) {
        let refunds = afterRefundLogs.map((elem) => { // 组装扣费项目
          return elem.typeName
        }) || []
        this.formModel.afterRefundLogs = refunds.join('、')
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
