<template>
  <c-view>
    <c-table
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
  </c-view>
</template>

<script>
import mixinTable from 'mixins/table'
import utils from 'utils'

export default {
  name: 'ysgoList',
  mixins: [mixinTable],
  data(vm) {
    return {
      dialogObj: {}, // 对话框数据
      tableInnerBtns: [
        {
          name: '导出券码',
          icon: 'el-icon-download',
          handle(row) {
            vm.exportFile({ couponDetailId: row.couponDetailId })
          }
        }
      ],
      tableHeader: [
        {
          label: '规则ID',
          prop: 'couponId',
          width: 100,
          fixed: true
        },
        {
          label: '规则名称',
          prop: 'couponRuleName'
        },
        {
          label: '卡券名称',
          prop: 'couponName',
          search: {
            type: 'input'
          }
        },
        {
          label: '卡券类型',
          prop: 'couponRuleTypeName'
        },
        // {
        //   label: '卡券内容',
        //   prop: 'preferentialType'
        // },
        {
          label: '导出数量',
          prop: 'couponNumber'
        },
        {
          label: '导出人',
          prop: 'opCreator'
        },
        {
          label: '导出时间',
          prop: 'created'
        }
      ]
    }
  },
  activated() {
    this.fetchData()
  },
  methods: {
    /**
     * 获取表格数据
     */
    fetchData() {
      const { dateTime, ...other } = this.searchObj
      const { totalNum, ...page } = this.pageInfo
      const searchDate = this.getSearchDate(dateTime)
      this.isLoading = true
      this.$api.marketing.queryStarRuleList({
        ...searchDate,
        ...other,
        ...page,
        platformList: ['ysgo']
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
    },
    exportFile(params) {
      this.$api.marketing.exportStargoCard(params).then(res => {
        this.exportLoading = false
        if (res) {
          const { data, filename } = res
          if (data && filename) {
            utils.createBlobFile(data, filename)
          } else {
            this.$msgTip('导出数据异常', 'warning')
          }
        } else {
          this.$msgTip('导出数据失败', 'warning')
        }
      })
    }
  }
}
</script>
