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
    <el-form-item label="名称:" prop="couponName">
      <el-input
        v-model.trim="formModel.couponName"
        class="form-item"
        maxlength="30"
        clearable
        placeholder="合作或营销项目，如云尚异业合作"
      ></el-input>
    </el-form-item>
    <el-form-item label="金额:" prop="faceValue">
      <el-input
        v-model.trim.number="formModel.faceValue"
        class="form-item"
        clearable
        placeholder="兑换码绑卡的金额"
      ></el-input>
    </el-form-item>
    <el-form-item label="数量:" prop="couponNumber">
      <el-input
        v-model.trim.number="formModel.couponNumber"
        class="form-item"
        clearable
        placeholder="根据项目设定发出的数量"
      ></el-input>
    </el-form-item>
    <el-form-item label="赠送金额:">
      <el-input
        v-model.trim.number="formModel.givingValue"
        class="form-item"
        clearable
        placeholder="选填"
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
          couponName: '', // 名称
          faceValue: '', // 金额
          couponNumber: '', // 数量
          givingValue: '' // 赠送金额
        }
      }
    }
  },
  data() {
    return {
      rules: {
        couponName: [{ required: true, message: '请填写名称', trigger: 'blur' }],
        faceValue: [{ required: true, type: 'number', message: '请填写金额', trigger: 'blur' }],
        couponNumber: [{ required: true, type: 'number', message: '请填写数量', trigger: 'blur' }]
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
</style>
