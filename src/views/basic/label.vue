<template>
  <c-view>
    <template v-slot:header>
      <div class="title">
        <el-tabs v-model="activeName" @tab-click="changeTitle">
          <el-tab-pane
            v-for="(item, index) in labelTitle"
            :key="index"
            :label="item.label"
            :name="item.value"
          ></el-tab-pane>
        </el-tabs>
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
            <el-form-item label="标签名称">
              <el-input
                v-model="searchObj.labelName"
                class="search-item"
                :size="size"
                placeholder="请输入名称"
                clearable
              />
            </el-form-item>
            <el-form-item label="标签编码">
              <el-input
                v-model="searchObj.labelCode"
                class="search-item"
                :size="size"
                placeholder="请输入标签编码"
                clearable
              />
            </el-form-item>
            <el-form-item label="标签状态">
              <el-select
                v-model="searchObj.labelStatus"
                class="select-item"
                :size="size"
                clearable
              >
                <el-option
                  v-for="item in marketableSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              </el-form-item>
            <el-form-item label="操作时间">
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
    </div>
  </c-view>
</template>
<script>
import mixinTable from 'mixins/table'
import utils from 'utils'

export default {
  name: 'labelManage',
  mixins: [mixinTable],
  data(vm) {
    return {
      value: '',
      searchObj: {
        labelName: '',
        labelCode: '',
        dataTime: '',
        labelStatus: ''
      },
      marketableSelect: [
        {
          value: 1,
          label: '有效'
        },
        {
          value: 2,
          label: '无效'
        }
      ],
      labelTitle: [
        {
          value: '1',
          label: '商品标签'
        },
        {
          value: '2',
          label: '用户标签'
        }
      ],
      pickerOptions: utils.pickerOptions,
      tableList: [],
      tableInnerBtns: [],
      tableHeader: [
        {
          label: '标签名称',
          prop: 'labelName',
          width: 120,
          fixed: true
        },
        {
          label: '拼音大写',
          prop: 'initial',
          width: 200
        },
        {
          label: '标签编码',
          prop: 'labelCode',
          width: 120
        },
        {
          label: '标签风格',
          prop: 'categoryName',
          formatter(row) {
            return row.labelCategoryModels.map(item => item.categoryName).filter(d => d).join('/')
          }
        },
        {
          label: '标签状态',
          prop: 'labelStatusCN',
          width: 120
        },
        {
          label: '标签描述',
          prop: 'labelDesc'
        },
        // {
        //   label: '创建人',
        //   prop: 'createdby',
        //   width: 100
        // },
        // {
        //   label: '更新人',
        //   prop: 'updatedby',
        //   width: 100
        // },
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
      ],
      activeName: '1',
      name: 1,
      addSoreList: [],
      labelType: 1,
      categoryType: 1,
      typeBtn: 2
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
      this.$api.basic
        .getQuerypage({
          ...searchDate,
          ...other,
          ...page,
          labelType: this.labelType,
          categoryType: this.categoryType
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
    changeTitle(tab, event) {
      if (tab.name === '1') {
        this.labelType = 1
        this.categoryType = 1
        this.value = '1'
      } else if (tab.name === '2') {
        this.labelType = 2
        this.categoryType = 2
        this.value = '2'
      }
      this.searchObj = {}
      this.fetchData()
    }
  }
}
</script>

<style lang="less" scoped>
.title {
  width: 100%;
  display: flex;
  justify-content: space-between;
  height: 36px;
}
</style>
