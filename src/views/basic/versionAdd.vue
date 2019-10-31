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
    <el-form-item label="app版本:" prop="versionName">
      <el-input
        v-model.trim="formModel.versionName"
        class="form-item"
        clearable
      ></el-input>
    </el-form-item>
    <el-form-item label="URL:" prop="url">
      <el-input
        v-model.trim="formModel.url"
        class="form-item"
        clearable
      ></el-input>
    </el-form-item>
    <el-form-item label="平台:" prop="platform">
      <el-select
        v-model="formModel.platform"
        class="select-item"
        clearable
      >
        <el-option
          v-for="item in platformSelect"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="强制更新:" prop="force">
      <el-select
        v-model="formModel.force"
        class="select-item"
        clearable
      >
        <el-option
          v-for="item in forceSelect"
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
          versionName: '',
          url: '',
          platform: '',
          force: '',
          description: ''
        }
      }
    }
  },
  data() {
    return {
      rules: {
        versionName: [
          { required: true, message: '请填写app名称', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '请填写app编码', trigger: 'blur' }
        ],
        platform: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        force: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        description: [
          { required: true, message: '请填写描述', trigger: 'blur' }
        ]
      },
      forceSelect: [
        {
          value: 0,
          label: '是'
        },
        {
          value: 1,
          label: '否'
        }
      ],
      platformSelect: [
        {
          value: 0,
          label: '安卓'
        },
        {
          value: 1,
          label: 'IOS'
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

<style lang="less" scoped>
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
