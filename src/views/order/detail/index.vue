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
      <line-card title="订单信息">
        <div class="row">
          <span>订单号：</span>
          <span>子订单：</span>
          <span>订单类型：</span>
        </div>
        <div class="row">
          <span>订单渠道：</span>
          <span>所属店铺：</span>
          <span>结算状态：</span>
        </div>
        <div class="row">
          <span>客户名称：</span>
          <span>客户手机：</span>
          <span>下单方式：</span>
        </div>
        <div class="row">
          <span>下单时间：</span>
          <span>订单状态：</span>
        </div>
      </line-card>
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
        <!-- TODO... 根据需求添加业务对话框处理 -->
      </c-dialog>
    </div>
  </c-view>
</template>

<script>
import LineCard from '@/views/common/lineCard'
import MixinForm from 'mixins/form'
import CDialog from 'components/dialog'

export default {
  mixins: [MixinForm],
  components: {
    CDialog,
    LineCard
  },
  data() {
    return {
      formModel: {
        // TODO... 初始化数据，需加备注
      },
      dialogObj: {},
      btnLoading: false,
      rules: {}
    }
  },

  created() {
    this.fetchData()
  },

  methods: {
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
