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
            const { userCouponId, coupon } = row
            vm.confirmTip(`确认核销  ${coupon.couponName ? coupon.couponName : ''}  劵信息, 操作不可撤回!`, () => {
              vm.verifyData({ userCouponId })
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
            return row.couponStoreNo
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
            const marketPreferentialRules = row.couponRule.marketPreferentialRules && row.couponRule.marketPreferentialRules[0] ? row.couponRule.marketPreferentialRules[0] : {}
            const { preferentialLevel, preferentialValue, preferentialType } = marketPreferentialRules
            switch (preferentialType) {
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
          prop: 'couponAmount'
        },
        {
          label: '状态',
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
          label: '使用时间',
          prop: 'useTime',
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
      const useTimeObj = this.getSearchDate(useTime, 'dateTime', 'useCouponTimeStart', 'useCouponTimeEnd')
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