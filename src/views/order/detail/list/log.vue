<template>
  <line-card title="操作日志">
    <c-table
      ref="cTable"
      hasBorder
      noPage
      :max-height="200"
      size="small"
      :loading="false"
      :table-header="tableHeader"
      :table-list="tableList"
    ></c-table>
  </line-card>
</template>

<script>
import mixinTable from 'mixins/table'
import LineCard from '@/views/common/lineCard'

export default {
  mixins: [mixinTable],
  props: {
    orderId: {
      type: String
      // required: true
    }
  },
  components: {
    LineCard
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
          label: '操作类型',
          prop: ''
        },
        {
          label: '描述',
          prop: ''
        }
      ]
    }
  },
  created() {
    this.orderId && this.fetchData()
  },
  methods: {
    /**
     * 获取日志记录
     */
    fetchData() {
      this.isLoading = true

      // this.$api.finance.querySettleOperateLog({
      //   businessSettleId: this.settleId,
      //   pageNo: 1,
      //   pageSize: 100
      // }).then(res => {
      //   this.isLoading = false
      //   if (res && res.data) {
      //     this.tableList = res.data || []
      //   } else {
      //     this.tableList = res || []
      //   }
      // })
    }
  }
}
</script>
