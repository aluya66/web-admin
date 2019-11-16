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
    <el-form-item label="用户姓名:" prop="name">
      <el-input
        v-model.trim="formModel.name"
        class="form-item"
        clearable
      ></el-input>
    </el-form-item>
    <el-form-item label="昵称:" prop="nickname">
      <el-input
        v-model.trim="formModel.nickname"
        class="form-item"
        clearable
      ></el-input>
    </el-form-item>
    <el-form-item label="手机号:" prop="phoneNumber">
      <el-input
        v-model.trim="formModel.phoneNumber"
        class="form-item"
        clearable
      ></el-input>
    </el-form-item>
    <el-form-item label="生日:" prop="birthday">
      <el-date-picker
        v-model="formModel.birthday"
        value-format="yyyy-MM-dd"
        type="date"
        class="select-item"
        placeholder="选择日期">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="会员状态:" prop="status">
      <el-select
        v-model.trim="formModel.status"
        class="select-item"
        clearable
      >
        <el-option
          v-for="item in statusSelect"
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
          name: '', // 姓名
          nickname: '', // 昵称
          status: '', // 会员状态
          birthday: '', // 生日
          phoneNumber: ''
        }
      }
    },
    categoryType: {
      type: String,
      default: '1'
    }
  },
  data() {
    return {
      changeTab: '',
      statusSelect: [
        {
          value: 1,
          label: '启用'
        },
        {
          value: 0,
          label: '禁用'
        }
      ],
      addSoreList: [],
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: '请输入昵称', trigger: 'blur' }
        ],
        phoneNumber: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        birthday: [
          { required: true, message: '请输入生日', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ]
      }

    }
  },
  created() {
  },
  methods: {

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
