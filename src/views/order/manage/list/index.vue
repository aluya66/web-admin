<template>
  <c-view>
    <template v-slot:header>
      <div class="title">{{$route.meta.name || $t(`route.${$route.meta.title}`)}}</div>
      <div class="header-btn">
        <el-button
          :size="size"
          type="primary"
          :loading="exportLoading"
          icon="el-icon-download"
          @click="exportFile"
        >导出</el-button>
      </div>
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
          <el-radio-group v-model="searchObj.orderStatus" @change="statusOnchange">
            <el-radio-button
              v-for="(item, index) in statusTabList"
              :size="size"
              :key="index"
              :label="item.value"
            >{{item.label}}({{item.counts}})</el-radio-button>
          </el-radio-group>
        </template>
      </c-table>
    </div>
    <div v-if="detailDialog.isShow">
      <c-dialog
        :is-show="detailDialog.isShow"
        close-btn
        @before-close="detailDialog.isShow = false"
        noBtn
        :title="detailDialog.title"
      >
        <detail-dialog
          ref="detailRef"
          :init-data.sync="detailDialog.initData"
        ></detail-dialog>
      </c-dialog>
    </div>
    <!--设置延迟收货弹框-->
    <div v-if="delayDialog.isShow">
      <c-dialog
        :is-show="delayDialog.isShow"
        close-btn
        @before-close="delayDialog.isShow = false"
        :title="delayDialog.title"
        @on-submit="delayDayConfirm"
      >
       <el-radio-group v-model="delayDay">
        <el-radio-button
          :label="item.value"
          v-for="(item,index) in delayGrp"
          :key="index">
          {{item.label}}
        </el-radio-button>
      </el-radio-group>
      </c-dialog>
    </div>
    <div v-if="dialogObj.isShow">
      <c-dialog
        :is-show="dialogObj.isShow"
        :title="dialogObj.title"
        close-btn
        @before-close="dialogObj.isShow = false"
        @on-submit="dialogConfirm"
        :noBtn="dialogObj.type!=='edit'"
      >
        <dialog-info
          ref="childRef"
          v-if="dialogObj.type==='edit'"
          :init-data.sync="dialogObj.initData"
          :area-options="areaOptions"
          :is-edit="dialogObj.isEdit"
        ></dialog-info>
        <export-tip v-else @handle="dialogObj.isShow=false"></export-tip>
      </c-dialog>
    </div>
  </c-view>
</template>

