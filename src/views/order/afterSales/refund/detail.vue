<template>
  <div>
    <el-row>
      <el-col :span="6" v-for="(item,index) in detailItems" :key="index" class="col-item">
        <span class="label">{{item.label}}：</span>
        {{formModel[item.value]}}
      </el-col>
    </el-row>
    <p class="label">退款记录：</p>
    <c-table
      ref="cTable"
      hasBorder
      noPage
      :size="size"
      :loading="isLoading"
      :table-header="tableHeader"
      :table-list="feeRecord"
    />
  </div>
</template>

<script>
import mixinTable from 'mixins/table'

const refundAllType = {
  1: '余额',
  2: '星GO卡',
  3: '代金券'
}
export default {
  mixins: [mixinTable],
  components: {},
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
      feeRecord: [], // 打款记录
      // 表格内操作按钮
      tableHeader: [
        {
          label: '扣费项目',
          prop: 'typeName'
        },
        {
          label: '扣费金额',
          prop: 'money'
        },
        {
          label: '物流公司',
          prop: 'deliveryName'
        },
        {
          label: '物流单号',
          prop: 'deliveryNo'
        },
        {
          label: '备注',
          prop: 'remark'
        }
      ],
      detailItems: [
        { label: '单号', value: 'refundOrder' },
        { label: '退款单号', value: 'afterOrder' },
        { label: '状态', value: 'status' },
        { label: '客户名称', value: 'userName' },
        { label: '客户电话', value: 'userPhone' },
        { label: '应退金额', value: 'refundFee' },
        { label: '实际退款金额', value: 'actualRefundFee' },
        { label: '退款类型', value: 'refundType' },
        { label: '售后时间', value: 'afterTime' }
      ],
      formModel: {}
    }
  },
  created() {
    const { status, refundType, ...other } = this.initData
    this.formModel = {
      ...other,
      status: status === 0 ? '未退款' : '已退款',
      refundType: refundAllType[refundType]
    }
    // 获取打款记录
    this.$api.order
      .getRefundFeeRecord({ refundOrder: this.formModel.refundOrder })
      .then(res => {
        this.isLoading = false
        if (res && res.data && res.totalCount) {
          this.feeRecord = res.data
        }
      })
  }
}
</script>

<style lang="less" scoped>
.col-item {
  margin-bottom: 0.1rem;
}
.label {
  font-weight: bold;
}
</style>
