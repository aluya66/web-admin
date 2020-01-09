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
      <template v-if="detailData.detailBusinessSettleVo.settleStatus && isNotEmpty">
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
            <span>应结算总金额(元)：{{detailData.detailBusinessSettleVo.settleWaitPay}}</span>
          </div>
        </div>
        <!-- 合计 -->
        <div
          class="payStatus"
          v-if="detailData.detailBusinessSettleVo.settleStatus !== 4 && detailData.detailBusinessSettleVo.settleStatus !== 1"
        >
          <!-- 付款信息 -->
          <el-divider content-position="left">付款信息：</el-divider>
          <div class="card-info">
            <div class="row">
              <span>财务审核应结算总金额(元)：{{detailData.detailBusinessSettleVo.settleActualPay}}</span>
            </div>
            <div class="row">
              <span class="blue">已结算总金额(元)：{{detailData.detailBusinessSettleVo.payAmount}}</span>
              <span class="red">待结算总金额(元)：{{waitPay}}</span>
            </div>
          </div>
          <!-- 付款信息 -->
          <!-- 付款记录 -->
          <el-divider content-position="left">付款记录：</el-divider>
          <div class="card-info">
            <el-button size="small" type="primary" @click.native.prevent="showTypeDialog(3)" v-if="detailData.detailBusinessSettleVo.settleStatus === 2 && detailData.detailBusinessSettleVo.payStatus !== 3">添加付款记录</el-button>
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
          </div>
          <div class="row">
            <span>开户支行名称：{{detailData.businessResp.bankBranchName}}</span>
            <span>开户银行地址：{{detailData.businessResp.bankBranchRegion}}</span>
          </div>
          <div class="row">
            <span>备注：{{detailData.detailBusinessSettleVo.remark}}</span>
          </div>
        </div>
        <!-- 收款账号信息 -->
      </template>
      <div class="card-info" v-if="isNotEmpty">
        <template
          v-if="detailData.detailBusinessSettleVo && detailData.detailBusinessSettleVo.settleStatus === 4"
        >
          <el-button :size="size" type="primary" @click.native.prevent="showTypeDialog(4)">保存</el-button>
          <!-- <el-button
            :size="size"
            type="primary"
            @click.native.prevent="showTypeDialog(4, true)"
          >保存并进行核对</el-button> -->
          <el-button :size="size" @click.native.prevent="showTypeDialog(2)">取消</el-button>
        </template>
        <template v-else-if="detailData.detailBusinessSettleVo.settleStatus === 1">
          <el-button :size="size" type="primary" @click.native.prevent="showTypeDialog(1)">结算核对完成</el-button>
          <el-button :size="size" @click.native.prevent="goBack">返回</el-button>
        </template>
        <template v-else-if="detailData.detailBusinessSettleVo.payStatus !== 3 && detailData.detailBusinessSettleVo.settleStatus !== 3">
          <el-button :size="size" type="primary" @click.native.prevent="showTypeDialog(5)">确认完成</el-button>
          <el-button :size="size" @click.native.prevent="goBack">返回</el-button>
        </template>
      </div>
      <!-- 日志记录 -->
      <template
        v-if="detailData.detailBusinessSettleVo.settleStatus && detailData.detailBusinessSettleVo.settleStatus !== 4"
      >
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
        <template v-slot:headerInfo>
          <p class="info-content">{{dialogObj.info}}</p>
        </template>
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
  computed: {
    // 待结算总金额
    waitPay() {
      if (this.detailData.detailBusinessSettleVo) {
        const { payAmount = 0, settleActualPay } = this.detailData.detailBusinessSettleVo
        return (Number(settleActualPay) - Number(payAmount)).toFixed(2)
      }
      return '0.00'
    },
    // 当销售和售后都为零时，不能创建结算单
    isNotEmpty() {
      return this.detailData.detailBusinessSettleVo.sellOrderNum || this.detailData.detailBusinessSettleVo.afterOrderNum
    }
  },
  methods: {
    /**
     * 新建保存、取消，添加付款记录
    */
    showTypeDialog(type, flag) {
      this.isGoTo = flag
      const { settleWaitPay, settleActualPay, payAmount, id, settleStatus } = this.detailData.detailBusinessSettleVo
      if (type !== 4) {
        let info = '' // 弹出框特殊提示
        let title = '提示'
        // type 1为结算单核对确认，2为新增结算单，3为添加付款记录，4为新增取消，5为确认完成打款操作
        switch (type) {
          case 1:
            info = '请认真核对结算金额后，再进行确认操作！'
            title = '核对结算单'
            break
          case 2:
            info = '请填写取消的原由!'
            break
          case 3:
            title = '添加付款记录'
            break
          case 5:
            info = '请确认打款完成，再进行确认操作！'
            title = '核对打款金额'
            break
        }
        this.dialogObj = {
          title,
          isShow: true,
          type,
          info,
          initData: {
            id,
            settleStatus,
            settleWaitPay,
            settleActualPay: type === 1 ? settleWaitPay : settleActualPay,
            curPayAmount: payAmount,
            remark: ''
          }
        }
      } else {
        this.optHandle({ id, settleStatus: 1 }, true)
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
    /**
     * 结算单核算、新增保存、新增取消操作
     */
    optHandle(params, isAdd) {
      this.$api.finance.financialSettle(params).then(res => {
        const { type } = this.dialogObj
        let msgTip = '结算单保存成功'
        if (type) {
          msgTip = type === 1 ? '结算单核对完成' : '取消成功'
          this.dialogObj.isShow = false
        }
        this.$msgTip(msgTip).then(res => {
          if (isAdd && this.isGoTo) {
            if (isAdd) {
              const { path } = this.$route
              this.routerLink(`${path}/${this.detailData.detailBusinessSettleVo.id}`)
            } else {
              // 结算单核对后，直接刷数据可以进行打款
              this.fetchData()
            }
          } else {
            this.closeCurrentTag()
            this.goBack()
          }
        })
      })
    },
    dialogConfirm() {
      const childRef = this.$refs.childRef
      childRef.$refs.formRef.validate(valid => {
        if (valid) {
          let params = {}
          // 添加付款记录
          if (this.dialogObj.type === 3) {
            const { id, payAmount, serviceFee, paySerialNumber, remark } = childRef.formModel
            params = {
              businessSettleId: id,
              payAmount,
              serviceFee,
              paySerialNumber,
              remark
            }
            this.$api.finance.savePaymentLog(params).then(res => {
              this.dialogObj.isShow = false
              this.$msgTip('添加付款记录成功')
              this.changeTime = new Date().getTime()
              this.detailData.detailBusinessSettleVo.payAmount = Number(this.detailData.detailBusinessSettleVo.payAmount) + Number(payAmount)
            })
            return false
          }
          // 全部付款
          if (this.dialogObj.type === 5) {
            const { id, remark } = childRef.formModel
            params = {
              id,
              payStatus: 3,
              remark
            }
            this.$api.finance.financialFinishPay(params).then(res => {
              this.dialogObj.isShow = false
              this.$msgTip('已全部支付完成').then(res => {
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
          } else if (this.dialogObj.type === 2) {
            // 取消关闭
            const { remark, id } = childRef.formModel
            params = {
              settleStatus: 3,
              id,
              remark
            }
          }
          this.optHandle(params)
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
.info-content {
  margin: -30px 0 10px 0;
  line-height: 30px;
  font-size: @f16;
}
</style>
