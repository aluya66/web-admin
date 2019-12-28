<template>
  <c-view>
    <template v-slot:header>
      <el-page-header
        @back="goBack"
        :content="$route.meta.name || $t(`route.${$route.meta.title}`)"
      ></el-page-header>
    </template>
    <div class="main__box">
      <order-list :init-data.sync="detailData" :is-edit="isEdit"></order-list>
      <template v-if="detailData.detailBusinessSettleVo.settleStatus">
        <!-- 合计 -->
        <el-divider content-position="left">合计：</el-divider>
        <div class="card-info">
          <div class="row">
            <span>销售订单数：{{detailData.detailBusinessSettleVo.sellOrderNum}}</span>
            <span>售后订单数：{{detailData.detailBusinessSettleVo.afterOrderNum}}</span>
          </div>
          <div class="row">
            <span>订单总金额(元)：{{detailData.detailBusinessSettleVo.orderTotalAmount}}</span>
            <span>订单优惠总金额(元)：{{detailData.detailBusinessSettleVo.orderTotalDiscountsAmount}}</span>
            <span>余额抵扣总金额(元)：{{detailData.detailBusinessSettleVo.orderTotalBalance}}</span>
            <span>代金券抵扣总金额(元)：{{detailData.detailBusinessSettleVo.orderTotalVoucherAmount}}</span>
            <span>星购卡支付总金额(元)：{{detailData.detailBusinessSettleVo.storedCardAmount}}</span>
            <span>积分抵扣总金额(元)：{{detailData.detailBusinessSettleVo.payPointAmount}}</span>
            <span>订单实收总金额(元)：{{detailData.detailBusinessSettleVo.actualAmount}}</span>
          </div>
          <div class="row">
            <span>平台服务费总金额(元)：{{detailData.detailBusinessSettleVo.totalServiceFee}}</span>
          </div>
          <div class="row">
            <span>售后退款总金额(元)：{{detailData.detailBusinessSettleVo.afterTotalRefund}}</span>
            <span>实际售后退款总金额(元)：{{detailData.detailBusinessSettleVo.afterActualRetund}}</span>
          </div>
          <div class="row">
            <span>应结算总金额(元)：{{detailData.detailBusinessSettleVo.settleMoney}}</span>
          </div>
        </div>
        <!-- 合计 -->
        <div
          class="payStatus"
          v-if="detailData.detailBusinessSettleVo.payStatus && (detailData.detailBusinessSettleVo.settleStatus !== 4 && detailData.detailBusinessSettleVo.settleStatus !== 1)"
        >
          <!-- 付款信息 -->
          <el-divider content-position="left">付款信息：</el-divider>
          <div class="card-info">
            <div class="row">
              <span>应结算总额(元)：{{detailData.detailBusinessSettleVo.settleWaitPay}}</span>
              <span class="blue">已结算金额(元)：{{detailData.detailBusinessSettleVo.settleAlreadyPay}}</span>
              <span class="red">待结算金额(元)：{{detailData.detailBusinessSettleVo.settleActualPay}}</span>
            </div>
          </div>
          <!-- 付款信息 -->
          <!-- 付款记录 -->
          <el-divider content-position="left">付款记录：</el-divider>
          <div class="card-info">
            <el-button size="small" type="primary" @click.native.prevent="showTypeDialog(3)">添加付款记录</el-button>
            <pay-log :settle-id="$route.params.id || ''" :change-time="changeTime"/>
          </div>
          <!-- 付款记录 -->
        </div>
        <!-- 收款账号信息 -->
        <el-divider content-position="left">收款账号信息：</el-divider>
        <div class="card-info">
          <div class="row">
            <span>银行开户名：{{detailData.businessResp.bankOfDeposit}}</span>
            <span>银行卡号：{{detailData.businessResp.bankCardNo}}</span>
            <span>开户支行名称：{{detailData.businessResp.bankBranchName}}</span>
            <span>开户银行地址：{{detailData.businessResp.bankBranchRegion}}</span>
          </div>
          <div class="row">
            <span>备注：{{detailData.detailBusinessSettleVo.remark}}</span>
          </div>
        </div>
        <!-- 收款账号信息 -->
      </template>
      <div class="card-info">
        <template
          v-if="detailData.detailBusinessSettleVo && detailData.detailBusinessSettleVo.settleStatus === 4"
        >
          <el-button :size="size" type="primary" @click.native.prevent="showTypeDialog(4)">保存返回</el-button>
          <el-button
            :size="size"
            type="primary"
            @click.native.prevent="showTypeDialog(4, true)"
          >保存并进行结算</el-button>
          <el-button :size="size" @click.native.prevent="showTypeDialog(2)">取消</el-button>
        </template>
        <template v-else-if="detailData.detailBusinessSettleVo.settleStatus === 1">
          <el-button :size="size" type="primary" @click.native.prevent="showTypeDialog(1)">结算核对完成</el-button>
          <el-button
            :size="size"
            type="primary"
            @click.native.prevent="showTypeDialog(1, true)"
          >结算核对并进行确认</el-button>
          <el-button :size="size" @click.native.prevent="goBack">返回</el-button>
        </template>
        <template v-else-if="detailData.detailBusinessSettleVo.payStatus">
          <el-button :size="size" type="primary" @click.native.prevent="showTypeDialog(5)">确认完成</el-button>
          <el-button :size="size" @click.native.prevent="goBack">返回</el-button>
        </template>
      </div>
      <!-- 日志记录 -->
      <template v-if="detailData.detailBusinessSettleVo.settleStatus !== 4">
        <el-divider content-position="left">日志记录：</el-divider>
        <div class="card-info">
          <log :settle-id="$route.params.id || ''"/>
        </div>
      </template>
      <!-- 日志记录 -->
    </div>
    <div v-if="dialogObj.isShow">
      <c-dialog
        :is-show="dialogObj.isShow"
        :title="dialogObj.title"
        close-btn
        @before-close="dialogObj.isShow = false"
        @on-submit="dialogConfirm"
      >
        <page-dialog ref="childRef" :data-obj="dialogObj.initData" :show-type="dialogObj.type"></page-dialog>
      </c-dialog>
    </div>
  </c-view>
