<template>
  <c-table
    ref="cTable"
    hasBorder
    :max-height="200"
    :loading="false"
    size="small"
    :table-header="tableHeader"
    :table-list="payLogList"
  >
  </c-table>
</template>

<script>
import mixinTable from 'mixins/table'

export default {
  mixins: [mixinTable],
  props: {
    payLogList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      tableHeader: [
        {
          label: '操作时间',
          prop: ''
        },
        {
          label: '操作人',
          prop: ''
        },
        {
          label: '付款金额',
          prop: ''
        },
        {
          label: '手续费',
          prop: ''
        },
        {
          label: '打款流水号',
          prop: ''
        },
        {
          label: '备注',
          prop: ''
        }
      ]
    }
  }
}
</script>
