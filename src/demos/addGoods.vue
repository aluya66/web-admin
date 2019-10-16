<template>
  <el-form
    ref="formRef"
    :model="formModel"
    :rules="rules"
    label-width="120px"
    class="form"
    label-position="right"
  >
    <el-form-item label="商品名称" prop="goodsName">
      <el-input v-model.trim="formModel.goodsName" class="form-item"/>
    </el-form-item>
    <el-form-item label="品牌" prop="brandName">
      <el-input v-model.trim="formModel.brandName" class="form-item"/>
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
          goodsName: ''
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

<style lang="less">
.form {
  width: 90%;
  .form-item {
    width: 100%;
  }
}
</style>
