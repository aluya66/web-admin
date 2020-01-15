<template>
  <c-view>
    <template v-slot:header>
      <div class="title">{{$route.meta.name || $t(`route.${$route.meta.title}`)}}</div>
    </template>
    <div class="main__box">
      <order-info :init-data.sync="listInfo"></order-info>
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
          <el-radio-group v-model="searchObj.orderStatus">
            <el-radio-button
              v-for="(item, index) in statusTabList"
              :size="size"
              :key="index"
              :label="item.value"
            >{{item.label}}</el-radio-button>
          </el-radio-group>
        </template>
      </c-table>
    </div>
    <div v-if="dialogObj.isShow">
      <c-dialog
        :is-show="dialogObj.isShow"
        :title="dialogObj.title"
        close-btn
        @before-close="dialogObj.isShow = false"
        @on-submit="dialogConfirm"
      >
        <dialog-info
          ref="childRef"
          :init-data.sync="dialogObj.initData"
          :area-options="areaOptions"
          :is-edit="dialogObj.isEdit"
        ></dialog-info>
      </c-dialog>
    </div>
  </c-view>
</template>

<script>
import mixinTable from 'mixins/table'
import OrderInfo from './info'
import CDialog from 'components/dialog'
import DialogInfo from './dialogInfo'
import dictObj from '@/store/dictData'

// 售后状态
const afterSalesTabList = [{
  value: 52,
  label: '售后中'
}, {
  value: 6,
  label: '已售后'
}]

