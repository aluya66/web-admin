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
        <el-form-item label="标签名称">
          <el-input
            v-model="searchObj.tagName"
            class="search-item"
            :size="size"
            placeholder="标签名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="标签类型">
          <query-dict
            :dict-list="tagType"
            class="search-item"
            :size="size"
            placeholder="请选择"
            :value.sync="searchObj.categoryId"
          ></query-dict>
        </el-form-item>
        <el-form-item label="标签值">
          <el-input
            v-model="searchObj.value"
            class="search-item"
            :size="size"
            placeholder="标签值"
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
        <el-form-item label="创建时间">
          <el-date-picker
            :size="size"
            v-model="searchObj.dataTime"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            :default-time="['00:00:00', '23:59:59']"
          >align="right"></el-date-picker>
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

const pageItemType = ['文本', '复选', '单选', '下拉', '多文本'] // 页面显示类型

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
      lobList: dictObj.lobList, // 业务线集合
      disStatus: dictObj.disStatus, // 启用/禁用
      searchObj: {
        tagName: '', // 标签名称
        categoryId: '', // 标签类型id
        value: '', // 标签值
        dataTime: '', // 操作时间
        tagStatus: '' // 是否禁用
      },
      pickerOptions: utils.pickerOptions,
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
          width: 150
        },
        {
          label: '标签类型',
          prop: 'categoryName'
        },
        {
          label: '标签值',
          prop: 'tagValues',
          width: 600,
          formatter(row) {
            return row.tagValues.map(item => item.value).filter(d => d).join('/')
          }
        },
        {
          label: '标签状态',
          prop: 'tagStatus',
          formatter(row) {
            return row.tagStatus || row.tagStatus === 0 ? vm.disStatus[row.tagStatus].label : ''
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
            const lobObj = row.categoryLob && vm.lobList.find(res => row.categoryLob === res.value)
            return lobObj ? lobObj.label : ''
          }
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
    fetchData() {
      const { dataTime, ...other } = this.searchObj
      const { totalNum, ...page } = this.pageInfo
      const searchDate = this.getSearchDate(dataTime)
      this.isLoading = true
      this.$api.settings.getTabList({
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
