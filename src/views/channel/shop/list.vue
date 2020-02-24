<template>
  <c-view>
    <template v-slot:header>
      <div class="title">{{ $route.meta.name || $t(`route.${$route.meta.title}`) }}</div>
      <div class="header-btn">
        <el-button
          type="primary"
          :size="size"
          icon="el-icon-plus"
          @click="routerLink('/channel/shop/detail')"
        >新增</el-button>
      </div>
    </template>
    <div class="main__box">
      <c-table
        ref="cTable"
        selection
        hasBorder
        :size="size"
        :max-height="685"
        :loading="isLoading"
        :table-header="tableHeader"
        :table-list="tableList"
        :page-info="pageInfo"
        :table-inner-btns="tableInnerBtns"
        @change-pagination="changePagination"
      >
        <template v-slot:header>
          <c-search
            :form-model="searchObj"
            :form-items="searchItems"
            @submit-form="searchSubmit"
            @reset-form="searchReset"
          ></c-search>
        </template>
      </c-table>
    </div>
  </c-view>
</template>

<script>
import mixinTable from 'mixins/table'
import dictObj from '@/store/dictData'

const businessTypeSelect = [{
  label: '加盟',
  value: 1
}]
const shopStatusSelect = [
  {
    value: 0,
    label: '关闭'
  },
  {
    value: 1,
    label: '开启'
  }
]
export default {
  name: 'shopList',
  mixins: [mixinTable],
  data(vm) {
    return {
      searchObj: {
        shopName: '',
        shopType: '',
        status: ''
      },
      dialogObj: {}, // 对话框数据
      tableList: [],
      isLoading: false,
      tableInnerBtns: [
        {
          width: 100,
          name: '编辑',
          icon: 'el-icon-edit',
          handle(row) {
            vm.routerLink(`/channel/shop/detail/${row.shopId}`)
          }
        }
      ],
      tableHeader: [
        {
          label: 'LOGO',
          prop: 'shopLogo',
          isImage: true,
          width: 100
        },
        {
          label: '门店名称',
          prop: 'shopName',
          search: {
            type: 'input'
          }
        },
        {
          label: '门店类型',
          prop: 'shopType',
          search: {
            type: 'select',
            optionsList: dictObj.shopTypeList
          },
          formatter(row) {
            return row && vm.setTableColumnLabel(row.shopType, 'shopTypeList')
          }
        },
        {
          label: '联系人',
          prop: 'contact',
          search: {
            label: '负责人',
            type: 'input'
          }
        },
        {
          label: '联系手机',
          prop: 'contactTel',
          search: {
            type: 'input'
          }
        },
        {
          label: '经营方式',
          prop: 'businessType',
          formatter(row) {
            return row && vm.setTableColumnLabel(row.businessType, businessTypeSelect)
          }
        },
        {
          label: '关联商户',
          prop: 'businessName',
          search: {
            prop: 'businessCode',
            type: 'dict',
            optionsList: [],
            allowCreate: true,
            filterable: true
          }
        },
        {
          label: '状态',
          prop: 'status',
          formatter(row) {
            return row.status ? shopStatusSelect[row.status].label : '关闭'
          },
          search: {
            type: 'dict',
            optionsList: shopStatusSelect
          }
        },
        {
          label: '更新人',
          prop: 'operaterName'
        },
        {
          label: '更新日期',
          prop: 'updated'
        }
      ]
    }
  },
  created() {
    this.fetchData()
    this.getBusiness()
  },
  methods: {
    // 获取关联商户列表
    getBusiness() {
      this.$api.channel.getBusiness({
        pageNo: 1,
        pageSize: 100
      }).then(res => {
        if (res && res.totalCount) {
          const businessList = res.data.map(res => ({ value: res.businessCode, label: res.businessName })) || []
          this.setSearchOptionsList('businessCode', businessList)
        }
      })
    },
    fetchData() {
      const { dateTime, ...other } = this.searchObj
      const { totalNum, ...page } = this.pageInfo
      this.isLoading = true
      this.$api.channel.getShopList({
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
