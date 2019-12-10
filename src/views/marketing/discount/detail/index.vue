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
    <g-apply
      :is-view="isView"
      :is-disabled="isDisabled"
      :data-obj="formModel"
      ref="basicRef"
      title="申请信息"
    ></g-apply>
    <div class="btn-wrapper">
      <el-button :loading="btnLoading" type="primary" @click.native.prevent="submitHandle">保存</el-button>
    </div>
  </c-view>
</template>

<script>
import MixinForm from 'mixins/form'
import GBasic from './basic'
import GApply from './apply'

export default {
  name: 'discountDetail',
  mixins: [MixinForm],
  data() {
    return {
      isDisabled: false,
      isView: true,
      btnLoading: false,
      formModel: {}
    }
  },

  created() {

  },

  methods: {
  },

  components: {
    GBasic,
    GApply
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
