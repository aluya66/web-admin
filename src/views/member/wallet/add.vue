<template>
  <c-table
    selection
    hasBorder
    :size="size"
    :loading="isLoading"
    :table-header="tableHeader"
    :table-list="tableList"
    :page-info="pageInfo"
    :table-inner-btns="tableInnerBtns"
    @change-pagination="changePagination"
  ></c-table>
</template>

<script>
import mixinTable from 'mixins/table'
import utils from 'utils'

export default {
  mixins: [mixinTable],
  props: {
    walletId: Number,
    required: true
  },
  data(vm) {
    return {
      pickerOptions: utils.pickerOptions,
      tableList: [],
      searchObj: {
        amountType: '', // 类型
        amountTypeName: '', // 类型名称
        dataTime: ''
      },
      tableInnerBtns: [],
      tableHeader: [
        {
          label: '类型名称',
          prop: 'amountTypeName'
        },
        {
          label: '金额(元)',
          prop: 'amount'
        },
        {
          label: '赠送金额(元)',
          prop: 'giftAmount'
        },
        {
          label: '创建时间',
          prop: 'created'
        }
      ]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      const { dataTime, ...other } = this.searchObj
      const { totalNum, ...page } = this.pageInfo
      const searchDate = this.getSearchDate(dataTime, 'dateTime')
      this.isLoading = true
      this.$api.member.getWalletList({
        userId: this.walletId,
        ...searchDate,
        ...other,
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