export default {
  name: 'orderManageList',
  mixins: [mixinTable],
  components: {
    OrderInfo,
    CDialog,
    DialogInfo
  },
  data(vm) {
    return {
      dialogObj: {},
      listInfo: {}, // 列表统计数据
      orderStatus: '', // 订单状态
      areaOptions: [], // 全部区域集合
      afterSaleStatus: '', // 售后状态
      statusTabList: [{
        value: '',
        label: '全部订单'
      }, {
        value: 80,
        label: '待付款'
      }, {
        value: 81,
        label: '待发货'
      }, {
        value: 82,
        label: '待签收'
      }, {
        value: 60,
        label: '已完成'
      }, {
        value: 50,
        label: '已取消'
      }], // tab订单状态集合
      tableInnerBtns: [{
        width: 180,
        name: '详情',
        icon: 'el-icon-view',
        handle(row) {
          vm.routerLink(`/order/manage/detail/${row.orderCode}`)
        }
      },
      {
        name: '编辑',
        icon: 'el-icon-edit',
        notBtn(row) {
          // 待付款和待发货显示
          return row.orderStatus !== 80 && row.orderStatus !== 81
        },
        handle(row) {
          vm.showDialog({
            initData: {
              orderTotalAmount: row.orderTotalAmount,
              orderCode: row.orderCode
            },
            isEdit: true
          })
        }
      },
      {
        name: '取消',
        icon: 'el-icon-close',
        notBtn(row) {
          // 待付款时可以取消
          return row.orderStatus !== 80
        },
        handle(row) {
          const { parentCode } = row
          vm.confirmTip(`是否确认取消【${parentCode}】订单`, () => {
            vm.cancelHandle({ parentCode })
          })
        }
      }],
      // 表格内操作按钮
      tableHeader: [
        {
          label: '父订单编号',
          fixed: true,
          prop: 'parentCode',
          width: 140,
          search: {
            type: 'input'
          }
        },
        {
          label: '订单编号',
          prop: 'orderCode',
          width: 150,
          search: {
            type: 'input'
          }
        },
        {
          label: '配送方式',
          prop: 'deliveryTimeType',
          formatter(row) {
            return row && vm.setTableColumnLabel(row.deliveryTimeType, 'deliveryTimeTypeList')
          }
        },
        {
          label: '支付方式',
          prop: 'payType',
          formatter(row) {
            return row && vm.setTableColumnLabel(row.payType, 'payTypeList')
          },
          search: {
            type: 'dict',
            optionsList: dictObj.payTypeList
          }
        },
        {
          label: '订单状态',
          prop: 'orderStatus',
          formatter(row) {
            return row && vm.setTableColumnLabel(row.orderStatus, 'orderStatusList')
          },
          search: {
            type: 'dict',
            optionsList: dictObj.orderStatusList
          }
        },
        {
          label: '结算状态',
          prop: 'settleStatus',
          formatter(row) {
            return row && vm.setTableColumnLabel(row.settleStatus, 'orderSettleStatusList')
          }
        },
        {
          label: '订单渠道',
          prop: 'appCode',
          formatter(row) {
            return row && vm.setTableColumnLabel(row.appCode, 'lobList')
          },
          search: {
            type: 'dict',
            optionsList: dictObj.lobList
          }
        },
        {
          label: '订单类别',
          prop: 'orderCategory',
          formatter(row) {
            return row && vm.setTableColumnLabel(row.orderCategory, 'shopTypeList')
          },
          search: {
            type: 'dict',
            optionsList: dictObj.shopTypeList
          }
        },
        {
          label: '支付单号',
          prop: 'thirdPartyPaycode',
          search: {
            type: 'input'
          }
        },
        {
          label: '订单金额(元)',
          prop: 'orderTotalAmount',
          search: {
            label: '物流单号',
            type: 'input',
            prop: 'deliveryNo'
          }
        },
        {
          label: '订单实付金额(元)',
          prop: 'actualAmount',
          width: 130,
          search: {
            type: 'input',
            label: '店铺',
            prop: 'storeName'
          }
        },
        {
          label: '优惠券金额(元)',
          prop: 'couponAmount',
          search: {
            type: 'input',
            label: '客户手机',
            prop: 'buyerMobile'
          }
        },
        {
          label: '售后金额(元)',
          prop: 'afterSalesAmount',
          search: {
            label: '售后状态',
            prop: 'afterSaleStatus',
            type: 'dict',
            optionsList: afterSalesTabList
          }
        },
        {
          label: '余额金额(元)',
          prop: 'walletAmount',
          search: {
            label: '订单商品SKU',
            prop: 'productSkuCode',
            type: 'input'
          }
        },
        {
          label: '星GO卡金额(元)',
          prop: 'storedCardAmount',
          width: 130,
          search: {
            label: '下单时间',
            prop: 'dateTime',
            type: 'dateTime',
            dateType: 'datetimerange'
          }
        }
      ]
    }
  },
  created() {
    this.fetchData()
    this.getOrderInfo()
    this.fetchAreaData()
  },
  watch: {
    afterSaleStatus(newVal, oldVal) {
      this.searchReset()
    },
    'searchObj.orderStatus'(newVal, oldVal) {
      // this.searchObj.orderStatus = newVal
      this.searchReset()
    }
  },
  methods: {
    dialogConfirm() {
      const childRef = this.$refs.childRef
      childRef.$refs.formRef.validate(valid => {
        if (valid) {
          const { orderTotalAmount, addressCode, ...other } = childRef.formModel
          this.$api.order.editAddressInfo({
            provinceCode: addressCode[0],
            cityCode: addressCode[1],
            regionCode: addressCode[2],
            ...other
          }).then(() => {
            this.responeHandle('更新成功')
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    /**
     *  获取全部区域数据
    */
    fetchAreaData() {
      this.$api.basic.getAllArea().then(res => {
        if (res && res.length) {
          this.areaOptions = res
        }
      })
    },
    /**
		 * 管理平台手动取消订单
		 * @id {Number}
		 */
    cancelHandle(params) {
      this.$api.order.cancelOrder(params).then(() => {
        this.$msgTip('取消成功')
        this.fetchData()
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
        title: opts.title || '编辑收货人信息',
        initData: opts.initData
      }
    },
    /*
     *  获取统计信息
     */
    getOrderInfo() {
      this.$api.order.queryOrderInfo().then(res => {
        if (res) {
          this.listInfo = res
          this.statusTabList = this.statusTabList.map(info => {
            let label = ''
            switch (info.value) {
              case '':
                label = `${info.label}${res.orderQuantity}`
                break
              case 80:
                label = `${info.label}${res.unpaidQuantity}`
                break
              case 81:
                label = `${info.label}${res.unfilledOrderQuantity}`
                break
              case 82:
                label = `${info.label}${res.noReceivedQuantity}`
                break
              case 83:
                label = `${info.label}${res.noEvaluationQuantity}`
                break
              case 60:
                label = `${info.label}${res.completedQuantity}`
                break
              case 50:
                label = `${info.label}${res.cancelQuantity}`
                break
            }
            return {
              ...info,
              label
            }
          })
        }
      })
    },
    /*
	   * 查询表格列表数据
	   */
    fetchData() {
      const { totalNum, ...page } = this.pageInfo
      const { dateTime, ...other } = this.searchObj
      const searchDate = this.getSearchDate(dateTime, 'dateTime', 'beginTime', 'endTime')
      this.isLoading = true
      this.$api.order.queryOrderList({
        ...searchDate,
        ...other,
        ...page,
        afterSaleStatus: this.afterSaleStatus
        // orderStatus: orderStatus || this.orderStatus
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
.radio-list {
  margin-left: 10px;
}
</style>
