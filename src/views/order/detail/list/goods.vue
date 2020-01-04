<template>
  <line-card title="商品及业绩信息">
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
      @change-pagination="changePagination"
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
          label: 'spu款号',
          fixed: true,
          prop: ''
        },
        {
          label: 'sku款号',
          prop: ''
        },
        {
          label: '商品图片',
          prop: ''
        },
        {
          label: '商品名称',
          prop: ''
        },
        {
          label: '商品规格',
          prop: ''
        },
        {
          label: '购物方式',
          prop: ''
        },
        {
          label: '商品金额(元)',
          prop: ''
        },
        {
          label: '数量',
          prop: ''
        },
        {
          label: '商品总金额(元)',
          prop: ''
        },
        {
          label: '商品优惠金额(元)',
          prop: ''
        },
        {
          label: '商品实付金额(元)',
          prop: ''
        },
        {
          label: '邀请码',
          prop: ''
        },
        {
          label: '商品来源',
          prop: ''
        },
        {
          label: '分享者',
          prop: ''
        },
        {
          label: '分享者手机号',
          prop: ''
        },
        {
          label: '业绩归属角色',
          prop: ''
        },
        {
          label: '业绩归属者',
          prop: ''
        },
        {
          label: '业绩归属手机号',
          prop: ''
        },
        {
          label: '可售后数量',
          prop: ''
        },
        {
          label: '可发货数量',
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
