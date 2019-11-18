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
        <el-form-item label="类型名称">
          <el-input
            v-model="searchObj.categoryName"
            class="search-item"
            :size="size"
            placeholder="类型名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="业务线">
          <query-dict
            :dict-list="lobList"
            class="search-item"
            :size="size"
            placeholder="请选择"
            :value.sync="searchObj.categoryLob"
          ></query-dict>
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
import dictObj from '@/store/dictData'

export default {
  name: 'typeList',
  mixins: [mixinTable],
  data(vm) {
    return {
      lobList: dictObj.lobList, // 业务线集合
      searchObj: {
        categoryName: '', // 类型名称
        categoryLob: '' // 业务线
      },
      pickerOptions: utils.pickerOptions,
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
              id
            } = row
            vm.$emit('showDialog', {
              title: '编辑标签类型',
              initData: {
                categoryName,
                categoryLob,
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
          prop: 'categoryName'
        },
        {
          label: '业务线',
          prop: 'categoryLob',
          formatter(row) {
            const lobObj = row.categoryLob && vm.lobList.find(res => row.categoryLob === res.value)
            return lobObj ? lobObj.label : ''
          }
        },
        {
          label: '描述',
          prop: 'categoryDesc'
        },
        {
          label: '创建时间',
          prop: 'created',
          width: 100
        },
        {
          label: '更新时间',
          prop: 'updated',
          width: 100
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
