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
const statusList = [{ // 1 在线购卡 2 活动购卡 3 兑换码绑卡 4 系统发卡 5 在线购劵 6 活动购劵 7 兑换码绑劵 8 系统发劵 9 活动领劵
  label: '在线购卡',
  value: 1
}, {
  label: '活动购卡',
  value: 2
}, {
  label: '兑换码绑卡',
  value: 3
}, {
  label: '系统发卡',
  value: 4
}, {
  label: '在线购劵',
  value: 5
}, {
  label: '活动购劵',
  value: 6
}, {
  label: '兑换码绑劵',
  value: 7
}, {
  label: '系统发劵',
  value: 8
}, {
  label: '活动领劵',
  value: 9
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
          prop: 'receiveType',
          formatter(row) {
            return row && vm.setTableColumnLabel(row.receiveType, statusList)
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
          label: '创建时间',
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
      const searchDate = this.getSearchDate(dateTime, 'dateTime', 'createdTimeBegin', 'createdTimeEnd')
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
