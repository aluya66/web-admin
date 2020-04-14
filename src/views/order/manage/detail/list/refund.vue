<template>
  <line-card title="退款单">
    <c-table
      ref="cTable"
      hasBorder
      noPage
      :max-height="300"
      :size="size"
      :auto-scroll="false"
      :loading="isLoading"
      :table-header="tableHeader"
      :table-list="refundList"
    ></c-table>
  </line-card>
</template>

<script>
import mixinTable from 'mixins/table'
import LineCard from '@/views/common/lineCard'

const statusList = [{
  value: 1,
  label: '未退款'
}, {
  value: 2,
  label: '已退款'
}, {
  value: 3,
  label: '退款失败'
}]

export default {
  mixins: [mixinTable],
  props: {
    refundList: Array
  },
  components: {
    LineCard
  },
  data(vm) {
    return {
      tableHeader: [
        {
          label: '退款单号',
          prop: 'flowCode'
        },
        {
          label: '退款方式',
          prop: 'payType',
          formatter(row) {
            return row && vm.setTableColumnLabel(row.payType.split(','), 'payTypeList')
          }
        },
        {
          label: '第三方流水号',
          prop: ''
        },
        {
          label: '退款金额(元)',
          prop: 'refundAmount'
        },
        {
          label: '退款状态',
          prop: 'status',
          formatter(row) {
            return row && vm.setTableColumnLabel(row.status, statusList)
          }
        },
        {
          label: '申请时间',
          prop: 'created'
        }
      ]
    }
  }
}
</script>
