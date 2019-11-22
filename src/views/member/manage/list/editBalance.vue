<template>
  <el-form
    ref="formRef"
    :model="formModel"
    :rules="rules"
    label-width="120px"
    class="form"
    label-position="right"
    status-icon
  >
    <el-form-item label="账号余额:">
      <el-input
        v-model.trim="formModel.curBalance"
        class="form-item"
        disabled
      ></el-input>
    </el-form-item>
    <el-form-item label="余额变动:">
      <el-input
        v-model.trim="formModel.balance"
        class="form-item"
      ></el-input>
    </el-form-item>
  </el-form>
</template>

<script>

export default {
  props: {
    initData: {
      type: Object,
      default() {}
    }
  },
  data() {
    return {
      formModel: {},
      rules: {
        balance: [
          { required: true, message: '请输入' }
        ]
      }
    }
  },
  created() {
    this.getMemberDetail()
  },
  methods: {
    getMemberDetail() {
      const { userId, appCode } = this.initData
      this.$api.member.getMemberDetail({
        userId,
        appCode
      }).then(res => {
        const curBalance = res.balance || 0 // 当前余额
        this.formModel = Object.assign({}, { curBalance }, { userId, appCode }) || {}
      })
    }
  }
}
</script>

<style lang='less' scoped>
.form {
  width: 90%;
  .form-item {
    width: 100%;
  }
}
</style>
