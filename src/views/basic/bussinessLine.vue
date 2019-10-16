<template>
  <c-view>
    <template v-slot:header>
     <div class="title">
        {{ $route.meta.name || $t(`route.${$route.meta.title}`) }}
        <el-button type="primary" :size="size" icon="el-icon-plus" @click="addInsert">新增</el-button>
      </div>
    </template>
    <div class="main__box">
      <c-table
        hasBorder
        :size="size"
        :loading="isLoading"
        :table-header="tableHeader"
        :table-list="tableList"
        :page-info="pageInfo"
        :table-inner-btns="tableInnerBtns"
        @change-pagination="changePagination"
      >
        <template v-slot:header>
          <el-form :inline="true" :model="searchObj" label-width="100px" class="search">
            <el-form-item label="app名称">
              <el-input
                v-model="searchObj.appName"
                class="search-item"
                :size="size"
                placeholder="请输入app名称"
                clearable
              />
            </el-form-item>
            <el-form-item label="app编码">
              <el-input
                v-model="searchObj.appCode"
                class="search-item"
                :size="size"
                placeholder="请输入app编码"
                clearable
              />
            </el-form-item>
            <el-form-item label="appKey">
              <el-input
                v-model="searchObj.appKey"
                class="search-item"
                :size="size"
                placeholder="请输入appKey"
                clearable
              />
            </el-form-item>
            <el-form-item label="状态">
              <el-select
                v-model="searchObj.status"
                :size="size"
                class="search-item"
                placeholder="请选择状态"
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
  mixins: [mixinTable],
  data(vm) {
    return {
      searchObj: {
        appName: '',
        appCode: '',
        appKey: '',
        status: ''
      },
      marketableSelect: [
        {
          value: '',
          label: '全部'
        },
        {
          value: '1',
          label: '启用'
        },
        {
          value: '2',
          label: '下架'
        }
      ],
      pickerOptions: utils.pickerOptions,
      tableList: [],
      tableInnerBtns: [{
        width: 130,
        name: '编辑',
        icon: 'el-icon-edit',
        handle(row) {
          console.log(row)
        }
      }],
      tableHeader: [
        {
          label: 'app名称',
          prop: 'appName',
          width: 120,
          fixed: true
        },
        {
          label: 'app编码',
          prop: 'appCode',
          width: 120,
        },
        {
          label: 'appKey',
          prop: 'appKey',
          width: 120,
        },
        {
          label: '状态',
          prop: 'status'
        },
        {
          label: '描述',
          prop: 'description'
        },
        {
          label: '创建时间',
          prop: 'created'
        }
       
        // {
        //   label: '上架状态',
        //   prop: 'marketable',
        //   width: 100,
        //   formatter(row) {
        //     return row.marketable ? vm.marketableSelect[row.marketable - 1].label : ''
        //   }
        // },
       
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
  },
  methods: {
    /**
     * 获取表格数据
    */
    fetchData() {
      console.log(';;;;;;;;;;;;;;;;;;;;;;')
      const { dataTime, ...other } = this.searchObj
      const { totalNum, ...page } = this.pageInfo
      const searchDate = this.getSearchDate(dataTime)
      this.isLoading = true
      this.$api.basic.businessList(
        {
          ...searchDate,
          ...other,
          pageNum: 1,
          pageSize: 10,
          totalNum: 0
        }
      ).then(res => {
        console.log(res)
        this.isLoading = false
        if (res.totalCount) {
          const { data, totalCount } = res
          this.pageInfo.totalNum = totalCount
          this.tableList = data
        } else {
          this.tableList = res
        }
      })
    },
    addInsert(){
      console.log('/////////////')
    }
  }
}
</script>

<style lang="less" scoped>
.main__box {
  .search {
    margin-bottom: 10px;
    width: 100%;
    .search-item {
      width: 250px;
    }
  }
}
.title{
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>
