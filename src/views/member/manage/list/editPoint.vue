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
        v-model.trim="formModel.curPoint"
        class="form-item"
        disabled
      ></el-input>
    </el-form-item>
    <el-form-item label="积分变动:">
      <el-input
        v-model.trim="formModel.point"
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
    return {
      formModel: {},
      rules: {
        balance: [
          { required: true, message: '请输入' }
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

<style lang='less' scoped>
</style>
