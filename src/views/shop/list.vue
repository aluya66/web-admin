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
        :fixed-height="546"
        :loading="isLoading"
        :table-header="tableHeader"
        :table-list="tableList"
        :page-info="pageInfo"
        :table-inner-btns="tableInnerBtns"
        @change-pagination="changePagination"
      >
        <template v-slot:header>
          <el-form :inline="true" :model="searchObj" label-width="100px" class="search">
            <el-form-item label="用户名">
              <el-input
                v-model="searchObj.shopName"
                class="search-item"
                size="medium"
                placeholder="门店名称"
                clearable
              />
            </el-form-item>
            <el-form-item label="门店类型">
              <el-select
                v-model="searchObj.shopType"
                size="medium"
                class="search-item"
                clearable
                placeholder="门店类型"
              >
                <el-option label="自营" :value="0"></el-option>
                <el-option label="加盟" :value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="店铺状态">
              <el-select
                v-model="searchObj.status"
                size="medium"
                class="search-item"
                clearable
                placeholder="店铺状态"
              >
                <el-option
                  v-for="(item, index) in shopStatusSelect"
                  :key="index"
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

export default {
  mixins: [mixinTable],
  data (vm) {
    return {
      searchObj: {
        shopName: '',
        shopType: '',
        status: ''
      },
      dialogObj: {}, // 对话框数据
      shopStatusSelect: [
        {
          value: '0',
          label: '关闭'
        },
        {
          value: '1',
          label: '开启'
        }
      ],
      tableList: [],
      isLoading: false,
      tableInnerBtns: [
        {
          width: 130,
          name: '查看详情',
          icon: 'el-icon-edit',
          handle (row) {
            vm.routerLink(`/shop/shopDetail/${row.id}`)
          }
        }
      ],
      tableHeader: [
        {
          label: '店铺ID',
          prop: 'shopId',
          fixed: true
        },
        {
          label: '店铺类型',
          prop: 'shopType'
        },
        {
          label: '店铺名称',
          prop: 'styleName'
        },
        {
          label: 'LOGO',
          prop: 'shopLogo'
        },
        {
          label: '店招',
          prop: 'shopImage',
          isImage: true
        },
        {
          label: '店铺地址',
          prop: 'address'
        },
        {
          label: '联系人',
          prop: 'contact'
        },
        {
          label: '联系电话',
          prop: 'contactTel'
        },
        {
          label: '状态',
          prop: 'status'
        },
        {
          label: '添加人',
          prop: 'operaterName'
        },
        {
          label: '添加时间',
          prop: 'created'
        }
      ]
    }
  },
  created () {
    // this.fetchData()
  },
  methods: {
    fetchData () {
      const { dataTime, ...other } = this.searchObj
      const { totalNum, ...page } = this.pageInfo
      this.isLoading = true
      this.$api.shop.getShopList({
        ...this.searchObj,
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
