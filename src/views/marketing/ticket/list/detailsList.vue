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
import dictObj from '@/store/dictData'
const statusList = [{
  label: '未激活',
  value: 0
}, {
  label: '已激活',
  value: 1
}, {
  label: '使用中',
  value: 2
}, {
  label: '已使用',
  value: 3
}, {
  label: '过期',
  value: 4
}, {
  label: '删除',
  value: 5
}, {
  label: '失效',
  value: 6
}, {
  label: '使用完成',
  value: 7
}, {
  label: '过期',
  value: 8
}]
export default {
  name: 'ticketDetailsList',
  mixins: [mixinTable],
  data(vm) {
    return {
      tableInnerBtns: [
        {
          // 0草稿 1审核中 2审核不通过 3审核通过 4未发布 5进行中 6未开始 7已下架 8已结束(失效)
          prop: {
            name: 'status',
            toggle: [{
              title: '核销',
              icon: 'el-icon-publish',
              value: [0, 1, 2, 3, 4, 5, 6, 7, 8]
            }]
          },
          handle(row) {
            const { couponRuleId, coupon } = row
            vm.confirmTip(`确认核销  ${coupon.couponName ? coupon.couponName : ''}  劵信息, 操作不可撤回!`, () => {
              vm.verifyData({ couponRuleId })
            })
          }
        }
      ],
      tableHeader: [
        {
          label: '领券时间',
          prop: 'created',
          width: 100,
          fixed: true,
          search: {
            type: 'dateTime',
            prop: 'createTime'
          }
        },
        {
          label: '领取人',
          prop: 'name',
          search: {
            type: 'input'
          }
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
          label: '券号',
          formatter(row) {
            return row.coupon.couponStoreNo
          },
          search: {
            prop: 'couponStoreNo',
            type: 'input'
          }
        },
        {
          label: '券名',
          formatter(row) {
            return row.coupon.couponName
          }
        },
        {
          label: '券内容',
          formatter(row) { // 卡券类型 5现金券 1折扣券 3兑换券
            const marketPreferentialRules = row.coupon.marketPreferentialRules && row.marketPreferentialRules[0] ? row.marketPreferentialRules[0] : {}
            const { preferentialLevel, preferentialValue } = marketPreferentialRules
            switch (row.preferentialType) {
              case 1:
                return `满${preferentialLevel || ''}件享${preferentialValue || ''}折`
              case 3:
                return ''
              case 5:
                return `满${preferentialLevel || ''}元减${preferentialValue || ''}元`
            }
          }
        },
        {
          label: '券金额',
          formatter(row) {
            return row.coupon.couponAmount
          }
        },
        {
          label: '状态',
          prop: 'status',
          formatter(row) {
            return row.status ? statusList[row.status - 1].label : ''
          },
          search: {
            type: 'select',
            optionsList: statusList
          }
        },
        {
          label: '使用时间',
          formatter(row) {
            return row.useTimeStart ? row.useTimeStart : '' + '~' + row.useTimeEnd ? row.useTimeEnd : ''
          },
          search: {
            type: 'dateTime',
            prop: 'useTime'
          }
        },
        {
          label: '订单金额',
          prop: 'activityAmount'
        },
        {
          label: '订单号',
          prop: 'orderCode'
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
    /**
     * 获取表格数据
     */
    fetchData() {
      const { useTime, ...other } = this.searchObj
      const { totalNum, ...page } = this.pageInfo
      const useTimeObj = this.getSearchDate(useTime, 'dateTime', 'useTimeStart', 'useTimeEnd')
      this.isLoading = true
      this.$api.marketing
        .getTicketDetailsList({
          ...useTimeObj,
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
    },
    // 核销劵
    verifyData(obj) {
      this.$api.marketing.writeOffTicket(obj).then(() => {
        this.$msgTip('操作成功')
        this.fetchData()
      })
    }
  }
}
</script>
