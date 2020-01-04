<template>
  <line-card title="物流信息">
    <c-table
      ref="cTable"
      hasBorder
      :max-height="300"
      :size="size"
      :auto-scroll="false"
      :loading="isLoading"
      :table-header="tableHeader"
      :table-list="tableList"
      :table-inner-btns="tableInnerBtns"
      :page-info="pageInfo"
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
    // changeTime: Number
  },
  components: {
    LineCard
  },
  // watch: {
  //   changeTime(val) {
  //     console.log(val)
  //     if (val) {
  //       this.pageInfo.pageNo = 1
  //       this.fetchData()
  //     }
  //   }
  // },
  created() {
    this.orderId && this.fetchData()
  },
  data(vm) {
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
          label: '物流公司',
          prop: ''
        },
        {
          label: '物流单号',
          prop: ''
        },
        {
          label: '发货时间',
          prop: ''
        },
        {
          label: '发货数量',
          prop: ''
        },
        {
          label: '物流费用(元)',
          prop: ''
        }
      ]
    }
  },
  methods: {
    /**
     * 获取支付记录
     */
    fetchData(id) {
      // const { totalNum, ...page } = this.pageInfo
      this.isLoading = true
      // this.$api.finance.queryBusinessSettlePaymentLogPage({
      //   businessSettleId: this.settleId,
      //   ...page
      // }).then(res => {
      //   this.isLoading = false
      //   if (res && res.totalCount) {
      //     const { data, totalCount } = res
      //     this.pageInfo.totalNum = totalCount
      //     this.tableList = data || []
      //   } else {
      //     this.tableList = res || []
      //   }
      // })
    }
  }
}
</script>
