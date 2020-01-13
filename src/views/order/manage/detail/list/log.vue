<template>
  <line-card title="操作日志">
    <c-table
      ref="cTable"
      hasBorder
      noPage
      :max-height="300"
      size="small"
      :loading="false"
      :table-header="tableHeader"
      :table-list="logList"
    ></c-table>
  </line-card>
</template>

<script>
import mixinTable from 'mixins/table'
import LineCard from '@/views/common/lineCard'

const operationTypeList = [{
  value: 1,
  label: '订单日志'
}, {
  value: 2,
  label: '退换货日志'
}, {
  value: 3,
  label: '订单操作备注'
}, {
  value: 4,
  label: '退换货操作备注'
}]

export default {
  mixins: [mixinTable],
  props: {
    logList: Array
  },
  components: {
    LineCard
  },
  data(vm) {
    return {
      tableHeader: [
        {
          label: '操作时间',
          prop: 'created'
        },
        {
          label: '操作人',
          prop: 'operatorName'
        },
        {
          label: '操作类型',
          prop: 'operationType',
          formatter(row) {
            return row && vm.setTableColumnLabel(row.operationType, operationTypeList)
          }
        },
        {
          label: '操作内容',
          prop: 'operationName'
        },
        {
          label: '操作日志',
          prop: 'content'
        }
      ]
    }
  }
}
</script>
