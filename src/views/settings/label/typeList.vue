<template>
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
</template>

<script>
import mixinTable from 'mixins/table'
import dictObj from '@/store/dictData'

export default {
  name: 'typeList',
  mixins: [mixinTable],
  data(vm) {
    return {
      tableInnerBtns: [
        {
          name: '编辑',
          icon: 'el-icon-edit',
          width: 130,
          handle(row) {
            const {
              categoryName,
              categoryLob,
              categoryDesc,
              categoryType,
              id
            } = row
            vm.$emit('showDialog', {
              title: '编辑标签类型',
              initData: {
                categoryName,
                categoryLob,
                categoryType,
                categoryDesc,
                id: id
              },
              isEdit: true
            })
          }
        }
      ],
      tableHeader: [
        {
          label: '类型名称',
          prop: 'categoryName',
          search: {
            type: 'input'
          }
        },
        {
          label: '业务线',
          prop: 'categoryLob',
          formatter(row) {
            const lobObj = row.categoryLob && dictObj.lobListAll.find(res => row.categoryLob === res.value)
            return lobObj ? lobObj.label : ''
          },
          search: {
            type: 'dict',
            optionsList: dictObj.lobListAll
          }
        },
        {
          label: '类型分类',
          prop: 'categoryType',
          formatter(row) {
            const curVal = row.categoryType && dictObj.categoryTypeList.find(res => row.categoryType === res.value)
            return curVal ? curVal.label : ''
          },
          search: {
            type: 'dict',
            optionsList: dictObj.categoryTypeList
          }
        },
        // {
        //   label: '描述',
        //   prop: 'categoryDesc'
        // },
        {
          label: '创建时间',
          prop: 'created'
        }
        // {
        //   label: '更新时间',
        //   prop: 'updated'
        // }
      ]
    }
  },
  created() {
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
      this.$api.settings.getTabTypeList({
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
