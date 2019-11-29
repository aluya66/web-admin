<template>
  <c-view>
    <template v-slot:header>
			<div class="title">
				{{ $route.meta.name || $t(`route.${$route.meta.title}`) }}
			</div>
		</template>
    <div class="main__box">
      <c-table
        ref="cTable"
        selection
        hasBorder
        :size="size"
        :max-height="730"
        :loading="isLoading"
        :table-header="tableHeader"
        :table-list="tableList"
        :page-info="pageInfo"
        :table-inner-btns="tableInnerBtns"
        @change-pagination="changePagination"
      >
        <template v-slot:header>
          <el-form :inline="true" :model="searchObj" label-width="100px" class="search">
            <el-form-item label="申请人">
              <el-input
                v-model="searchObj.applicants"
                class="search-item"
                :size="size"
                placeholder="请输入申请人"
                clearable
              />
            </el-form-item>
            <el-form-item label="申请部门">
              <el-input
                v-model="searchObj.applyingDepartment"
                class="search-item"
                :size="size"
                placeholder="请输入申请部门"
                clearable
              />
            </el-form-item>
            <el-form-item label="劵金额">
              <el-input
                v-model="searchObj.couponAmount"
                class="search-item"
                :size="size"
                placeholder="请输入劵金额"
                clearable
              />
            </el-form-item>
            <el-form-item label="门槛金额">
              <el-input
                v-model="searchObj.preferentialAmount"
                class="search-item"
                :size="size"
                placeholder="请输入门槛金额"
                clearable
              />
            </el-form-item>
             <el-form-item label="操作时间">
              <el-date-picker
                :size="size"
                v-model="searchObj.dateTime"
                type="daterange"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                :default-time="['00:00:00', '23:59:59']"
              >align="right"></el-date-picker>
            </el-form-item>

            <!-- <el-form-item label="状态">
              <el-select
                v-model="searchObj.status"
                size="medium"
                class="search-item"
                clearable
                placeholder="店铺状态"
              >
                <el-option
                  v-for="(item, index) in shopStatusSelect"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item>
              <el-button
                type="primary"
                class="search-btn"
                :size="size"
                icon="el-icon-search"
                @click="searchSubmit"
              >查询</el-button>
            </el-form-item>
          </el-form>
        </template>
      </c-table>
    </div>
  </c-view>
</template>

<script>
import mixinTable from 'mixins/table'
import utils from 'utils'

