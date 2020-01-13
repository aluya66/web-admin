<template>
  <el-form
    ref="formRef"
    :model="formModel"
    :rules="rules"
    label-width="130px"
    class="form"
    label-position="right"
    status-icon
  >
    <el-form-item label="账号可用余额(元):">
      <el-input
        v-model.trim="formModel.curBalance"
        class="form-item"
        disabled
      ></el-input>
    </el-form-item>
    <el-form-item label="余额变动(元):" prop="balance">
      <el-input
        v-model.trim="formModel.balance"
        class="form-item"
        :maxlength="7"
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
    const checkBalance = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('余额不能为空'))
      }
      if (!Number(value)) {
        return callback(new Error('请输入数字值'))
      }
      callback()
    }
    return {
      formModel: {},
      rules: {
        balance: [
          { required: true, validator: checkBalance, trigger: 'blur' }
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