</template>

<script>
import MixinForm from 'mixins/form'
import CDialog from 'components/dialog'
import OrderList from './orderList'
import Log from './log'
import PayLog from './payLog'
import PageDialog from './dialog'

export default {
  mixins: [MixinForm],
  components: {
    OrderList,
    Log,
    PayLog,
    PageDialog,
    CDialog
  },
  data() {
    return {
      detailData: {
        detailBusinessSettleVo: {},
        businessResp: {}
      }, // 详情返回数据
      isEdit: false,
      isGoTo: false, // 是否跳转界面
      changeTime: null, // 添加支付记录时间戳
      dialogObj: {},
      payLogList: [] // 付款记录列表
    }
  },

  created() {
    const { id } = this.$route.params
    if (id) {
      this.isEdit = true
      this.fetchData()
    }
  },
  methods: {
    /**
     * 新建保存、取消，添加付款记录
    */
    showTypeDialog(type, flag) {
      this.isGoTo = flag
      const { settleWaitPay, settleAlreadyPay, id } = this.detailData.detailBusinessSettleVo
      this.dialogObj = {
        title: '提示',
        isShow: true,
        type,
        initData: {
          id,
          settleWaitPay,
          settleAlreadyPay,
          remark: ''
        }
      }
    },

    /**
     * 获取结算详情
     */
    fetchData() {
      const { id } = this.$route.params
      this.$api.finance.queryBusinessSettleDetail({ id }).then(res => {
        this.setTagsViewTitle()
        if (res) {
          const { detailBusinessSettleVo = {}, businessResp = {} } = res
          this.detailData = {
            detailBusinessSettleVo,
            businessResp
          }
        }
      })
    },

    dialogConfirm() {
      const childRef = this.$refs.childRef
      childRef.$refs.formRef.validate(valid => {
        if (valid) {
          let params = {}
          // 添加付款记录
          if (this.dialogObj.type === 3) {
            const { settleAlreadyPay, settleWaitPay, id, ...other } = childRef.formModel
            params = {
              businessSettleId: id,
              ...other
            }
            this.$api.finance.savePaymentLog(params).then(res => {
              this.dialogObj.isShow = false
              this.$msgTip('添加付款记录成功')
              this.changeTime = new Date().getTime()
            })
            return false
          }
          // 部分付款和全部付款
          if (this.dialogObj.type === 5) {
            const { id } = childRef.formModel
            const isTrue = this.detailData.detailBusinessSettleVo.settleAlreadyPay < this.detailData.detailBusinessSettleVo.settleWaitPay
            params = {
              businessSettleId: id,
              payStatus: isTrue ? 2 : 3
            }
            this.$api.finance.financialFinishPay(params).then(res => {
              this.dialogObj.isShow = false
              this.$msgTip(isTrue ? '部分支付成功' : '全部支付成功').then(res => {
                this.closeCurrentTag()
                this.goBack()
              })
            })
            return false
          }
          // 结算核对完成
          if (this.dialogObj.type === 1) {
            const { settleActualPay, id, remark } = childRef.formModel
            const settleStatus = this.isEdit ? 2 : 1
            params = {
              settleStatus,
              settleActualPay,
              id,
              remark
            }
          } else if (this.dialogObj.type === 2 || this.dialogObj.type === 4) {
            // 新增结算
            const { remark, id } = childRef.formModel
            if (this.dialogObj.type === 4) { // 取消
              params = {
                settleStatus: 1
              }
            }
            params = {
              ...params,
              id,
              remark
            }
          }
          this.$api.finance.financialSettle(params).then(res => {
            const { type } = this.dialogObj
            this.dialogObj.isShow = false
            this.$msgTip(type === 1 ? '结算核对完成' : type === 4 ? '保存成功' : '取消成功').then(res => {
              if (type === 4 && this.isGoTo) {
                const { path } = this.$route
                this.routerLink(path, 'replace')
              } else {
                this.closeCurrentTag()
                this.goBack()
              }
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang='less' scoped>
.main__box {
  .card-info {
    padding: 10px 80px;
    .row {
      display: flex;
      flex-wrap: wrap;
      span {
        display: inline-block;
        margin: 10px 20px 10px 0;
        min-width: 220px;
      }
    }
  }
}
</style>
