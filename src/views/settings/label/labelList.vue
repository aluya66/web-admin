<template>
  <c-table
    ref="cTable"
    selection
    hasBorder
    :size="size"
    :max-height="maxHeight"
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

const pageItemType = ['文本', '复选', '单选'] // 页面显示类型

export default {
  name: 'labelList',
  mixins: [mixinTable],
  props: {
    tagType: Array,
    default() {
      return []
    }
  },
  data(vm) {
    return {
      tableInnerBtns: [
        {
          width: 130,
          name: '编辑',
          icon: 'el-icon-edit',
          handle(row) {
            const {
              categoryId,
              tagName,
              tagValues,
              categoryLob,
              tagStatus,
              tagDesc,
              operateType,
              id
            } = row
            vm.$emit('showDialog', {
              title: '编辑标签',
              initData: {
                categoryId,
                tagName,
                categoryLob,
                tagStatus,
                tagDesc,
                operateType,
                id,
                tagValues: tagValues.map(({ value, id, desc }) => ({ value, id, desc }))
              },
              isEdit: true
            })
          }
        },
        {
          name: '删除',
          icon: 'el-icon-delete',
          handle(row) {
            const { tagName, id } = row
            vm.confirmTip(`确认删除${tagName}标签`, () => {
              vm.deleteData({ id })
            })
          }
        }
      ],
      tableHeader: [
        {
          label: '标签名称',
          prop: 'tagName',
          fixed: true,
          width: 150,
          search: {
            type: 'input'
          }
        },
        {
          label: '标签类型',
          prop: 'categoryName',
          search: {
            type: 'dict',
            prop: 'categoryId',
            optionsList: []
          }
        },
        {
          label: '标签值',
          prop: 'tagValues',
          width: 600,
          formatter(row) {
            return row.tagValues.map(item => item.value).filter(d => d).join('/')
          },
          search: {
            type: 'input',
            prop: 'value'
          }
        },
        {
          label: '显示类型',
          prop: 'operateType',
          formatter(row, index) {
            return row.operateType ? pageItemType[row.operateType - 1] : '无'
          }
        },
        {
          label: '业务线',
          prop: 'categoryLob',
          formatter(row) {
            return row && vm.setTableColumnLabel(row.categoryLob, 'lobListAll')
          },
          search: {
            type: 'dict',
            optionsList: dictObj.lobListAll
          }
        },
        {
          label: '标签状态',
          prop: 'tagStatus',
          formatter(row) {
            return row && vm.setTableColumnLabel(row.tagStatus, 'disStatus')
          },
          search: {
            type: 'dict',
            optionsList: dictObj.disStatus
          }
        },
        {
          label: '创建时间',
          prop: 'created',
          width: 100,
          search: {
            prop: 'dateTime',
            type: 'dateTime'
          }
        }
        // {
        //   label: '更新时间',
        //   prop: 'updated',
        //   width: 100
        // }
      ]
    }
  },
  created() {
    this.fetchData()
    this.setSearchOptionsList('categoryId', this.tagType)
  },
  methods: {
    fetchData() {
      const { dateTime, ...other } = this.searchObj
      const { totalNum, ...page } = this.pageInfo
      const searchDate = this.getSearchDate(dateTime)
      this.isLoading = true
      this.$api.settings.getTabList({
        categoryType: 2, // 标签
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
    },
    deleteData(param, msgTip = '删除成功') {
      this.$api.settings.deleteTag(param).then(() => {
        this.$msgTip(msgTip)
        this.delResetData()
      })
    }
  }
}
</script>
