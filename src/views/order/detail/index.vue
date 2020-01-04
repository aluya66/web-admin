<template>
  <c-view>
    <template v-slot:header>
      <el-page-header
        @back="goBack"
        :content="$route.meta.name || $t(`route.${$route.meta.title}`)"
      ></el-page-header>
    </template>
    <el-form
      ref="formRef"
      :model="formModel"
      :rules="rules"
      label-width="120px"
      class="detail-form"
      label-position="right"
      status-icon
    >
      <detail-info></detail-info>
      <goods-list :order-Id="orderId"></goods-list>
      <logistics-list :order-Id="orderId"></logistics-list>
      <after-sale :order-Id="orderId"></after-sale>
      <log-list :order-Id="orderId"></log-list>
      <el-form-item class="button-item">
        <el-button
          :loading="btnLoading"
          :size="size"
          type="primary"
          @click.native.prevent="submitHandle"
        >保存</el-button>
        <el-button :size="size" @click.native.prevent="goBack">返回</el-button>
      </el-form-item>
    </el-form>
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
    LogList
  },
  data() {
    return {
      formModel: {
        // TODO... 初始化数据，需加备注
      },
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
      this.$api.order.queryOrderDetail({ id }).then(res => {
        this.setTagsViewTitle()
        if (res) {
          this.formModel = res
        }
      })
    },
    dialogConfirm() {
      this.dialogObj.isShow = false
    },
    submitHandle() {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          const requestMethods = {
            'add': this.$api.order.addOrder,
            'edit': this.$api.order.editOrder
          }
          const { id } = this.$route.params
          const request = id ? requestMethods['edit'] : requestMethods['add']

          const params = {
            // TODO...
          }

          request(params).then(() => {
            this.$msgTip(id ? '更新成功' : '新增成功').then(() => {
              this.closeCurrentTag()
              this.goBack()
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