export default {
  name: 'shopList',
  mixins: [mixinTable],
  data (vm) {
    return {
      searchObj: {
        applicants: '', // 申请人
        applyingDepartment: '', // 申请部门
        couponAmount: '', // 劵金额
        preferentialAmount: '', // 门槛金额
        dateTime: '' // 时间
      },
      pickerOptions: utils.pickerOptions,
      dialogObj: {}, // 对话框数据
      applySelect: [{
        label: '正常',
        value: 0
      }, {
        label: '申请取消',
        value: 1
      }, {
        label: '同意取消',
        value: 2
      }, {
        label: '不同意取消',
        value: 3
      }],
      shopStatusSelect: [
        {
          value: '',
          label: ''
        },
        {
          value: '',
          label: ''
        }
      ],
      payStatusSelect: [{
        label: '未付款',
        value: 0
      },
      {
        label: '部分支付',
        value: 1
      }, {
        label: '支付完成',
        value: 2
      }, {
        label: '未退款',
        value: 3
      }, {
        label: '已退款',
        value: 4
      }],
      orderTypeSelect: [{
        label: '父订单',
        value: 0
      },
      {
        label: '正常',
        value: 1
      }, {
        label: '虚拟订单',
        value: 2
      }],
      refundStatusSelect: [{
        label: '未退款',
        value: 0
      },
      {
        label: '退款中',
        value: 1
      }, {
        label: '已退款',
        value: 2
      }],
      logisticSelect: [{
        label: '备货中',
        value: 1
      }, {
        label: '待发货',
        value: 2
      }, {
        label: '部分发货',
        value: 3
      }, {
        label: '已发货',
        value: 4
      }, {
        label: '已签收',
        value: 5
      }],
      orderFlagSelect: [{
        label: '已经取消订单,再成功支付',
        value: -1
      }, {
        label: '已经支付完成，再次支付',
        value: -2
      }, {
        label: '正常订单',
        value: 0
      }, {
        label: '多次支付异常处理中',
        value: 2
      }, {
        label: '处理异常完成',
        value: 10
      }],
      orderStatusSelect: [{
        label: '未审核',
        value: 10
      }, {
        label: '审核通过',
        value: 32
      }, {
        label: '待复核',
        value: 30
      }, {
        label: '审核不通过',
        value: 40
      }, {
        label: '撤销',
        value: 64
      }, {
        label: '交易完成',
        value: 60
      }, {
        label: '订单完结',
        value: 70
      }],
      orderSourceSelect: [{
        label: 'PC',
        value: 1
      }, {
        label: 'Android ',
        value: 2
      }, {
        label: 'IOS',
        value: 3
      }, {
        label: 'wap',
        value: 4
      }],
      signStatusSelect: [{
        label: '未签收',
        value: 1
      }, {
        label: '客户已签收',
        value: 2
      }, {
        label: '客服代签收',
        value: 3
      }],
      transportDirectionSelect: [{
        label: '用户',
        value: 1
      }, {
        label: '供应商',
        value: 2
      }, {
        label: '平台',
        value: 3
      }],
      tableList: [],
      isLoading: false,
      tableInnerBtns: [],
      tableHeader: [
        {
          label: '应付金额',
          prop: 'actualAmount'
        },
        {
          label: '业务线',
          prop: 'appCode'
        },
        {
          label: '审核时间',
          prop: 'approvedTime'
        },
        {
          label: '自动取消',
          prop: 'autoCancel',
          formatter(row) {
            return row.autoCancel === 1 ? '否' : '是'
          }
        },
        {
          label: '最后一次自动提醒发货时间',
          prop: 'autoRemindTime'
        },
        {
          label: '买家邮箱',
          prop: 'buyerEmail'
        },
        {
          label: '买家编号',
          prop: 'buyerId'
        },
        {
          label: '买家联系电话',
          prop: 'buyerMobile'
        },
        {
          label: '买家昵称',
          prop: 'buyerNick'
        },
        {
          label: ' 取消原因',
          prop: 'cancelReason'
        },
        {
          label: '撤销时间-取消时间',
          prop: 'cancelTime'
        },
        {
          label: '已经支付的金额',
          prop: 'confirmPaidAmount'
        },
        {
          label: '劵抵扣金额',
          prop: 'couponAmount'
        },
        {
          label: '创建者',
          prop: 'createBy'
        },
        {
          label: '创建时间',
          prop: 'created'
        },
        {
          label: '删除标记',
          prop: 'delFlag',
          formatter(row) {
            return row.delFlag === 0 ? '否' : '是'
          }
        },
        {
          label: '物流模板ID',
          prop: 'deliveryId'
        },
        {
          label: '配送类型',
          prop: 'deliveryTimeType',
          formatter(row) {
            return row.deliveryTimeType === 1 ? '门店自提' : '快递'
          }
        },
        {
          label: '交易完成时间',
          prop: 'endTime'
        },
        {
          label: '优惠金额',
          prop: 'favorableAmount'
        },
        {
          label: '运费',
          prop: 'freightAmount'
        },
        {
          label: 'IP',
          prop: 'ip'
        },
        {
          label: '申请取消状态',
          prop: 'isApplyCancel',
          formatter(row) {
            return row.isApplyCancel ? vm.applySelect[row.isApplyCancel].label : ''
          }
        },
        {
          label: '商品总金额',
          prop: 'itemTotalAmount'
        },
        {
          label: '物流状态',
          prop: 'logisticStatus',
          formatter(row) {
            return row.logisticStatus ? vm.logisticSelect[row.logisticStatus].label : ''
          }
        },
        {
          label: '订单操作',
          prop: 'operationRecords'
        },
        {
          label: '订单业务类型',
          prop: 'orderBusinessType',
          formatter(row) {
            return row.orderBusinessType === 1 ? '团购' : '普通订购订单 3秒杀'
          }
        },
        {
          label: '订单编号',
          prop: 'orderCode'
        },
        {
          label: '收货地址关联编号',
          prop: 'orderDeliveryAddrId'
        },
        {
          label: '订单详情列表',
          prop: 'orderDetails'
        },
        {
          label: '订单是否正常',
          prop: 'orderFlag',
          formatter(row) {
            return row.orderFlag ? vm.orderFlagSelect[row.orderFlag].label : ''
          }
        },
        {
          label: '订单ID',
          prop: 'orderId'
        },
        {
          label: '发票信息关联编号',
          prop: 'orderInvoiceId'
        },
        {
          label: '订单支付数据',
          prop: 'orderPays'
        },
        {
          label: '订单退款列表',
          prop: 'orderRefunds'
        },
        {
          label: '订单来源',
          prop: 'orderSource',
          formatter(row) {
            return row.orderSource ? vm.orderSourceSelect[row.orderSource].label : ''
          }
        },
        {
          label: '订单状态',
          prop: 'orderStatus',
          formatter (row) {
            return row.orderStatus ? vm.orderStatusSelect[row.orderStatus].label : ''
          }
        },
        {
          label: '订单总金额',
          prop: 'orderTotalAmount'
        },
        {
          label: '订单类型',
          prop: 'orderType',
          formatter(row) {
            return row.orderType ? vm.orderTypeSelect[row.orderType].label : ''
          }
        },
        {
          label: '原始订单，换货原始订单',
          prop: 'originalCode'
        },
        {
          label: '实际还需支付的金额',
          prop: 'paidAmount'
        },
        {
          label: '父订单编号',
          prop: 'parentCode'
        },
        {
          label: '支付状态',
          prop: 'payStatus',
          formatter(row) {
            return row.payStatus ? vm.payStatusSelect[row.payStatus].label : ''
          }
        },
        {
          label: '支付完成时间',
          prop: 'payTime'
        },
        {
          label: '支付子类别',
          prop: 'payType'
        },
        {
          label: '支付父类别',
          prop: 'payTypeCat'
        },
        {
          label: '商品件数',
          prop: 'quantity'
        },
        {
          label: '退款状态',
          prop: 'refundStatus',
          formatter(row) {
            return row.refundStatus ? vm.refundStatusSelect[row.refundStatus].label : ''
          }
        },
        {
          label: '备注',
          prop: 'remark'
        },
        {
          label: '结算时间',
          prop: 'settleTime'
        },
        {
          label: '发货时间',
          prop: 'shippingTime'
        },
        {
          label: '签收状态',
          prop: 'signStatus',
          formatter(row) {
            return row.signStatus ? vm.signStatusSelect[row.signStatus].label : ''
          }
        },
        {
          label: '签收时间',
          prop: 'signTime'
        },
        {
          label: '店铺编号',
          prop: 'storeId'
        },
        {
          label: '第三方订单号',
          prop: 'thirdOrderCode'
        },
        {
          label: '运费承当方',
          prop: 'transportDirection',
          formatter(row) {
            return row.transportDirection ? vm.transportDirectionSelect[row.transportDirection].label : ''
          }
        },
        {
          label: '修改时间',
          prop: 'updated'
        },
        {
          label: '最后一次买家手动提醒发货时间',
          prop: 'userRemindTime'
        }
      ]
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      const { dateTime, ...other } = this.searchObj
      const { totalNum, ...page } = this.pageInfo
      this.isLoading = true
      this.$api.order.getOrder({
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
