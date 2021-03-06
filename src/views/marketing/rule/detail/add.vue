<template>
  <c-table
    ref="cTable"
    selection
    hasBorder
    :size="size"
    :max-height="300"
    :loading="isLoading"
    :table-header="tableHeader"
    :page-info="pageInfo"
    @selection-handle="handleSelection"
    :table-list="tableList"
    @change-pagination="changePagination"
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
  props: {
    platformList: {
      type: String,
      default: ''
    },
    initChecked: {
      // 初始化选中值
      type: Array,
      default() {
        return []
      }
    }
  },
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
    this.selectedCouponList = this.initChecked
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
      const { totalNum, ...page } = this.pageInfo
      this.$api.marketing.getCoupon({
        ...this.searchObj,
        ...page,
        platformList: [this.platformList],
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
        this.selectedCouponList.length && this.selectedCouponList.forEach((checkedItem) => {
          const idx = this.tableList.findIndex((item) => checkedItem.couponRuleId === item.couponRuleId)
          if (idx !== -1) {
            this.$nextTick(() => {
              this.$refs.cTable.$refs.multipleTable.toggleRowSelection(this.tableList[idx])
            })
          }
        })
      })
    }
  }
}
</script>
