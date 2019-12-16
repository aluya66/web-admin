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
// import dictObj from '@/store/dictData'

export default {
  name: 'finance',
  mixins: [mixinTable],
  data(vm) {
    return {
      tableInnerBtns: [{
        name: '编辑',
        icon: 'el-icon-edit',
        handle(row) {
          // TODO...
          vm.routerLink(`/finance/detail/${row.id}`)
        }
      },
      {
        name: '删除',
        icon: 'el-icon-delete',
        handle(row) {
          const { name, id } = row
          vm.confirmTip(`是否删除【${name}】`, () => {
            vm.deleteHandle(id)
          })
        }
      }],
      // 表格内操作按钮
      tableHeader: [
        {
          label: '支付单号',
          prop: '',
          search: {
            type: 'input'
          }
        },
        {
          label: '兑换码',
          prop: '',
          search: {
            type: 'input'
          }
        },
        {
          label: '用户',
          prop: '',
          search: {
            type: 'input'
          }
        },
        {
          label: '手机号',
          prop: '',
          search: {
            type: 'input'
          }
        },
        {
          label: '金额',
          prop: 'faceValue'
        },
        {
          label: '赠送金额',
          prop: 'givingValue'
        },
        {
          label: '类型',
          prop: '',
          search: {
            type: 'dict'
          }
        },
        {
          label: '开卡店员',
          prop: 'opCreator',
          search: {
            type: 'input'
          }
        },
        {
          label: '创建时间',
          prop: 'created',
          search: {
            type: 'dateTime',
            prop: 'dateTime'
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
      this.$api.marketing.queryCouponCard({
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
