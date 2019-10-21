<template>
  <el-form
    ref="formRef"
    :model="formModel"
    :rules="rules"
    label-width="120px"
    class="form"
    label-position="right"
  >
    <el-form-item label="app名称:" prop="appName">
      <el-input
        v-model.trim="formModel.appName"
        class="form-item"
        clearable
      ></el-input>
    </el-form-item>
    <el-form-item label="app编码:" prop="appCode">
      <el-input
        v-model.trim="formModel.appCode"
        class="form-item"
        clearable
      ></el-input>
    </el-form-item>
    <el-form-item label="状态:" prop="status">
      <el-select
        v-model="formModel.status"
        class="form-item"
        clearable
      >
        <el-option
          v-for="item in bussinessLineSelect"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="描述:" prop="description">
      <el-input
      type="textarea"
      class="form-item"
      v-model.trim="formModel.description"
      clearable
      ></el-input>
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
          appName: '',
          appCode: '',
          status: '',
          description: ''
        }
      }
    }
  },
  data() {
    return {
      rules: {
        appName: [
          { required: true, message: '请填写app名称', trigger: 'blur' }
        ],
        appCode: [
          { required: true, message: '请填写app编码', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        description: [
          { required: true, message: '请填写描述', trigger: 'blur' }
        ]
      },
      bussinessLineSelect: [
        {
          value: 1,
          label: '启用'
        },
        {
          value: 2,
          label: '禁用'
        }
      ]
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
