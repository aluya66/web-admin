<template>
  <c-view>
    <template v-slot:header>
      <div class="title">{{$route.meta.name || $t(`route.${$route.meta.title}`)}}</div>
      <el-button
        :size="size"
        type="primary"
        :loading="exportLoading"
        icon="el-icon-download"
        @click="exportFile"
      >导出</el-button>
    </template>
    <div class="main__box">
      <c-table
        ref="cTable"
        hasIndex
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
        no-btn
        @before-close="dialogObj.isShow = false"
      >
        <c-details v-if="dialogObj.type === 1" ref="childRef" :init-data.sync="dialogObj.initData"></c-details>
        <export-tip v-else @handle="dialogObj.isShow=false"></export-tip>
      </c-dialog>
    </div>
  </c-view>
</template>
<script>
import mixinTable from 'mixins/table'
import CDialog from 'components/dialog'
import CDetails from './details'
import dictObj from '@/store/dictData'
import ExportTip from '../../../common/exportTip.vue'
export default {
  name: 'reshipList',
  mixins: [mixinTable],
  components: {
    CDialog,
    CDetails,
    ExportTip
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
            vm.getDetail(row.afterSalesCode)
          }
        }
      ],
      // 表格内操作按钮
      tableHeader: [
        {
          label: '售后单号',
          prop: 'afterSalesCode',
          search: {
            type: 'input'
          },
          fixed: true
        },
        {
          label: '订单号',
          prop: 'thirdOrderCode',
          search: {
            type: 'input'
          },
          fixed: true
        },
        {
          label: '退货单号',
          prop: 'returnCode',
          fixed: true,
          search: {
            type: 'input'
          }
        },
        {
          label: '状态',
          prop: 'status',
          formatter(row) {
            return row && vm.setTableColumnLabel(row.status, dictObj.afterSalesStatus)
          },
          search: {
            prop: 'statusList',
            type: 'dict',
            optionsList: dictObj.afterSalesStatus
          }
        },
        {
          label: '操作状态',
          prop: 'actionStatusName'
        },
        {
          label: '售后类型',
          prop: 'afterSalesType',
          formatter(row) {
            return row && vm.setTableColumnLabel(row.applyAfterSalesType, dictObj.afterSalesTypes)
          },
          search: {
            prop: 'applyAfterSalesType',
            type: 'dict',
            optionsList: [{
              label: '退款退货',
              value: 2
            }]
          }
        },
        {
          label: '应退金额',
          prop: 'totalActualRefundAmount'
        },
        {
          label: '实退金额',
          prop: 'realRefundAmount'
        },
        {
          label: '所属店铺',
          prop: 'storeName',
          search: {
            type: 'dict',
            optionsList: [],
            label: '物流',
            prop: 'deliveryCode'
          }
        },
        {
          label: '用户电话',
          prop: 'buyerMobile',
          search: {
            type: 'input'
          }
        },
        {
          label: '受理人',
          prop: 'updateName',
          search: {
            type: 'input',
            prop: 'updateName'
          }
        },
        {
          label: '物流公司',
          prop: 'deliveryName',
          search: {
            label: '店铺',
            type: 'dict',
            prop: 'storeId',
            optionsList: []
          }
        },
        {
          label: '物流单号',
          prop: 'deliveryNo'
        },
        {
          width: 150,
          label: '申请时间',
          prop: 'created',
          search: {
            type: 'dateTime',
            prop: 'dateTime'
          }
        },
        {
          width: 150,
          label: '更新时间',
          prop: 'updated'
        }
      ]
    }
  },
  created() {
    this.fetchData()
    this.getShopList()
    this.getLogistics()
  },
  methods: {
    exportFile() {
      const { dateTime, statusList, ...other } = this.searchObj
      const searchDate = this.getSearchDate(
        dateTime,
        'dateTime',
        'startCreated',
        'endCreated'
      )
      this.exportLoading = true
      this.$api.order.reshipExport({
        ...searchDate,
        statusList: [statusList],
        ...other
      }).then(res => {
        if (res) {
          this.showDialog({
            title: '退货单导出',
            type: 2
          })
        } else {
          this.$msgTip('导出数据失败', 'warning')
        }
        this.exportLoading = false
      })
    },
    getLogistics() {
      this.$api.basic
        .getLogistics({
          pageSize: 100,
          pageNo: 1
        })
        .then(res => {
          this.isLoading = false
          if (res && res.totalCount) {
            const { data } = res
            this.logisticsList = data && data.map(val => ({ label: val.logiName, value: val.logiCode }))
          } else {
            this.logisticsList = res && res.map(val => ({ label: val.logiName, value: val.logiCode }))
          }
          this.setSearchOptionsList('deliveryCode', this.logisticsList)
        })
    },
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
    getDetail(afterSalesCode) {
      this.$api.order
        .afterSalesDetail({
          afterSalesCode
        })
        .then(res => {
          this.isLoading = false
          this.showDialog({
            initData: res,
            type: 1
          })
        })
    },
    /*
     * 查询表格列表数据
     */
    fetchData() {
      const { totalNum, ...page } = this.pageInfo
      const { dateTime, statusList, ...other } = this.searchObj
      const searchDate = this.getSearchDate(
        dateTime,
        'dateTime',
        'startCreated',
        'endCreated'
      )
      this.isLoading = true
      this.$api.order
        .queryAfterSalesList({
          ...searchDate,
          statusList: [statusList],
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
    },
    /**
     * dialog对话框数据处理
     * @opts {*}
     */
    showDialog(opts) {
      this.dialogObj = {
        isShow: true,
        title: opts.title || '退货单查看',
        initData: opts.initData,
        type: opts.type
      }
    }
  }
}
</script>
<style>
</style>
