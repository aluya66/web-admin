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
    <el-form-item label="用户姓名:">
      <el-input
        v-model.trim="formModel.name"
        class="form-item"
        disabled
      ></el-input>
    </el-form-item>
    <el-form-item label="昵称:">
      <el-input
        v-model.trim="formModel.nickname"
        class="form-item"
        disabled
      ></el-input>
    </el-form-item>
    <el-form-item label="手机号:" prop="phoneNumber">
      <el-input
        v-model.trim="formModel.phoneNumber"
        class="form-item"
        disabled
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
    <el-form-item label="会员状态:" prop="isEnable">
      <el-select
        v-model.trim="formModel.isEnable"
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
    <el-form-item label="分享状态:" prop="shareStatus">
      <el-select
        v-model.trim="formModel.shareStatus"
        class="select-item"
        clearable
      >
        <el-option
          v-for="item in shareStatusList"
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
      default() {}
    }
  },
  data() {
    return {
      formModel: {},
      shareStatusList: [
        {
          value: 1,
          label: '启用'
        },
        {
          value: 0,
          label: '禁用'
        }
      ],
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
      rules: {
        birthday: [
          { required: true, message: '请输入生日', trigger: 'blur' }
        ],
        isEnable: [
          { required: true, message: '请选择会员状态', trigger: 'change' }
        ],
        shareStatus: [
          { required: true, message: '请选择分享状态', trigger: 'change' }
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
        this.formModel = Object.assign({}, res, { userId, appCode }) || {}
      })
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
