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
    <div v-if="dialogObj.isShow">
      <c-dialog
        :is-show="dialogObj.isShow"
        :title="dialogObj.title"
        close-btn
        no-btn
        @before-close="dialogObj.isShow = false"
      >
        <order-add ref="childRef" :init-data.sync="dialogObj.initData" :is-edit="dialogObj.isEdit"></order-add>
      </c-dialog>
    </div>
  </c-view>
</template>

<script>
import mixinTable from 'mixins/table'
import CDialog from 'components/dialog'
import dictObj from '@/store/dictData'
import OrderAdd from './add'

// 支付状态
const payStatusList = [{
  label: '未支付',
  value: 0
}, {
  label: '已支付',
  value: 1
}]

export default {
  name: 'orderManagePay',
  mixins: [mixinTable],
  components: {
    CDialog,
    OrderAdd
  },
  data(vm) {
    return {
      // 对话框对象
      dialogObj: {},
      // 表格内操作按钮
      tableInnerBtns: [
        {
          name: '明细',
          icon: 'el-icon-view',
          handle(row) {
            vm.showDialog({
              title: '支付单明细',
              initData: row
            })
          }
        }
      ],
      tableHeader: [
        {
          label: '支付单号',
          prop: 'flowCode',
          search: {
            type: 'input'
          }
        },
        {
          label: '第三方支付单号',
          prop: 'thirdPartyPaycode',
          search: {
            label: '第三方单号',
            type: 'input'
          }
        },
        {
          label: '支付状态',
          prop: 'status',
          formatter(row) {
            return row && vm.setTableColumnLabel(row.status, payStatusList)
          },
          search: {
            type: 'dict',
            optionsList: payStatusList
          }
        },
        {
          label: '支付方式',
          prop: 'payType',
          formatter(row) {
            return row && vm.setTableColumnLabel(row.payType, 'payTypeList')
          }
        },
        {
          label: '单据类型',
          prop: 'orderBusinessType',
          formatter(row) {
            return row && vm.setTableColumnLabel(row.orderBusinessType, 'orderBusinessTypeList')
          },
          search: {
            type: 'dict',
            optionsList: dictObj.orderBusinessTypeList
          }
        },
        {
          label: '用户手机号',
          prop: 'buyerMobile',
          search: {
            type: 'input'
          }
        },
        {
          label: '金额',
          prop: 'payAmount'
        },
        {
          label: '支付时间',
          prop: 'created',
          width: 100,
          search: {
            type: 'dateTime',
            prop: 'dateTime',
            dateType: 'datetimerange'
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
      const searchDate = this.getSearchDate(dateTime, 'dateTime', 'beginTime', 'endTime')
      this.isLoading = true
      this.$api.order.queryOrderpayList({
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
     * dialog对话框数据处理
     * @opts {*}
     */
    showDialog(opts) {
      this.dialogObj = {
        isShow: true,
        isEdit: opts.isEdit || false,
        title: opts.title,
        initData: opts.initData
      }
    }
  }
}
</script>
