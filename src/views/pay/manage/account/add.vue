<template>
  <el-form
    ref="formRef"
    :model="formModel"
    label-width="200px"
    class="form"
    label-position="right"
  >
    <el-form-item label="app编号:">
      <span>{{ formModel.appCode }}</span>
    </el-form-item>
    <el-form-item label="渠道编号:">
      <span>{{ formModel.channelCode }}</span>
    </el-form-item>
    <el-form-item label="应用 key:">
      <span>{{ formModel.appKey }}</span>
    </el-form-item>
    <el-form-item label="商户号:">
      <span>{{ formModel.mchId }}</span>
    </el-form-item>
    <el-form-item label="应用密钥:">
      <span>{{ formModel.appSecret }}</span>
    </el-form-item>
    <el-form-item label="商户私钥:">
      <span>{{ formModel.mchPrivateKey }}</span>
    </el-form-item>
    <el-form-item label="平台公钥:">
      <span>{{ formModel.platPublicKey }}</span>
    </el-form-item>
    <el-form-item label="支付密钥Key:">
      <span>{{ formModel.payKey }}</span>
    </el-form-item>
    <el-form-item label="门店id:">
      <span>{{ formModel.shopCode }}</span>
    </el-form-item>
    <el-form-item label="创建人名字:">
      <span>{{ formModel.opCreator }}</span>
    </el-form-item>
    <el-form-item label="修改人名字:">
      <span>{{ formModel.opEditor }}</span>
    </el-form-item>
    <el-form-item label="创建时间:">
      <span>{{ formModel.created }}</span>
    </el-form-item>
    <el-form-item label="最后更新时间:">
      <span>{{ formModel.updated }}</span>
    </el-form-item>
    <el-form-item label="备份:">
      <span>{{ formModel.remark }}</span>
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
        }
      }
    }
  },
  data() {
    return {

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
}
</style>
