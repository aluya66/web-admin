<template>
  <c-view>
    <template v-slot:header>
      <div class="title">{{$route.meta.name || $t(`route.${$route.meta.title}`)}}</div>
      <div class="header-btn">
        <!-- <el-button
          :size="size"
          type="primary"
          :loading="exportLoading"
          icon="el-icon-download"
          @click="exportFile"
        >导出</el-button> -->
      </div>
    </template>
    <div class="main__box">
      <div class="over-view">
        <div>
          <span>{{totalSellPrice}}</span>
          <span>销售总额(元)</span>
        </div>
        <div>
          <span>{{totalEarnings}}</span>
          <span>结算总收益(元)</span>
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
        :table-inner-btns="tableInnerBtns"
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
import dictObj from '@/store/dictData'

export default {
  name: 'financeSettlement',
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
          label: '结算单号',
          prop: 'earningsCode',
          search: {
            type: 'input'
          }
        },
        {
          label: '订单号',
          prop: 'transactionCode',
          search: {
            type: 'input'
          }
        },
        {
          label: '购买者手机号',
          prop: 'buyerPhone',
          search: {
            type: 'input'
          }
        },
        {
          label: '邀请者手机号',
          prop: 'referrerPhone',
          search: {
            type: 'input'
          }
        },
        {
          label: '结算类型',
          prop: 'type',
          formatter(row) {
            return row && vm.setTableColumnLabel(row.type, 'earningsTypeList')
          },
          search: {
            type: 'dict',
            optionsList: dictObj.earningsTypeList
          }
        },
        {
          label: '销售金额',
          prop: 'sellPrice'
        },
        {
          label: '结算收益',
          prop: 'earningsPrice'
        },
        {
          label: '结算状态',
          prop: 'earningsStatus',
          formatter(row) {
            return row && vm.setTableColumnLabel(row.earningsStatus, 'earningsStatusList')
          },
          search: {
            type: 'dict',
            optionsList: dictObj.earningsStatusList
          }
        },
        {
          label: '创建时间',
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
      const searchDate = this.getSearchDate(dateTime)
      this.isLoading = true
      this.$api.finance.queryEarningslist({
        ...searchDate,
        ...other,
        ...page
      }).then(res => {
        this.isLoading = false
        if (res && res.totalCount) {
          const { data, totalCount } = res
          this.pageInfo.totalNum = totalCount
          this.tableList = data.earningsList || []
          this.totalSellPrice = data.totalSellPrice
          this.totalEarnings = data.totalEarnings
        } else {
          this.tableList = res || []
        }
      })
    },
    /**
		 * 删除单条表格数据
		 * @id {Number}
		 */
    deleteHandle(id) {
      this.$api.finance.deleteFinance({ id }).then(() => {
        this.$msgTip('删除成功')
        this.fetchData()
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
