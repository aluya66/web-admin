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
          <el-select
            v-model="searchObj.type"
            :size="size"
            class="search-item"
            placeholder="请选择标签类型"
            clearable
          >
            <el-option
              v-for="item in parameterSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标签名称">
          <el-input
            v-model="searchObj.name"
            class="search-item"
            :size="size"
            placeholder="标签名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="标签值">
          <el-input
            v-model="searchObj.name"
            class="search-item"
            :size="size"
            placeholder="标签值"
            clearable
          />
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

export default {
  name: 'labelList',
  mixins: [mixinTable],
  data(vm) {
    return {
      searchObj: {
        name: '',
        type: '',
        isDelete: '',
        dataTime: '',
        paramType: ''
      },
      parameterSelect: [
        {
          value: '0',
          label: '分类'
        },
        {
          value: 1,
          label: '参数'
        },
        {
          value: 2,
          label: '属性'
        }
      ],
      pickerOptions: utils.pickerOptions,
      tableInnerBtns: [
        {
          width: 130,
          name: '编辑',
          icon: 'el-icon-edit',
          handle(row) {
            const {
              type,
              name,
              sort,
              bmsGoodsAttrVals,
              id,
              paramType
            } = row
            vm.$emit('showDialog', {
              title: '编辑标签',
              initData: {
                type,
                name,
                sort,
                items: bmsGoodsAttrVals.map(({ value, id, description }) => ({ value, id, description })),
                paramType,
                id
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
            vm.confirmTip(`确认删除${name}标签`, () => {
              vm.deleteData({ id })
            })
          }
        }
      ],
      tableHeader: [
        {
          label: '标签名称',
          prop: 'name',
          fixed: true,
          width: 150
        },
        {
          label: '标签类型',
          prop: 'type',
          formatter(row) {
            return row.type ? vm.parameterSelect[row.type].label : '分类'
          }
        },
        {
          label: '标签值',
          prop: 'value',
          formatter(row) {
            return row.bmsGoodsAttrVals.map(item => item.value).filter(d => d).join('/')
          }
        },
        {
          label: '操作类型',
          prop: 'paramType',
          width: 100,
          formatter(row, index) {
            return row.paramType === 'checkbox' ? '复选框' : row.paramType === 'radio' ? '单选框' : row.paramType === 'radio' ? '下拉框' : '无'
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
      this.$api.basic.getGoodsattrval({
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
      this.$api.basic.deleteGoodsattrval(param).then(() => {
        this.$msgTip(msgTip)
        this.delResetData()
      })
    }
  }
}
</script>
