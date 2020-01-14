<template>
  <c-view>
    <template v-slot:header>
      <div class="title">{{$route.meta.name || $t(`route.${$route.meta.title}`)}}</div>
    </template>
    <div class="main__box">
      <div class="over-view">
        <div>
          <span>{{totalSellPrice}}</span>
          <span>订单总数</span>
        </div>
        <div>
          <span>{{totalEarnings}}</span>
          <span>订单实付金额(元)</span>
        </div>
      </div>
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
// 支付状态
const payStatusList = [{
  label: '未支付',
  value: 0
}, {
  label: '已支付',
  value: 2
}]
const orderSourceWayList = [
  {
    label: '线上订单（用户自开）',
    value: 1
  },
  {
    label: '线下订单（店员代开）',
    value: 2
  }
]
export default {
  name: 'orderManageVip',
  mixins: [mixinTable],
  data(vm) {
    return {
      totalSellPrice: 0, // 总销售金额
      totalEarnings: 0, // 结算总收益
      exportLoading: false,
      tableInnerBtns: [],
      // 表格内操作按钮
      tableHeader: [
        {
          label: '订单号',
          prop: 'orderCode',
          search: {
            type: 'input'
          }
        },
        {
          label: '下单时间',
          prop: 'beginTime',
          search: {
            type: 'dateTime',
            prop: 'dateTime'
          }
        },
        {
          label: '客户手机号',
          prop: 'buyerMobile',
          search: {
            type: 'input'
          }
        },
        {
          label: '支付状态',
          prop: 'payStatus',
          formatter(row) {
            return row&&vm.setTableColumnLabel(row.payStatus, payStatusList)
          },
          search: {
            type: 'dict',
            optionsList: payStatusList
          }
        },
        {
          label: '支付单号',
          prop: 'flowCode',
          search: {
            type: 'input'
          }
        },
        {
          label: '第三方支付流水号',
          prop: 'thirdPartyPayCode',
          search: {
            labelWidth:'150px',
            type: 'input'
          }
        },
        {
          label: '支付时间',
          prop: 'payBeginTime',
          search: {
            type: 'dateTime',
            prop: 'dateTime'
          }
        },
        {
          label: '开通类型',
          prop: 'orderSourceWay',
          formatter(row) {
            return row&&vm.setTableColumnLabel(row.orderSourceWay, orderSourceWayList)
          },
          search: {
            type: 'dict',
            optionsList: orderSourceWayList
          }
        },
        {
          label: '开通者',
          prop: 'staff',
          search: {
            type: 'input'
          }
        },
        {
          label: '开通者手机号',
          prop: 'staffPhone',
          search: {
            type: 'input'
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
      const searchDate = this.getSearchDate(dateTime)
      this.isLoading = true
      this.$api.order.queryVipList({
        ...searchDate,
        ...other,
        ...page
      }).then(res => {
        this.isLoading = false
        if (res && res.totalCount) {
          const { data, totalCount } = res
          this.pageInfo.totalNum = totalCount
          this.tableList = data.orderVipResp || []
          this.totalSellPrice = data.orderDataCountResp.confirmPaidAmount
          this.totalEarnings = data.orderDataCountResp.orderQuantity
        } else {
          this.tableList = res || []
          this.totalSellPrice = '0.00'
          this.totalEarnings = '0.00'
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.over-view {
  border: 1px solid @light_gray;
  padding: 20px 20px;
  display: flex;
  div {
    text-align: center;
    min-width: 200px;
    &:first-child {
      border-right: 1px solid @border-default;
    }
    span {
      display: block;
      &:first-child {
        color: @active;
      }
    }
  }
}
</style>
