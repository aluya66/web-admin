<template>
  <c-view>
    <template v-slot:header>
      <div class="title">{{$route.meta.name || $t(`route.${$route.meta.title}`)}}</div>
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
     <div v-if="dialogObj.isShow">
      <c-dialog
        :is-show="dialogObj.isShow"
        :title="dialogObj.title"
        close-btn
        noBtn
        @before-close="dialogObj.isShow = false"
      >
        <c-details ref="childRef" :init-data.sync="dialogObj.initData"></c-details>
      </c-dialog>
    </div>
  </c-view>
</template>
<script>
import mixinTable from 'mixins/table'
import dictObj from '@/store/dictData'
import CDialog from 'components/dialog'
import CDetails from './detail'
const refundStatusList = [
  {
    label: '未退款',
    value: 0
  }, {
    label: '已退款',
    value: 1
  }
]

// const afterTypeList = [
//   {
//     label:'仅退款',
//     value: 0
//   },{
//     label:'退货退款',
//     value: 1
//   }
// ]

const refundTypeList = [
  {
    label: '余额',
    value: 1
  }, {
    label: '星购卡',
    value: 2
  }, {
    label: '代金券',
    value: 3
  }
]

export default {
  name: 'reshipList',
  mixins: [mixinTable],
  components: {
    CDialog,
    CDetails
  },
  data(vm) {
    return {
      exportLoading: false,
      logisticsList: [],
      shopsList: [],
      // 对话框对象
      dialogObj: {},
      // 表格内操作按钮
      tableInnerBtns: [
        {
          name: '详情',
          icon: 'el-icon-show',
          handle(row) {
            vm.getDetail(row)
          }
        }
      ],
      // 表格内操作按钮
      tableHeader: [
        {
          label: '售后单号',
          prop: 'afterOrder',
          search: {
            type: 'input'
          }
        },
        {
          label: '退款单号',
          prop: 'refundOrder',
          search: {
            type: 'input'
          }
        },
        {
          label: '用户电话',
          prop: 'userPhone',
          search: {
            type: 'input'
          }
        },
        {
          label: '用户名称',
          prop: 'userName'
        },
        {
          label: '状态',
          prop: 'status',
          formatter(row) {
            return row && vm.setTableColumnLabel(row.status, refundStatusList)
          },
          search: {
            type: 'select',
            optionsList: refundStatusList
          }
        },
        {
          label: '售后类型',
          prop: 'afterSalesType',
          formatter(row) {
            return row && vm.setTableColumnLabel(row.refundType, dictObj.afterSalesTypes)
          },
          search: {
            prop: 'applyAfterSalesType',
            type: 'dict',
            optionsList: dictObj.afterSalesTypes
          }
        },
        {
          label: '店铺',
          prop: 'storeName',
          search: {
            type: 'dict',
            optionsList: [],
            prop: 'storeId'
          }
        },
        {
          label: '退款方式',
          prop: 'refundType',
          formatter(row) {
            return row && vm.setTableColumnLabel(row.refundType, refundTypeList)
          },
          search: {
            prop: 'refundType',
            type: 'dict',
            optionsList: refundTypeList
          }
        },
        {
          label: '退款金额',
          prop: 'refundFee'
        },
        {
          width: 150,
          label: '售后时间',
          prop: 'afterTime',
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
    this.getShopList()
  },
  methods: {
    getShopList() {
      this.$api.channel
        .getShopList({
          pageSize: 200,
          pageNo: 1
        })
        .then(res => {
          this.isLoading = false
          if (res && res.totalCount) {
            const { data } = res
            this.shopsList = data && data.map(val => ({ label: val.shopName, value: val.shopId }))
          } else {
            this.shopsList = res && res.map(val => ({ label: val.shopName, value: val.shopId }))
          }
          this.setSearchOptionsList('storeId', this.shopsList)
        })
    },
    getDetail(row) {
      console.log('当前详情====', row)
      this.showDialog({
        title: '详情',
        initData: row
      })
    },
    /**
     * dialog对话框数据处理
     * @opts {*}
     */
    showDialog(opts) {
      this.dialogObj = {
        isShow: true,
        title: opts.title || '新增',
        initData: opts.initData
      }
    },
    /*
     * 查询表格列表数据
     */
    fetchData() {
      const { totalNum, ...page } = this.pageInfo
      const { dateTime, ...other } = this.searchObj
      const searchDate = this.getSearchDate(
        dateTime,
        'dateTime',
        'startTime',
        'endTime'
      )
      this.isLoading = true
      this.$api.order
        .queryRefundList({
          ...searchDate,
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
<style>
</style>
