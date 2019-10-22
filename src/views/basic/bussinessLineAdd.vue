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
    <el-form-item label="app名称:" prop="appName">
      <el-input
        v-model.trim="formModel.appName"
        class="form-item"
        clearable
      ></el-input>
    </el-form-item>
    <el-form-item label="app编码:" prop="appCode" v-if="bussinessCodeStatus === false">
      <el-input
        v-model.trim="formModel.appCode"
        class="form-item"
        clearable
      ></el-input>
    </el-form-item>
    <el-form-item label="状态:" prop="status">
      <el-select
        v-model="formModel.status"
        class="select-item"
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
    <el-form-item label="描述:">
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
    },
    bussinessCode: {
      type: Boolean,
      default: false
    }
  },
  data() {
    let checkCode = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('app编码不能为空'))
      } else if (/^[A-Za-z0-9-_]+$/.test(value)) {
        callback()
      } else {
        // eslint-disable-next-line standard/no-callback-literal
        callback('请输入字母、数字或下划线')
      }
    }
    return {
      bussinessCodeStatus: '',
      rules: {
        appName: [
          { required: true, message: '请填写app名称', trigger: 'blur' }
        ],
        appCode: [
          { required: true, validator: checkCode, trigger: 'blur' }
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
          value: '1',
          label: '启用'
        },
        {
          value: '2',
          label: '禁用'
        }
      ]
    }
  },
  created() {
    this.bussinessCodeStatus = this.bussinessCode
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
    width: 50%
  }
}
</style>
