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
      if (val) {
        this.selectedCouponList = val.map((item) => {
          let info = ''
          const rules = item.marketPreferentialRules
          if (rules && rules[0] && rules[0].preferentialType) {
            // 5现金券、1折扣券
            switch (rules[0].preferentialType) {
              case 5:
                info = `${rules[0].preferentialLevel}元减${rules[0].preferentialValue}元`
                break
              case 1:
                info = `${rules[0].preferentialLevel}件享${rules[0].preferentialValue}折`
            }
          }
          return {
            ...item,
            info
          }
        })
      }
    },
    fetchData() {
      this.isLoading = true
      this.$api.marketing.getCoupon({
        ...this.searchObj,
        pageNo: 1,
        pageSize: 100,
        status: 5 // 进行中的优惠券
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
