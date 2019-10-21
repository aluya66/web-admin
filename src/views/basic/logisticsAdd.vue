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
    <el-form-item label="物流名称" prop="logiName">
      <el-input
        v-model.trim="formModel.logiName"
        class="form-item"
        clearable
      /></el-form-item>
    <el-form-item label="物流编码" prop="logiCode">
      <el-input
        v-model.trim="formModel.logiCode"
        class="form-item"
        clearable
      /></el-form-item>
  </el-form>
</template>

<script>

export default {
  props: {
    initData: {
      type: Object,
      default() {
        return {
          logiName: '',
          logiCode: ''
        }
      }
    }
  },
  data() {
    let checkCode = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('物流编码不能为空'))
      }
      setTimeout(() => {
        if (/^[A-Za-z0-9-_]+$/.test(value)) {
          callback()
        } else {
          // eslint-disable-next-line standard/no-callback-literal
          callback('请输入字母、数字或下划线')
        }
      }, 1000)
    }
    return {
      rules: {
        logiName: [
          { required: true, message: '请输入物流名称', trigger: 'blur' }
        ],
        logiCode: [
          { required: true, validator: checkCode, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    formModel() {
      return this.initData
    }
  }
}
</script>

<style lang="less">
.form {
  width: 90%;
  .form-item {
    width: 100%;
  }
}
</style>
