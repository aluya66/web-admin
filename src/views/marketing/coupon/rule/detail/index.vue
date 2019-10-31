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
      <v-basic title="基础信息" :data-obj.sync="formModel"></v-basic>
      <v-rules title="规则设置" :data-obj.sync="formModel" @add-goods="showDialog"></v-rules>
      <v-apply title="申请信息" :data-obj.sync="formModel"></v-apply>
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
import MixinForm from 'mixins/form'
import VBasic from './basic.vue'
import VRules from './rules.vue'
import VApply from './apply.vue'
import ChooseGoods from './chooseGoods.vue'
import CDialog from 'components/dialog'

export default {
  name: 'couponRuleInfo',
  mixins: [MixinForm],
  data() {
    return {
      formModel: {
        couponRuleName: '',
        categoryType: 0,
        limitReceive: 0,
        couponRuleType: 0,
        preferentialType: 0,
        couponPreferentialRules: [], // 优惠规则
        returnRule: [0, 2]
      },
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
        ],
        returnRule: [
          { required: true, message: '请选择返还规则', trigger: 'change' }
        ],
        preferentialType: [
          { required: true, message: '请选择优惠规则', trigger: 'change' }
        ],
        couponPreferentialRules: [
          { required: true, message: '请选择优惠规则', trigger: 'blur' }
        ]
      }
    }
  },

  created() {
    const { id } = this.$route.params
    if (id) {
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
        this.setTagsViewTitle()
        const { pointLimit, repeatUse, useCode, userLevel, ...other } = res
        this.formModel = {
          pointLimit: Boolean(pointLimit),
          repeatUse: Boolean(repeatUse),
          useCode: Boolean(useCode),
          userLevel: Boolean(userLevel),
          ...other
        }
      })
    },
    submitHandle() {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          this.addUpdateHandle()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    addUpdateHandle() {
      const { pointLimit, repeatUse, useCode, userLevel, ...other } = this.formModel
      this.$api.marketing.addCouponRule({
        pointLimit: Number(pointLimit),
        repeatUse: Number(repeatUse),
        useCode: Number(useCode),
        userLevel: Number(userLevel),
        ...other
      }).then(res => {
        if (this.formModel.couponRuleId) {
          this.$msgTip('更新成功')
        } else {
          this.$msgTip('新增成功')
        }
      })
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

<style lang='less' scoped>
.form {
  background-color: @white;
  padding: 15px 15px;
  .form-btn {
    margin-left: 20px;
    margin-top: 20px;
  }
}
</style>
