<template>
  <c-view>
    <template v-slot:header>
      <div class="title">{{ $route.meta.name || $t(`route.${$route.meta.title}`) }}</div>
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
const shopTypeSelect = [{
  label: '自营',
  value: 1
}, {
  label: '加盟',
  value: 2
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
          width: 130,
          name: '详情',
          icon: 'el-icon-view',
          handle(row) {
            vm.routerLink(`/channel/detail/${row.shopId}`)
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
          label: '店招',
          prop: 'shopImage',
          isImage: true,
          width: 100
        },
        {
          label: '店铺名称',
          prop: 'shopName',
          search: {
            type: 'input'
          }
        },
        {
          label: '店铺风格',
          prop: 'styleName'
        },
        {
          label: '店铺类型',
          prop: 'shopType',
          search: {
            type: 'select',
            optionsList: shopTypeSelect
          },
          formatter(row) {
            return row.shopType ? shopTypeSelect[row.shopType - 1].label : ''
          }
        },
        {
          label: '店铺地址',
          prop: 'address',
          isPopover: true
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
          prop: 'status',
          formatter(row) {
            return row.status ? shopStatusSelect[row.status].label : '关闭'
          },
          search: {
            type: 'dict',
            optionsList: shopTypeSelect
          }
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
  created() {
    this.fetchData()
  },
  methods: {
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
