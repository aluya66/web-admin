<template>
  <c-table
    ref="cTable"
    hasBorder
    noPage
    :max-height="200"
    size="small"
    :loading="false"
    :table-header="tableHeader"
    :table-list="tableList"
  >
  </c-table>
</template>

<script>
import mixinTable from 'mixins/table'

export default {
  mixins: [mixinTable],
  props: {
    settleId: {
      type: String,
      required: true
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
  },
  created() {
    this.settleId && this.fetchData()
  },
  methods: {
    /**
     * 获取日志记录
     */
    fetchData() {
      this.isLoading = true

      this.$api.finance.querySettleOperateLog({
        businessSettleId: this.settleId,
        pageNo: 1,
        pageSize: 100
      }).then(res => {
        this.isLoading = false
        if (res && res.data) {
          this.tableList = res.data || []
        } else {
          this.tableList = res || []
        }
      })
    }
  }
}
</script>
