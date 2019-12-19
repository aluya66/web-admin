<template>
  <c-card :name="title" class="form-card" id="form-apply">
    <el-form
      ref="applyFormRef"
      :model="formModel"
      label-width="120px"
      class="form"
      label-position="right"
    >
      <el-form-item label="申请人:">
        <el-input
          class="form-item"
          v-model.trim="formModel.applicants"
          :size="size"
          placeholder="请输入申请人"
          clearable
        />
      </el-form-item>
      <el-form-item label="申请部门:">
        <el-input
          class="form-item"
          v-model.trim="formModel.applyingDepartment"
          :size="size"
          placeholder="请输入申请部门"
          clearable
        />
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" v-model.trim="formModel.remark" :disabled="isDisabled" />
      </el-form-item>
    </el-form>
  </c-card>
</template>
<script>
import MixinForm from 'mixins/form'
import MixinFormCard from 'mixins/formCard'

export default {
  mixins: [MixinForm, MixinFormCard]
}
</script>
<style lang="less" scoped>
.form {
  .form-item {
    width: 50%;
  }
  .select-item {
    width: 30%;
  }
}
</style>
