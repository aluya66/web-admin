<template>
  <c-view>
    <template v-slot:header>
      <div class="title">
				{{$route.meta.name || $t(`route.${$route.meta.title}`)}}
      </div>
    </template>
    <div class="main__box">
      <c-table
        ref="cTable"
        selection
        hasBorder
        :max-height="maxHeight"
        :size="size"
        :loading="isLoading"
        :table-header="tableHeader"
        :table-list="tableList"
				:table-inner-btns="tableInnerBtns"
				:page-info="pageInfo"
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

export default {
  name: 'financeAccount',
  mixins: [mixinTable],
  data(vm) {
    return {
      tableInnerBtns: [{
        name: '账户明细',
        icon: 'el-icon-tickets',
        handle(row) {
          vm.routerLink(`/finance/accountDetail/${row.id}`)
        }
      }],
      // 表格内操作按钮
      tableHeader: [
        {
          label: '店铺id',
          prop: 'shopId',
          search: {
            type: 'input'
          }
        },
        {
          label: '店铺名称',
          prop: 'shopName',
          search: {
            type: 'input'
          }
        },
        {
          label: '店铺类型',
          prop: 'shopType',
          formatter(row) {
            return row && vm.setTableColumnLabel(row.shopType, 'shopTypeList')
          }
        },
        {
          label: '所属合作商',
          prop: 'partners',
          search: {
            prop: 'businessName',
            type: 'input'
          }
        },
        {
          label: '预存款余额(元)',
          prop: 'balance'
        },
        {
          label: '店铺状态',
          prop: 'shopStatus',
          formatter(row) {
            return row && vm.setTableColumnLabel(row.shopStatus, 'disStatus')
          },
          search: {
            type: 'dict',
            optionsList: dictObj.disStatus
          }
        }
      ]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    /*
	   * 查询表格列表数据
	   */
    fetchData() {
      const { totalNum, ...page } = this.pageInfo
      const { dateTime, ...other } = this.searchObj
      const searchDate = this.getSearchDate(dateTime)
      this.isLoading = true
      this.$api.finance.queryShopList({
        ...searchDate,
        ...other,
        ...page
      }).then(res => {
        this.isLoading = false
        if (res.totalCount) {
          const { data, totalCount } = res
          this.pageInfo.totalNum = totalCount
          this.tableList = data || []
        } else {
          this.tableList = res || []
        }
      })
    },
    /**
		 * 删除单条表格数据
		 * @id {Number}
		 */
    deleteHandle(id) {
      this.$api.finance.deleteFinance({ id }).then(() => {
        this.$msgTip('删除成功')
        this.fetchData()
      })
    }
  }
}
</script>
