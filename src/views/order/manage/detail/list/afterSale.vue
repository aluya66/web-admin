<template>
  <line-card title="售后信息">
    <c-table
      ref="cTable"
      hasBorder
      noPage
      :max-height="300"
      size="small"
      :loading="false"
      :table-header="tableHeader"
      :table-list="afterList"
    ></c-table>
  </line-card>
</template>

<script>
import mixinTable from 'mixins/table'
import LineCard from '@/views/common/lineCard'
import dictObj from '@/store/dictData'

const afterSalesTypeList = [{
  value: 1,
  label: '只退款'
}, {
  value: 2,
  label: '退款退货'
}, {
  value: 3,
  label: '代金券退货'
}]

export default {
  mixins: [mixinTable],
  props: {
    afterList: Array
  },
  components: {
    LineCard
  },
  data(vm) {
    return {
      // tableInnerBtns: [{
      //   name: '详情',
      //   icon: 'el-icon-review',
      //   handle(row) {
      //     this.$emit('show-dialog', row)
      //   }
      // }],
      tableHeader: [
        {
          label: '售后单号',
          prop: 'afterSalesCode'
        },
        {
          label: '售后状态',
          prop: 'status',
          formatter(row) {
            return row && vm.setTableColumnLabel(row.status, dictObj.afterSalesStatus)
          }
        },
        {
          label: '售后类型',
          prop: 'afterSalesType',
          formatter(row) {
            return row && vm.setTableColumnLabel(row.afterSalesType, afterSalesTypeList)
          }
        },
        {
          label: '发起说明',
          prop: 'reasonDesc'
        },
        {
          label: '审核人',
          prop: 'updateName'
        },
        {
          label: '审核说明',
          prop: 'field_7'
        },
        {
          label: '售后发起人',
          prop: 'createName'
        },
        {
          label: '发起时间',
          prop: 'created'
        },
        {
          label: '修改时间',
          prop: 'updated'
        }
      ]
    }
  }
}
</script>
