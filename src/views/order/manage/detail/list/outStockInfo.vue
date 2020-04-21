<template>
  <line-card title="出库信息">
    <c-table
      ref="cTable"
      hasBorder
      noPage
      :max-height="300"
      size="small"
      :loading="false"
      :table-header="tableHeader"
      :table-list="stockInfoList"
    ></c-table>
  </line-card>
</template>

<script>
import mixinTable from 'mixins/table'
import LineCard from '@/views/common/lineCard'

export default {
  mixins: [mixinTable],
  props: {
    stockInfoList: Array
  },
  components: {
    LineCard
  },
  data(vm) {
    return {
      tableHeader: [
        {
          label: '出库单号',
          prop: 'flowCode'
        },
        {
          label: '出库类型',
          prop: 'flowTypeName'
        },
        {
          label: '经办人',
          prop: 'changeUserName'
        },
        {
          label: '备注',
          prop: 'remark'
        },
        {
          label: '出库时间',
          prop: 'changeTime'
        }
      ]
    }
  }
}
</script>
