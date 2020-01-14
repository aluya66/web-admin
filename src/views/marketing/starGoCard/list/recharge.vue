<template>
  <c-view>
    <template v-slot:header>
      <div class="title">{{ $route.meta.name || $t(`route.${$route.meta.title}`) }}</div>
    </template>
    <div class="main__box">
      <c-table
        selection
        hasBorder
        :max-height="685"
        :size="size"
        :loading="isLoading"
        :table-header="tableHeader"
        :table-list="tableList"
        :page-info="pageInfo"
        :table-inner-btns="tableInnerBtns"
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
// import utils from 'utils'
// import dictObj from '@/store/dictData'
const statusList = [{
  label: '待激活',
  value: 0
}, {
  label: '已激活',
  value: 1
}, {
  label: '使用中',
  value: 2
}, {
  label: '已使用',
  value: 4
}, {
  label: '过期',
  value: 8
}, {
  label: '删除',
  value: 16
}, {
  label: '失效',
  value: 32
}, {
  label: '不在有效期',
  value: 64
}]
export default {
  name: 'starGoCardRechargeList',
  mixins: [mixinTable],
  data(vm) {
    return {
      tableInnerBtns: [],
      tableHeader: [
        {
          label: '支付单号',
          prop: 'payCode',
          width: 100,
          fixed: true,
          search: {
            type: 'input'
          }
        },
        {
          label: '兑换码',
          prop: 'couponStoreNo',
          search: {
            type: 'input'
          }
        },
        {
          label: '用户',
          prop: 'name'
        },
        {
          label: '手机号',
          prop: 'phoneNumber',
          search: {
            prop: 'mobile',
            type: 'input'
          }
        },
        {
          label: '金额',
          prop: 'couponAmount'
        },
        {
          label: '赠送金额',
          prop: 'activityAmount'
        },
        {
          label: '类型',
          prop: 'status',
          formatter(row) {
            return row && vm.setTableColumnLabel(row.status, statusList)
          },
          search: {
            type: 'select',
            optionsList: statusList
          }
        },
        {
          label: '开卡店员',
          prop: 'rltUserName',
          search: {
            type: 'input'
          }
        },
        {
          label: '时间',
          prop: 'created',
          search: {
            type: 'dateTime',
            prop: 'dateTime'
          }
        }
      ]
    }
  },
  created() {
    this.fetchData()
    this.isCreated = !this.isCreated
  },
  activated() {
    this.isCreated && this.fetchData()
  },
  methods: {
    fetchData() {
      const { dateTime, ...other } = this.searchObj
      const { totalNum, ...page } = this.pageInfo
      const searchDate = this.getSearchDate(dateTime, 'dateTime', 'createdBegin', 'createdEnd')
      this.isLoading = true
      this.$api.marketing
        .starGoCardRechargeList({
          ...searchDate,
          ...page,
          ...other
        })
        .then(res => {
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
