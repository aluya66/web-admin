<template>
  <c-table
    ref="cTable"
    selection
    hasBorder
    noPage
    :size="size"
    :max-height="300"
    :loading="isLoading"
    :table-header="tableHeader"
    @selection-handle="handleSelection"
    :table-list="tableList"
  >
    <template v-slot:header>
      <c-search
        :form-model="searchObj"
        :form-items="searchItems"
        @submit-form="searchSubmit"
        @reset-form="searchReset"
      ></c-search>
    </template>
  </c-table>
</template>

<script>
import mixinTable from 'mixins/table'
import dictObj from '@/store/dictData'

export default {
  mixins: [mixinTable],
  data(vm) {
    return {
      selectedCouponList: [],
      tableList: [],
      tableHeader: [
        {
          label: '优惠券名称',
          prop: 'couponRuleName',
          search: {
            type: 'input'
          }
        },
        {
          label: '有效期开始时间',
          prop: 'limitExpireTimeStart'
        },
        {
          label: '有效期结束时间',
          prop: 'limitExpireTimeEnd'
        },
        {
          label: '有效期类型',
          prop: 'limitExpireDayType',
          formatter(row) {
            return row && vm.setTableColumnLabel(row.limitExpireDayType, 'ticketValidTypeArr')
          },
          search: {
            label: '优惠券类型',
            prop: 'type',
            type: 'select',
            optionsList: dictObj.ticketTypeList
          }
        }
      ]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    handleSelection(val) {
      console.log(val)
      if (val)
        this.selectedCouponList = val.map((item) => {
          let info = ''
          if (item.type) {
            switch (item.type) {
              case 0:
                info = `${item.preferentialLevel}元减${item.preferentialValue}元`
                break
              case 1:
                info = `${item.preferentialLevel}件享${item.preferentialValue}元`
            }
          }
          return {
            ...item,
            info
          }
        })
    },
    fetchData() {
      this.isLoading = true
      this.$api.marketing.getCoupon({
        ...this.searchObj,
        pageNo: 1,
        pageSize: 100
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
