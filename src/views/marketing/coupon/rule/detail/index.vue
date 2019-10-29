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
      <v-rules title="规则设置" :data-obj="formModel"></v-rules>
    </el-form>
  </c-view>
</template>

<script>
import mixinForm from 'mixins/form'
import VBasic from './basic.vue'
import VRules from './rules.vue'

export default {
  name: 'couponRuleInfo',
  mixins: [mixinForm],
  data() {
    return {
      formModel: {},
      isView: false,
      isDisabled: true,
      dialogObj: {
        isShow: false,
        type: 1,
        curData: {}
      },
      btnLoading: false,
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

  },

  methods: {

  },

  components: {
    VBasic,
    VRules
  }
}
</script>

<style lang='less' scope>
.form {
  background-color: @white;
  padding: 15px 15px;
  .form-item {
    width: 100%;
  }
}
</style>
