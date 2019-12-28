<template>
  <c-table
    ref="cTable"
    hasBorder
    :max-height="300"
    :size="size"
    :loading="isLoading"
    :table-header="tableHeader"
    :table-list="tableList"
    :page-info="pageInfo"
    @change-pagination="changePagination"
  ></c-table>
</template>

<script>
import mixinTable from 'mixins/table'

export default {
  mixins: [mixinTable],
  props: {
    settleId: {
      type: String,
      required: true
    },
    changeTime: Number
  },
  watch: {
    changeTime(val) {
      console.log(val)
      if (val) {
        this.pageInfo.pageNo = 1
        this.fetchData()
      }
    }
  },
  created() {
    this.settleId && this.fetchData()
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
          prop: 'opCreator'
        },
        {
          label: '付款金额',
          prop: 'payAmount'
        },
        {
          label: '手续费',
          prop: 'serviceFee'
        },
        {
          label: '打款流水号',
          prop: 'paySerialNumber'
        },
        {
          label: '备注',
          prop: 'remark'
        }
      ]
    }
  },
  methods: {
    /**
     * 获取支付记录
     */
    fetchData(id) {
      const { totalNum, ...page } = this.pageInfo
      this.isLoading = true
      this.$api.finance.queryBusinessSettlePaymentLogPage({
        businessSettleId: this.settleId,
        ...page
      }).then(res => {
        this.isLoading = false
        if (res && res.totalCount) {
          const { data, totalCount } = res
          this.pageInfo.totalNum = totalCount
          this.tableList = data || []
        } else {
          this.tableList = res || []
        }
      })
    }
  }
}
</script>
