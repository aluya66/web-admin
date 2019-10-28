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
      <v-basic title="基础信息"></v-basic>
      <v-rules title="规则设置"></v-rules>
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
      btnLoading: false
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
  padding: 20px 20px 50px 0;
  .form-item {
    width: 100%;
  }
}
</style>
