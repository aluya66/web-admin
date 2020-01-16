<template>
  <c-view>
    <template v-slot:header>
      <div class="title">
				{{$route.meta.name || $t(`route.${$route.meta.title}`)}}
      </div>
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
          <div class="header-btn">
            <el-button type="primary" :size="size" icon="el-icon-plus" @click="routerLink('/finance/coping/settlement/detail')">新增</el-button>
          </div>
        </template>
      </c-table>
    </div>
  </c-view>
</template>

<script>
import mixinTable from 'mixins/table'
import dictObj from '@/store/dictData'

export default {
  name: 'finance',
  mixins: [mixinTable],
  data(vm) {
    return {
      tableInnerBtns: [{
        name: '详情',
        icon: 'el-icon-view',
        notBtn(row) {
          return (row.settleStatus === 2 && row.payStatus === 3) || (row.settleStatus === 3 && row.payStatus === 1)
        },
        handle(row) {
          vm.routerLink(`/finance/coping/settlement/detail/${row.id}`)
        }
      }],
      // 表格内操作按钮
      tableHeader: [
        {
          label: '制单时间',
          prop: 'created'
        },
        {
          label: '结算单号',
          prop: 'settleOrderNo',
          search: {
            type: 'input'
          }
        },
        {
          label: '店铺账号',
          prop: 'shopAccount'
        },
        {
          label: '店铺名称',
          prop: 'shopName',
          search: {
            type: 'input'
          }
        },
        {
          label: '所属商户',
          prop: 'businessName'
        },
        {
          label: '结算金额(元)',
          prop: 'settleMoney'
        },
        {
          label: '结算状态',
          prop: 'settleStatus',
          formatter(row) {
            return row && vm.setTableColumnLabel(row.settleStatus, 'settleStatusList')
          },
          search: {
            type: 'dict',
            optionsList: dictObj.settleStatusList
          }
        },
        {
          label: '付款状态',
          prop: 'payStatus',
          formatter(row) {
            return row && vm.setTableColumnLabel(row.payStatus, 'payStatusList')
          },
          search: {
            type: 'dict',
            optionsList: dictObj.payStatusList
          }
        },
        {
          label: '备注',
          prop: 'remark',
          search: {
            label: '制单时间',
            dateType: 'datetimerange',
            type: 'dateTime',
            prop: 'dateTime'
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
      const searchDate = this.getSearchDate(dateTime, 'dateTime', 'startTime', 'endTime')
      this.isLoading = true
      this.$api.finance.queryBusinessSettlePage({
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
