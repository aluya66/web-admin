<template>
  <c-view>
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
        </template>
      </c-table>
    </div>
  </c-view>
</template>

<script>
import mixinTable from 'mixins/table'
// import dictObj from '@/store/dictData'

export default {
  name: 'equityList',
  mixins: [mixinTable],
  props: {
    memberId: {
      type: String,
      required: true
    }
  },
  data(vm) {
    return {
      // 表格内操作按钮
      tableInnerBtns: [],
      tableHeader: [
        {
          label: '权益id',
          prop: 'id'
        },
        {
          label: '权益名称',
          prop: 'typeName'
        },
        {
          label: '权益说明',
          prop: 'description'
        },
        {
          label: '权益类型',
          prop: 'type',
          formatter(row) {
            return row && vm.setTableColumnLabel(row.type, 'equityTypeList')
          }
        },
        {
          label: '状态',
          prop: 'status',
          formatter(row) {
            return row && vm.setTableColumnLabel(row.status, 'disStatus')
          }
        }
      ]
    }
  },
  watch: {
    memberId(val) {
      this.pageInfo.pageNo = 1
      Number(val) && this.fetchData()
    }
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
      this.$api.member.queryActivityList({
        memberTypeId: this.memberId,
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
