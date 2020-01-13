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
    <el-form-item label="账号可用收益(元):">
      <el-input
        v-model.trim="initData.earnings"
        class="form-item"
        disabled
      ></el-input>
    </el-form-item>
    <el-form-item label="收益变动(元):" prop="price">
      <el-input
        v-model.trim="formModel.price"
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
    const checkPrice = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('收益不能为空'))
      }
      if (!Number(value)) {
        return callback(new Error('请输入数字值'))
      }
      callback()
    }
    return {
      formModel: {
        price: ''
      },
      rules: {
        price: [
          { required: true, validator: checkPrice, trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    const { userId, appCode } = this.initData
    this.formModel = {
      userId,
      appCode,
      ...this.formModel
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
