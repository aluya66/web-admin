<template>
  <c-view>
    <template v-slot:header>
      <div class="title">{{ $route.meta.name || $t(`route.${$route.meta.title}`) }}</div>
    </template>
    <div class="main__box">
      <c-table
        ref="cTable"
        selection
        hasBorder
        :size="size"
        :max-height="730"
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
import dictObj from '@/store/dictData'
export default {
  name: 'exportList',
  mixins: [mixinTable],
  data(vm) {
    return {
      dialogObj: {}, // 对话框数据
      tableInnerBtns: [
        {
          width: 130,
          name: '下载',
          icon: '',
          handle(row) {
            const { url } = row
            window.location.href = url
          }
        }
      ],
      tableHeader: [
        {
          label: 'id',
          prop: 'id',
          width: 150,
          fixed: true
        },
        {
          label: '业务线',
          prop: 'appCode',
          formatter(row) {
            return row && vm.setTableColumnLabel(row.appCode, 'lobList')
          }
        },
        {
          label: '文件大小',
          prop: 'size'
        },
        {
          label: '文件名称',
          prop: 'fileName'
        },
        {
          label: '创建时间',
          prop: 'created'
        }
      ]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      const { totalNum, ...page } = this.pageInfo
      this.isLoading = true
      this.$api.basic.getExportList(
        {
          ...page
        }
      ).then(res => {
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

<style lang="less" scoped>
.title {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>
