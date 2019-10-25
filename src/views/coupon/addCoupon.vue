<template>
  <el-form
    ref="formRef"
    :model="formModel"
    :rules="rules"
    label-width="120px"
    class="form"
    label-position="right"
  >
    <el-form-item label="劵规则" prop="goodsName">
      <el-input v-model.trim="formModel.goodsName" class="form-item"/>
    </el-form-item>
    <el-form-item label="生成数量" prop="brandName">
      <el-input v-model.trim="formModel.brandName" class="form-item"/>
    </el-form-item>
    <el-form-item label="激活截止" required>
    <el-col :span="11">
      <el-form-item prop="date1">
        <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.date1" style="width: 100%;"></el-date-picker>
      </el-form-item>
    </el-col>
    <el-col class="line" :span="2">-</el-col>
    <el-col :span="11">
      <el-form-item prop="date2">
        <el-time-picker placeholder="选择时间" v-model="ruleForm.date2" style="width: 100%;"></el-time-picker>
      </el-form-item>
    </el-col>
  </el-form-item>
    <el-form-item label="卷名称" prop="brandName">
      <el-input v-model.trim="formModel.brandName" class="form-item"/>
    </el-form-item>
    <el-form-item class="couponBtn">
      <el-button :size="size" type="primary">仅保存为草稿</el-button>
      <el-button :size="size" type="primary">保存并申请</el-button>
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
          goodsName: '',
          date1: '',
          date2: ''
        }
      }
    }
  },
  data() {
    return {
      rules: {
        goodsName: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
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

<style lang="less" scope>
.form {
  width: 90%;
  .form-item {
    width: 100%;
  }
  .couponBtn{
    display: flex;
    justify-content: space-between;
  }
}
</style>
