<template>
  <c-view>
    <template v-slot:header>
      <div class="title">
        {{ $route.meta.name || $t(`route.${$route.meta.title}`) }}
      </div>
    </template>
    <div class="main__box">
      <c-table
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
            <el-form-item label="物流名称">
              <el-input
                v-model="searchObj.logiName"
                class="search-item"
                :size="size"
                placeholder="请输入物流名称"
                clearable
              />
            </el-form-item>
            <el-form-item label="物流编码">
              <el-input
                v-model="searchObj.logiCode"
                class="search-item"
                :size="size"
                placeholder="请输入物流编码"
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
    </div>
  </c-view>
</template>

<script>
import mixinTable from 'mixins/table'
import utils from 'utils'

export default {
  name: 'logistics',
  mixins: [mixinTable],
  data(vm) {
    return {
      isEdit: false,
      searchObj: {
        logiName: '',
        logiCode: ''
      },
      marketableSelect: [],
      pickerOptions: utils.pickerOptions,
      tableList: [],
      tableInnerBtns: [],
      tableHeader: [
        {
          label: '物流名称',
          prop: 'logiName',
          fixed: true
        },
        {
          label: '物流编码',
          prop: 'logiCode'
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
.selectWidth {
  width: 200px;
}
.deteleBtn {
  margin-right: 5px;
}
.addBtn {
  margin-left: 40px;
}
.cancelBtn {
  margin-left: 8px;
}
.modelStyle {
  margin: 0 20px;
}
</style>
