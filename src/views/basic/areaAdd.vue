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
    <el-form-item label="地区名称" prop="name">
      <el-input v-model.trim="formModel.name" class="form-item"/>
    </el-form-item>
    <el-form-item label="地区编码" prop="code">
      <el-input type="textarea" v-model.trim="formModel.code" class="form-item"/>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    initData: {
      type: Object,
      default() {
        return {
          name: '',
          code: ''
        }
      }
    }
  },
  data() {
    return {
      rules: {
        code: [
          { required: true, message: '请填写地区编码', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请填写地区名称', trigger: 'blur' }
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
  .select-item{
    width: 100%
  }
}
</style>
