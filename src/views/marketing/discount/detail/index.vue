<template>
  <c-view>
    <template v-slot:header>
      <el-page-header
        @back="goBack"
        :content="$route.meta.name || $t(`route.${$route.meta.title}`)"
      ></el-page-header>
    </template>
    <g-basic
      :is-view="isView"
      :is-disabled="isDisabled"
      :data-obj="formModel"
      ref="basicRef"
      title="基础信息"
    ></g-basic>
    <g-rule
      :is-view="isView"
      :is-disabled="isDisabled"
      :data-obj="formModel"
      ref="ruleRef"
      title="规则设置(以下信息至少完善一项)"
      @show-dialog="showDialog"
    ></g-rule>
    <g-apply
      :is-view="isView"
      :is-disabled="isDisabled"
      :data-obj="formModel"
      ref="applyRef"
      title="申请信息"
    ></g-apply>
    <div class="btn-wrapper">
      <el-button :loading="btnLoading" type="primary" @click.native.prevent="submitHandle">保存</el-button>
    </div>

    <div v-if="dialogObj.isShow">
      <c-dialog
        :is-show="dialogObj.isShow"
        :title="dialogObj.title"
        close-btn
        @before-close="dialogObj.isShow = false"
        @on-submit="dialogConfirm"
      >
        <customer-select
          ref="customerSelectRef"
          :initChecked="formModel.selectedCustomerList"
          :sourceList="customerList"
        ></customer-select>
      </c-dialog>
    </div>
  </c-view>
</template>

<script>
import MixinForm from 'mixins/form'
import GBasic from './basic'
import GRule from './rule'
import GApply from './apply'
import customerSelect from '../../../common/customerSelect'
import CDialog from 'components/dialog'

export default {
  name: 'discountDetail',
  mixins: [MixinForm],
  data() {
    return {
      customerList: [{
        name: '张三',
        code: '1',
        phone: '111'
      }, {
        name: '李四',
        code: '2',
        phone: '222'
      }, {
        name: 'zzz',
        code: '3',
        phone: '333'
      }],
      isDisabled: false,
      isView: true,
      btnLoading: false,
      formModel: {
        selectedCustomerList: [{
          name: '张三',
          code: '1',
          phone: '111'
        }, {
          name: '李四',
          code: '2',
          phone: '222'
        }]
      },
      dialogObj: {}
    }
  },

  created() {

  },
  methods: {
    dialogConfirm() {
      const checkedTagsList = this.$refs.customerSelectRef.checkedAttr
      this.selectedCustomerList = checkedTagsList
      this.dialogObj.isShow = false
      this.$set(this.formModel, 'selectedCustomerList', JSON.parse(JSON.stringify(this.selectedCustomerList)))
      console.log(this.formModel.selectedCustomerList)
    },
    showDialog() {
      this.dialogObj = {
        isShow: true,
        title: '选择用户'
      }
    }
  },

  components: {
    GBasic,
    GRule,
    GApply,
    customerSelect,
    CDialog
  }
}
</script>
<style lang='less' scoped>
.form {
  background-color: @white;
  padding: 15px 15px;
  .form-btn {
    margin-left: 20px;
    margin-top: 20px;
  }
}
.btn-wrapper {
  display: flex;
  justify-content: center;
}
</style>
