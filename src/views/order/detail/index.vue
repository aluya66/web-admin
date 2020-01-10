<template>
  <c-view>
    <template v-slot:header>
      <el-page-header
        @back="goBack"
        :content="$route.meta.name || $t(`route.${$route.meta.title}`)"
      ></el-page-header>
    </template>
      <div class="detail-form">
        <detail-info :order-info="detailData"></detail-info>
        <goods-list :order-code="$route.params.id"></goods-list>
        <pay-list :pay-list="detailData.orderPayResp"></pay-list>
        <refund-list :refund-list="detailData.orderRefundResp"></refund-list>
        <logistics-list :delivery-list="detailData.deliveryResp"></logistics-list>
        <after-sale :after-list="detailData.afterSalesRespList"></after-sale>
        <log-list :log-list="detailData.orderLogRespList"></log-list>
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
          :is-edit="dialogObj.isEdit"
        ></dialog-info>
      </c-dialog>
    </div>
  </c-view>
</template>

<script>
import MixinForm from 'mixins/form'
import CDialog from 'components/dialog'
import DetailInfo from './info'
import DialogInfo from './dialogInfo'
import LogisticsList from './list/logistics'
import GoodsList from './list/goods'
import payList from './list/pay'
import refundList from './list/refund'
import AfterSale from './list/afterSale'
import LogList from './list/log'

export default {
  mixins: [MixinForm],
  components: {
    CDialog,
    DetailInfo,
    DialogInfo,
    LogisticsList,
    GoodsList,
    AfterSale,
    LogList,
    refundList,
    payList
  },
  data() {
    return {
      detailData: {},
      dialogObj: {},
      btnLoading: false,
      rules: {},
      orderId: ''
    }
  },

  created() {
    const { id } = this.$route.params
    id && this.fetchData()
    this.orderId = id
  },

  methods: {
    showDialog(row) {

    },
    fetchData() {
      const { id } = this.$route.params
      this.$api.order.queryOrderDetail({ orderCode: id }).then(res => {
        this.setTagsViewTitle()
        if (res) {
          this.detailData = res
          console.log(this.detailData)
        }
      })
    },
    dialogConfirm() {
      this.dialogObj.isShow = false
    }
  }
}
</script>
