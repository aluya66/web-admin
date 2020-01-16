<template>
  <line-card title="支付单">
    <c-table
      ref="cTable"
      hasBorder
      noPage
      :max-height="300"
      :size="size"
      :auto-scroll="false"
      :loading="isLoading"
      :table-header="tableHeader"
      :table-list="payList"
    ></c-table>
  </line-card>
</template>

<script>
import mixinTable from 'mixins/table'
import LineCard from '@/views/common/lineCard'

const statusList = [{
  value: 0,
  label: '未支付'
}, {
  value: 1,
  label: '已支付'
}]

export default {
  mixins: [mixinTable],
  props: {
    payList: Array
  },
  components: {
    LineCard
  },
  data(vm) {
    return {
      tableHeader: [
        {
          label: '支付单号',
          prop: 'flowCode'
        },
        {
          label: '支付方式',
          prop: 'payType'
        },
        {
          label: '第三方流水号',
          prop: 'thirdPartyPaycode'
        },
        {
          label: '支付金额(元)',
          prop: 'payAmount'
        },
        {
          label: '支付状态',
          prop: 'status',
          formatter(row) {
            return row && vm.setTableColumnLabel(row.status, statusList)
          }
        },
        {
          label: '支付时间',
          prop: 'created'
        }
      ]
    }
  }
}
</script>
