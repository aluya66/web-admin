<template>
  <line-card title="售后信息">
    <c-table
      ref="cTable"
      hasBorder
      noPage
      :max-height="200"
      size="small"
      :loading="false"
      :table-header="tableHeader"
      :table-inner-btns="tableInnerBtns"
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
      tableInnerBtns: [{
        name: '详情',
        icon: 'el-icon-review',
        handle(row) {
          this.$emit('show-dialog', row)
        }
      }],
      tableHeader: [
        {
          label: '售后单号',
          prop: ''
        },
        {
          label: '售后状态',
          prop: ''
        },
        {
          label: '售后类型',
          prop: ''
        },
        {
          label: '发起说明',
          prop: ''
        },
        {
          label: '审核人',
          prop: ''
        },
        {
          label: '审核说明',
          prop: ''
        },
        {
          label: '售后发起人',
          prop: ''
        },
        {
          label: '发起时间',
          prop: ''
        },
        {
          label: '修改时间',
          prop: ''
        },
        {
          label: '操作',
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
