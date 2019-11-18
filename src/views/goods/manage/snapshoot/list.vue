<template>
  <c-view>
    <template v-slot:header>
      <div class="title">{{ $route.meta.name || $t(`route.${$route.meta.title}`) }}</div>
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
          <el-form :inline="true" :model="searchObj" label-width="100px" class="search-form">
            <el-form-item label="商品快照id">
              <el-input
                v-model="searchObj.id"
                class="search-item"
                :size="size"
                placeholder="请输入快照id"
                clearable
              />
            </el-form-item>
            <el-form-item label="商品名称">
              <el-input
                v-model="searchObj.goodsName"
                class="search-item"
                :size="size"
                placeholder="请输入商品名称"
                clearable
              />
            </el-form-item>
            <el-form-item label="商品spu码">
              <el-input
                v-model="searchObj.goodsBn"
                class="search-item"
                :size="size"
                placeholder="请输入商品spu编码"
                clearable
              />
            </el-form-item>
            <el-form-item label="商品sku编码">
              <el-input
                v-model="searchObj.goodsSkuSn"
                class="search-item"
                :size="size"
                placeholder="请输入商品Sku编码"
                clearable
              />
            </el-form-item>
            <el-form-item label="快照时间">
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
  name: 'goodsSnapshoot',
  mixins: [mixinTable],
  data(vm) {
    return {
      searchObj: {
        id: '',
        goodsName: '',
        goodsBn: '',
        goodsSkuSn: '',
        dataTime: ''
      },
      pickerOptions: utils.pickerOptions,
      tableList: [],
      tableInnerBtns: [{
        name: '详情',
        icon: 'el-icon-view',
        handle(row) {
          vm.routerLink(`/goods/manage/snapshootDetail/${row.id}`)
        }
      }],
      tableHeader: [
        {
          label: '商品快照id',
          prop: 'id'
        },
        {
          label: '商品名称',
          prop: 'goodsName'
        },
        {
          label: '商品spu编码',
          prop: 'goodsBn'
        },
        {
          label: '商品sku编码',
          prop: 'goodsSkuSn'
        },
        {
          label: '创建时间',
          prop: 'created'
        },
        {
          label: '更新时间',
          prop: 'updated'
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
      this.$api.goods.getSnapshot(
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
  }
}
</script>
