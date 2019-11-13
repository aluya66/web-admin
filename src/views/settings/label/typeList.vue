<template>
  <c-table
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
      <el-form :inline="true" :model="searchObj" label-width="100px" class="search-form">
        <el-form-item label="标签类型">
          <el-input
            v-model="searchObj.logiName"
            class="search-item"
            :size="size"
            placeholder="标签类型"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            class="search-btn"
            :size="size"
            icon="el-icon-search"
            @click="searchSubmit"
          >查询</el-button>
        </el-form-item>
      </el-form>
    </template>
  </c-table>
</template>

<script>
import mixinTable from 'mixins/table'
import utils from 'utils'

export default {
  name: 'typeList',
  mixins: [mixinTable],
  data(vm) {
    return {
      searchObj: {
        logiName: '',
        logiCode: ''
      },
      pickerOptions: utils.pickerOptions,
      tableList: [],
      tableInnerBtns: [
        {
          name: '编辑',
          icon: 'el-icon-edit',
          handle(row) {
            const {
              logiName,
              logiCode,
              id
            } = row
            vm.$emit('showDialog', {
              title: '编辑标签类型',
              initData: {
                logiName,
                logiCode,
                id: id
              },
              isEdit: true
            })
          }
        },
        {
          name: '删除',
          icon: 'el-icon-delete',
          handle(row) {
            const { name, id } = row
            vm.confirmTip(`确认删除${name}类型`, () => {
              vm.deleteData({ id })
            })
          }
        }
      ],
      tableHeader: [
        {
          label: '标签类型',
          prop: 'logiName',
          fixed: true
        }
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
      const { dataTime, ...other } = this.searchObj
      const { totalNum, ...page } = this.pageInfo
      const searchDate = this.getSearchDate(dataTime)
      this.isLoading = true
      this.$api.basic
        .getLogistics({
          ...searchDate,
          ...other,
          ...page
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
    deleteData(param, msgTip = '删除成功') {
      this.$api.basic.deleteGoodsattrval(param).then(() => {
        this.$msgTip(msgTip)
        this.delResetData()
      })
    }
  }
}
</script>
