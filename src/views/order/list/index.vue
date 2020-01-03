<template>
  <c-view>
    <template v-slot:header>
      <div class="title">{{$route.meta.name || $t(`route.${$route.meta.title}`)}}</div>
    </template>
    <div class="main__box">
      <c-table
        ref="cTable"
        selection
        hasIndex
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
          <div class="header-btn">
            <order-info>1212</order-info>
            <el-radio-group v-model="tabValue">
              <el-radio-button
                v-for="(item, index) in tabList"
                :key="index"
                :label="item.value"
              >{{item.label}}</el-radio-button>
            </el-radio-group>
          </div>
        </template>
      </c-table>
    </div>
  </c-view>
</template>

<script>
import mixinTable from 'mixins/table'
import OrderInfo from './info'
// import dictObj from '@/store/dictData'

export default {
  name: 'orderList',
  mixins: [mixinTable],
  components: {
    OrderInfo
  },
  data(vm) {
    return {
      tabValue: 0, // tab订单状态id
      tabList: [{
        value: 0,
        label: '全部订单xxx'
      }, {
        value: 1,
        label: '待支付xxx'
      }, {
        value: 2,
        label: '待发货xxx'
      }, {
        value: 3,
        label: '待收货xxx'
      }, {
        value: 4,
        label: '待评价xxx'
      }, {
        value: 5,
        label: '已完成xxx'
      }, {
        value: 6,
        label: '已取消xxx'
      }, {
        value: 7,
        label: '售后中xxx'
      }, {
        value: 8,
        label: '已售后xxx'
      }], // tab订单状态集合
      tableInnerBtns: [{
        name: '编辑',
        icon: 'el-icon-edit',
        handle(row) {
          // TODO...
          vm.routerLink(`/order/detail/${row.id}`)
        }
      },
      {
        name: '删除',
        icon: 'el-icon-delete',
        handle(row) {
          const { name, id } = row
          vm.confirmTip(`是否删除【${name}】`, () => {
            vm.deleteHandle({ id })
          })
        }
      }],
      // 表格内操作按钮
      tableHeader: [
        {
          label: '订单号',
          fixed: true,
          prop: '',
          search: {
            type: 'input'
          }
        },
        {
          label: '子订单号',
          prop: '',
          search: {
            type: 'input'
          }
        },
        {
          label: '配送方式',
          prop: ''
        },
        {
          label: '支付方式',
          prop: '',
          formatter(row) {
            return row && vm.setTableColumnLabel('', '')
          },
          search: {
            type: 'dict',
            optionsList: []
          }
        },
        {
          label: '订单状态',
          prop: '',
          formatter(row) {
            return row && vm.setTableColumnLabel('', '')
          },
          search: {
            type: 'dict',
            optionsList: []
          }
        },
        {
          label: '结算状态',
          prop: '',
          formatter(row) {
            return row && vm.setTableColumnLabel('', '')
          }
        },
        {
          label: '订单渠道',
          prop: '',
          formatter(row) {
            return row && vm.setTableColumnLabel('', '')
          },
          search: {
            type: 'dict',
            optionsList: []
          }
        },
        {
          label: '订单类型',
          prop: '',
          formatter(row) {
            return row && vm.setTableColumnLabel('', '')
          },
          search: {
            type: 'dict',
            optionsList: []
          }
        },
        {
          label: '支付单号',
          prop: '',
          search: {
            type: 'input'
          }
        },
        {
          label: '订单金额',
          prop: '',
          search: {
            label: '物流单号',
            type: 'input',
            prop: ''
          }
        },
        {
          label: '订单实付金额',
          prop: '',
          search: {
            type: 'input',
            label: '店铺',
            prop: ''
          }
        },
        {
          label: '优惠券金额',
          prop: '',
          search: {
            type: 'input',
            label: '客户手机',
            prop: ''
          }
        },
        {
          label: '售后金额',
          prop: '',
          formatter(row) {
            return row && vm.setTableColumnLabel('', '')
          },
          search: {
            label: '售后状态',
            prop: '',
            type: 'dict',
            optionsList: []
          }
        },
        {
          label: '余额金额',
          prop: ''
        },
        {
          label: '星GO卡金额',
          prop: '',
          search: {
            label: '下单时间',
            prop: 'dateTime',
            type: 'dateTime'
          }
        }
      ]
    }
  },
  created() {
    // this.fetchData()
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
      this.$api.order.queryOrderList({
        ...searchDate,
        ...other,
        ...page
      }).then(res => {
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
    /**
		 * 删除单条表格数据
		 * @id {Number}
		 */
    deleteHandle(params) {
      this.$api.order.deleteOrder(params).then(() => {
        this.$msgTip('删除成功')
        this.delResetData()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-tabs--border-card {
  border-bottom: none;
  .el-tabs__content {
    padding: 0;
  }
}
</style>
