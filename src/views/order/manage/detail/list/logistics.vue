<template>
  <line-card title="物流信息">
    <c-table
      ref="cTable"
      hasBorder
      noPage
      :max-height="300"
      :size="size"
      :auto-scroll="false"
      :loading="isLoading"
      :table-inner-btns="tableInnerBtns"
      :table-header="tableHeader"
      :table-list="deliveryList"
    ></c-table>
  </line-card>
</template>

<script>
import mixinTable from 'mixins/table'
import LineCard from '@/views/common/lineCard'

export default {
  mixins: [mixinTable],
  props: {
    deliveryList: Array
  },
  components: {
    LineCard
  },
  data(vm) {
    return {
      tableInnerBtns: [{
        name: '物流跟踪',
        icon: 'el-icon-review',
        handle(row) {
          const { id } = vm.$route.params
          vm.routerLink(`/order/manage/send/detail/${id}`)
        }
      }],
      tableHeader: [
        {
          label: '物流公司',
          prop: 'deliveryName'
        },
        {
          label: '物流单号',
          prop: 'deliveryNo'
        },
        {
          label: '发货时间',
          prop: 'created'
        },
        {
          label: '发货数量',
          prop: 'quantity'
        },
        {
          label: '物流费用(元)',
          prop: 'freightAmount'
        }
      ]
    }
  }
}
</script>