<script>
import mixinTable from 'mixins/table'
import OrderInfo from './info'
import CDialog from 'components/dialog'
import DetailDialog from './detailDialog'
import DialogInfo from './dialogInfo'
import dictObj from '@/store/dictData'
import ExportTip from '../../../common/exportTip.vue'

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
    DialogInfo,
    DetailDialog,
    ExportTip
  },
  data(vm) {
    return {
      dialogObj: {},
      delayGrp: [{
        label: '3天',
        value: 1
      }, {
        label: '7天',
        value: 2
      }, {
        label: '15天',
        value: 3
      }],
      delayDay: 1,
      exportLoading: false,
      detailDialog: {}, // 详情弹框
      delayDialog: {}, // 设置延迟收货弹框
      listInfo: {}, // 列表统计数据
      orderStatus: '', // 订单状态
      areaOptions: [], // 全部区域集合
      statusTabList: [{
        value: '',
        label: '全部订单',
        counts: 0
      }, {
        value: 80,
        label: '待付款',
        counts: 0
      }, {
        value: 81,
        label: '待发货',
        counts: 0
      }, {
        value: 82,
        label: '待签收',
        counts: 0
      }, {
        value: 60,
        label: '已完成',
        counts: 0
      }, {
        value: 50,
        label: '已取消',
        counts: 0
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
            type: 'edit',
            isEdit: true
          })
        }
      },
      {
        name: '延时收货',
        notBtn(row) {
          // 待签收
          return row.orderStatus !== 82 || (row.orderStatus === 82 && row.prolongSignStatus !== 0) // 0：未延长；1：延长3天；2：延长7天 ；3：延长15天
        },
        handle(row) {
          vm.delayDialog = {
            isShow: true,
            title: '设置延时收货时间',
            orderCode: row.parentCode
          }
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
          fixed: true,
          width: 150,
          search: {
            type: 'input'
          },
          handle(row) {
            vm.detailDialog = {
              isShow: true,
              title: '商品信息',
              initData: {
                orderCode: row.orderCode
              }
            }
          }
        },
        {
          label: '售后状态',
          prop: 'afterSaleStatus',
          formatter(row) {
            return row && vm.setTableColumnLabel(row.afterSaleStatus, 'afterSaleStatusList')
          },
          search: {
            type: 'dict',
            optionsList: afterSalesTabList
          }
        },
        {
          label: '配送方式',
          prop: 'deliveryTimeType',
          formatter(row) {
            return row && vm.setTableColumnLabel(row.deliveryTimeType, 'deliveryTimeTypeList')
          },
          search: {
            type: 'input',
            label: '收货人信息',
            prop: 'searchReceiveInfo'
          }
        },
        // {
        //   label: '支付方式',
        //   prop: 'payType',
        //   formatter(row) {
        //     // row.payType  这里可返回多个方式，要转化成数组形式进行转化处理
        //     return row && vm.setTableColumnLabel(row.payType.split(','), 'payTypeList')
        //   },
        //   search: {
        //     type: 'dict',
        //     optionsList: dictObj.payTypeList
        //   }
        // },
        {
          label: '支付状态', // 0:未付款  2：支付完成
          prop: 'payStatus',
          formatter(row) {
            return row && vm.setTableColumnLabel(row.payStatus, 'orderPayStatusList')
          },
          search: {
            type: 'dict',
            optionsList: dictObj.orderPayStatusList
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
            multiple: true,
            prop: 'orderStatusSet',
            optionsList: dictObj.orderStatusList
          }
        },
        // {
        //   label: '结算状态',
        //   prop: 'settleStatus',
        //   formatter(row) {
        //     return row && vm.setTableColumnLabel(row.settleStatus, 'orderSettleStatusList')
        //   }
        // },
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
        // {
        //   label: '订单类型',
        //   prop: 'orderCategory',
        //   formatter(row) {
        //     return row && vm.setTableColumnLabel(row.orderCategory, 'shopTypeList')
        //   },
        //   search: {
        //     type: 'dict',
        //     optionsList: dictObj.shopTypeList
        //   }
        // },
        // {
        //   label: '支付单号',
        //   prop: 'flowCode',
        //   search: {
        //     type: 'input'
        //   }
        // },
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
            type: 'input',
            label: '第三方交易流水号',
            prop: 'thirdPartyPaycode'
          }
        },
        {
          label: '余额金额(元)',
          prop: 'walletAmount',
          search: {
            label: '订单商品SKU',
            prop: 'starasSkuCode',
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
            type: 'dateTime'
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
        type: opts.type,
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
            let counts = ''
            switch (info.value) {
              case '':
                counts = res.orderQuantity
                break
              case 80:
                counts = res.unpaidQuantity
                break
              case 81:
                counts = res.unfilledOrderQuantity
                break
              case 82:
                counts = res.noReceivedQuantity
                break
              case 83:
                counts = res.noEvaluationQuantity
                break
              case 60:
                counts = res.completedQuantity
                break
              case 50:
                counts = res.cancelQuantity
                break
            }
            return {
              ...info,
              counts
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
      const searchDate = this.getSearchDate(dateTime, '', 'beginTime', 'endTime')
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
    // 切换订单状态，更新订单统计数据
    statusOnchange() {
      this.getOrderInfo()
    },
    // 设置延时收货时间
    delayDayConfirm() {
      const params = {
        orderCode: this.delayDialog.orderCode,
        prolongSignStatus: this.delayDay // 延长收货时间（0：未延长  1：延长3天  2：延长7天   3：延长15天
      }
      this.$api.order.delayReceiveGoods(params).then(res => {
        this.delayDialog.isShow = false
        this.fetchData()
      })
    },
    // 导出文件
    exportFile() {
      const { dateTime, ...other } = this.searchObj
      const searchDate = this.getSearchDate(dateTime, '', 'beginTime', 'endTime')
      this.exportLoading = true
      this.$api.order.orderListExport({
        ...searchDate,
        ...other
      }).then(res => {
        if (res) {
          this.showDialog({
            title: '订单导出'
          })
        } else {
          this.$msgTip('导出数据失败', 'warning')
        }
        this.exportLoading = false
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
