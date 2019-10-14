<template>
  <c-view>
    <template v-slot:header>
			<div class="title">
				{{ $route.meta.name || $t(`route.${$route.meta.title}`) }}
			</div>
		</template>
    <div class="main__box">
      <c-table
        selection
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
            <el-form-item label="商品名称">
              <el-input
                v-model="searchObj.goodsName"
                class="search-item"
                :size="size"
                placeholder="请输入商品名称"
                clearable
              />
            </el-form-item>
            <el-form-item label="商品编码">
              <el-input
                v-model="searchObj.goodsBn"
                class="search-item"
                :size="size"
                placeholder="请输入商品编码"
                clearable
              />
            </el-form-item>
            <el-form-item label="操作人">
              <el-input
                v-model="searchObj.operatorName"
                class="search-item"
                :size="size"
                placeholder="请输入操作人"
                clearable
              />
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
              >
                align="right">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="search-btn" :size="size" icon="el-icon-search" @click="searchSubmit">查询</el-button>
            </el-form-item>
          </el-form>
        </template>
      </c-table>
    </div>
  </c-view>
</template>

<script>
import CTable from 'components/table'
import mixinTable from 'mixins/table'
import utils from 'utils'

export default {
  mixins: [mixinTable],
  data (vm) {
    return {
      searchObj: {
        goodsName: '',
        operatorName: '',
        goodsBn: '',
        dataTime: ''
      },
      pickerOptions: utils.pickerOptions,
      tableList: [],
      tableInnerBtns: [],
      tableHeader: [
        {
          label: '商品ID',
          prop: 'id'
        },
        {
          label: '商品名称',
          prop: 'goodsName'
        },
        {
          label: '商品编码',
          prop: 'goodsBn'
        },
        {
          label: '操作人',
          prop: 'operatorName'
        },
        {
          label: '创建时间',
          prop: 'created'
        }
      ]
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      const { dataTime, ...other } = this.searchObj
      const { totalNum, ...page } = this.pageInfo
      const searchDate = this.getSearchDate(dataTime)
      this.isLoading = true
      this.$api.goods.getOperator(
        {
          ...searchDate,
          ...other,
          ...page
        }
      ).then(res => {
        this.isLoading = false
        if (res.totalCount) {
          const { data, totalCount } = res
          this.pageInfo.totalNum = totalCount
          this.tableList = data
        } else {
          this.tableList = res
        }
      })
    }
  },
  components: {
    CTable
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
</style>
