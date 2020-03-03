<template>
  <c-view>
    <template v-slot:header>
      <div class="title">{{$route.meta.name || $t(`route.${$route.meta.title}`)}}</div>
    </template>
    <div class="main__box">
      <c-table
        ref="cTable"
        selection
        hasBorder
        :max-height="maxHeight"
        :size="size"
        :loading="isLoading"
        :table-header="tableHeader"
        :table-list="tableList"
        :page-info="pageInfo"
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
    </div>
  </c-view>
</template>

<script>
import mixinTable from 'mixins/table'

export default {
  name: 'orderManageStargo',
  mixins: [mixinTable],
  data(vm) {
    return {
      // 表格内操作按钮
      tableHeader: [
        {
          label: '支付单号',
          prop: 'flowCode',
          search: {
            type: 'input'
          }
        },
        {
          label: '手机号',
          prop: 'buyerMobile',
          search: {
            type: 'input'
          }
        },
        {
          label: '星购卡金额(元)',
          prop: 'denominationAmount'
        },
        {
          label: '赠送金额(元)',
          prop: 'giveAmount'
        },
        {
          label: '赠送有效期(天)',
          prop: 'validDays'
        },
        {
          label: '是否赠送VIP',
          prop: 'giveVip',
          formatter(row) {
            return row && row.giveVip === 1 ? '是' : '否'
          }
        },
        {
          label: '购卡时间',
          prop: 'created',
          search: {
            prop: 'dateTime',
            type: 'dateTime'
          }
        }
      ]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    /*
	   * 查询表格列表数据
	   */
    fetchData() {
      const { totalNum, ...page } = this.pageInfo
      const { dateTime, ...other } = this.searchObj
      const searchDate = this.getSearchDate(dateTime, '', 'beginTime', 'endTime')
      this.isLoading = true
      this.$api.order.queryStargoList({
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
