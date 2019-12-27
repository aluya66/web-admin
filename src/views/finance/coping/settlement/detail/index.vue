<template>
  <c-view>
    <template v-slot:header>
      <el-page-header
        @back="goBack"
        :content="$route.meta.name || $t(`route.${$route.meta.title}`)"
      ></el-page-header>
    </template>
    <div class="main__box">
      <order-list :init-data.sync="detailData" :is-eidt="isEdit"></order-list>
      <template>
        <!-- 合计 -->
        <el-divider content-position="left">合计：</el-divider>
        <div class="card-info">
          <div class="row">
            <span>销售订单数：{{detailData.detailBusinessSettleVo.sellOrderNum}}</span>
            <span>售后订单数：{{detailData.detailBusinessSettleVo.afterOrderNum}}</span>
          </div>
          <div class="row">
            <span>订单总金额(元)：{{detailData.detailBusinessSettleVo.orderTotalAmount}}</span>
            <span>订单优惠总额(元)：{{detailData.detailBusinessSettleVo.orderTotalDiscountsAmount}}</span>
            <span>余额抵扣总额(元)：{{detailData.detailBusinessSettleVo.orderTotalBalance}}</span>
            <span>代金券抵扣总额(元)：{{detailData.detailBusinessSettleVo.orderTotalVoucherAmount}}</span>
            <span>订单实收总额(元)：{{detailData.detailBusinessSettleVo.actualAmount}}</span>
            <span>星购卡支付金额(元)：{{detailData.detailBusinessSettleVo.storedCardAmount}}</span>
            <span>订单实付总额(元)：{{detailData.detailBusinessSettleVo.actualAmount}}</span>
            <!-- <span>平台抵扣总额：{{detailData.detailBusinessSettleVo.totalServiceFee}}</span> -->
          </div>
          <div class="row">
            <span>平台服务费总额(元)：{{detailData.detailBusinessSettleVo.totalServiceFee}}</span>
          </div>
          <div class="row">
            <span>售后退款总额(元)：{{detailData.detailBusinessSettleVo.afterTotalRefund}}</span>
            <span>实际售后退款总额(元)：{{detailData.detailBusinessSettleVo.afterActualRetund}}</span>
          </div>
          <div class="row">
            <span>应结算总额(元)：{{detailData.detailBusinessSettleVo.settleMoney}}</span>
          </div>
        </div>
        <!-- 合计 -->
        <div class="payStatus">
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
            <pay-log :pay-log-list="payLogList"/>
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
        </div>
        <!-- 收款账号信息 -->
      </template>
      <div class="card-info">
        <el-form
          ref="formRef"
          :model="formModel"
          label-width="50px"
          class="form"
          label-position="right"
          status-icon
        >
          <el-form-item label="备注:" prop="remark">
            <el-input
              type="textarea"
              v-model.trim="formModel.remark"
              placeholder="请输入备注"
              :rows="3"
              maxlength="300"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item class="form-btn">
            <el-button
              v-if="detailData.detailBusinessSettleVo && detailData.detailBusinessSettleVo.settleStatus === 4"
              :disabled="!detailData.detailBusinessSettleVo || !detailData.detailBusinessSettleVo.settleWaitPay"
              :size="size"
              type="primary"
              @click.native.prevent="showTypeDialog(1)"
            >保存</el-button>
            <el-button
              v-if="detailData.detailBusinessSettleVo && detailData.detailBusinessSettleVo.settleStatus === 4"
              :disabled="!detailData.detailBusinessSettleVo || !detailData.detailBusinessSettleVo.settleWaitPay"
              :size="size"
              @click.native.prevent="showTypeDialog(2)"
            >取消</el-button>
            <el-button :size="size" @click.native.prevent="goBack">返回</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 日志记录 -->
      <el-divider content-position="left">日志记录：</el-divider>
      <div class="card-info">
        <log :log-list="logList"/>
      </div>
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
      formModel: {}, // 提交数据
      dialogObj: {},
      logList: [], // 日志列表
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
  watch: {
  },
  methods: {
    /**
     * 新建保存、取消，添加付款记录
    */
    showTypeDialog(type) {
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
     * 获取日志记录
     */
    getLogList() {
      const { id } = this.dialogObj.detailBusinessSettleVo
      this.$api.finance.querySettleOperateLog({ businessSettleId: id }).then(res => {
        if (res) {
          this.logList = res
        }
      })
    },
    /**
     * 获取支付记录
     */
    getPayLogList() {

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
          if (this.dialogObj.type === 3) {
            const { settleAlreadyPay, settleWaitPay, ...other } = childRef.formModel
            params = {
              ...other
            }
            this.$api.finance.savePaymentLog(params).then(res => {
              this.dialogObj.isShow = false
              this.$msgTip('添加付款记录成功')
            })
            return false
          }
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
            const { remark, id } = childRef.formModel
            params = {
              id,
              remark
            }
          }
          this.$api.finance.financialSettle(params).then(res => {
            this.dialogObj.isShow = false
            this.$msgTip(this.dialogObj.type === 1 ? '保存成功' : '取消成功')
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
