<template>
  <c-table
    selection
    hasBorder
    :size="size"
    :loading="isLoading"
    :table-header="tableHeader"
    :table-list="tableList"
    :page-info="pageInfo"
    @selection-handle="selectionHandle"
    @change-pagination="changePagination"
  >
    <template v-slot:header>
      <el-form :inline="true" :model="searchObj" label-width="100px" class="search-form">
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
        <el-form-item label="品牌">
          <el-input
            v-model="searchObj.brandName"
            class="search-item"
            :size="size"
            placeholder="请输入品牌"
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

export default {
  mixins: [mixinTable],
  data(vm) {
    return {
      searchObj: {
        goodsBn: '',
        goodsName: '',
        brandName: ''
      },
      tableHeader: [
        {
          label: '商品ID',
          prop: 'id',
          fixed: true
        },
        {
          label: '商品编码',
          prop: 'goodsBn'
        },
        {
          label: '商品名称',
          prop: 'goodsName'
        },
        {
          label: '商品图片',
          prop: 'coverImg',
          isImage: true
        },
        {
          label: '品牌',
          prop: 'brandName'
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
      this.$api.goods.getList(
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
    },
    selectionHandle(val) {
      console.log(val, 1212)
    }
  }
}
</script>
