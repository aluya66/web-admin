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
import CDialog from 'components/dialog'

export default {
  name: 'exportRecord',
  mixins: [mixinTable],
  components: {
    CDialog
  },
  data(vm) {
    return {
      formModel: {},
      dialogObj: {}, // 对话框数据
      tableInnerBtns: [
         {
          name: '下载兑换码',
          icon: 'el-icon-download',
          handle(row) {
            vm.exportFile({ cardRecordId: row.cardRecordId })
          }
        }
      ],
      tableHeader: [
        {
          label: '名称',
          prop: 'couponName',
          width: 100,
          fixed: true
        },
        {
          label: '绑卡金额',
          prop: 'faceValue'
        },
        {
          label: '导出数量',
          prop: 'issueNumber'
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
    exportFile(params) {
      this.$api.marketing.exportExportRecord(params).then(res => {
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
    },
    /**
     * 获取表格数据
     */
    fetchData() {
      const { dateTime, ...other } = this.searchObj
      const { totalNum, ...page } = this.pageInfo
      const searchDate = this.getSearchDate(dateTime)
      this.isLoading = true
      this.$api.marketing.getExportRecordList({
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
