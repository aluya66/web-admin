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
      class="form"
      label-position="right"
    >
      <v-basic title="基础信息" :data-obj="formModel"></v-basic>
      <v-rules title="规则设置" :data-obj="formModel" @add-goods="showDialog"></v-rules>
      <v-apply title="申请信息" :data-obj="formModel"></v-apply>
      <el-form-item class="form-btn" v-if="!isView">
        <el-button :loading="btnLoading" type="primary" @click.native.prevent="submitHandle">保存</el-button>
      </el-form-item>
    </el-form>
    <div v-if="dialogObj.isShow">
      <c-dialog
        :is-show="dialogObj.isShow"
        :title="dialogObj.title"
        close-btn
        width="70%"
        @before-close="dialogObj.isShow = false"
        :btns="dialogObj.btns"
      >
        <choose-goods ref="childRef"></choose-goods>
      </c-dialog>
    </div>
  </c-view>
</template>

<script>
import mixinForm from 'mixins/form'
import VBasic from './basic.vue'
import VRules from './rules.vue'
import VApply from './apply.vue'
import ChooseGoods from './chooseGoods.vue'
import CDialog from 'components/dialog'

export default {
  name: 'couponRuleInfo',
  mixins: [mixinForm],
  data() {
    return {
      formModel: {},
      isView: false,
      isEdit: false,
      isDisabled: false,
      btnLoading: false,
      dialogObj: {
        title: '已上架商品列表',
        isShow: false,
        btns: [{
          label: '取 消',
          name: 'cancel'
        },
        {
          label: '确认加入',
          name: 'submit',
          type: 'primary',
          handle() {
            console.log('确认加入')
          }
        }]
      },
      rules: {
        couponRuleName: [
          { required: true, message: '请输入券名称', trigger: 'blur' }
        ],
        limitReceive: [
          { required: true, message: '每人限选1张券', trigger: 'blur' }
        ],
        categoryType: [
          { required: true, message: '请选择品类', trigger: 'change' }
        ]
      }
    }
  },

  created() {
    const { id } = this.$route.params
    if (id) {
      this.isEdit = true
      this.fetchData(id)
    }
  },

  methods: {
    showDialog(type, value) {
      this.dialogObj = {
        ...this.dialogObj,
        isShow: true,
        type,
        curData: value
      }
    },
    fetchData(couponRuleId) {
      this.$api.marketing.getCouponRuleDetail({ couponRuleId }).then(res => {
        console.log(res)
      })
    },
    submitHandle() {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          if (this.isEdit) {
            this.addHandle()
          } else {
            this.editHandle()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    addHandle() {
      const params = this.formModel
      this.$api.marketing.addCouponRule(params).then(res => {
        console.log(res)
      })
    },
    editHandle() {

    }
  },

  components: {
    VBasic,
    VRules,
    VApply,
    CDialog,
    ChooseGoods
  }
}
</script>

<style lang='less' scope>
.form {
  background-color: @white;
  padding: 15px 15px;
  .form-btn {
    margin-left: 20px;
    margin-top: 20px;
  }
}
</style>
