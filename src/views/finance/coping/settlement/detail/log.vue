<template>
  <c-table
    ref="cTable"
    hasBorder
    :max-height="200"
    size="small"
    :loading="false"
    :table-header="tableHeader"
    :table-list="logList"
  >
  </c-table>
</template>

<script>
import mixinTable from 'mixins/table'

export default {
  mixins: [mixinTable],
  props: {
    logList: {
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
          prop: 'created'
        },
        {
          label: '操作人',
          prop: 'opCreator'
        },
        {
          label: '内容',
          prop: 'content'
        }
      ]
    }
  }
}
</script>
