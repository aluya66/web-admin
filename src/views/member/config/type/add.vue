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
    <el-form-item label="名称:" prop="name">
      <el-input v-model.trim="formModel.name" class="form-item" clearable></el-input>
    </el-form-item>
    <el-form-item label="状态:" prop="isEnable">
      <el-select
          v-model="formModel.isEnable"
          class="select-item"
          :popper-append-to-body="false"
          clearable
        >
          <el-option
            v-for="item in isEnableSelect"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
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
          name: '', // 会员名称
          isEnable: '' // 状态
        }
      }
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isEnableSelect: [
        {
          value: 0,
          label: '禁用'
        },
        {
          value: 1,
          label: '启用'
        }
      ],
      rules: {
        name: [{ required: true, message: '请填写名称', trigger: 'blur' }],
        isEnable: [{ required: true, message: '请选择', trigger: 'change' }]
      }
    }
  },
  computed: {
    formModel() {
      return this.initData
    }
  },
  methods: {}
}
</script>

<style lang="less" scoped>
.form {
  width: 90%;
  .form-item {
    width: 100%;
  }
}
.body .el-select {
  position: fixed !important;
}
.select-item {
  width: 50%;
}
</style>
