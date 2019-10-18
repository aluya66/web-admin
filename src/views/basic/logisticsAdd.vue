<template>
  <el-form
    ref="formRef"
    :model="formModel"
    :rules="rules"
    label-width="120px"
    class="form"
    label-position="right"
  >
    <el-form-item label="物流名称" prop="logiName">
      <el-input
        v-model.trim="formModel.logiName"
        placeholder='请输入物流名称'
        clearable
      /></el-form-item>
    <el-form-item label="物流编码" prop="logiCode">
      <el-input
        v-model.trim="formModel.logiCode"
        placeholder='请输入物流编码'
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
    return {
      rules: {
        logiName: [
          { required: true, message: '请输入物流名称', trigger: 'blur' }
        ],
        logiCode: [
          { required: true, message: '请输入物流编码', trigger: 'blur' }
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
