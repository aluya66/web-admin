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
    <el-form-item label="积分余额:">
      <el-input
        v-model.number="formModel.curPoint"
        class="form-item"
        disabled
      ></el-input>
    </el-form-item>
    <el-form-item label="积分变动:" prop="point">
      <el-input
        v-model.number="formModel.point"
        class="form-item"
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
    const checkPoint = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('积分不能为空'))
      }
      if (!Number(value)) {
        return callback(new Error('请输入数字值'))
      }
      callback()
    }
    return {
      formModel: {},
      rules: {
        point: [
          { required: true, validator: checkPoint, trigger: 'blur' }
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
        const curPoint = res.point || 0 // 当前余额
        this.formModel = Object.assign({}, { curPoint }, { userId, appCode }) || {}
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
}
</style>
