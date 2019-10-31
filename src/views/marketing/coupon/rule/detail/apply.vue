<template>
  <c-card :name="title" class="form-card">
    <el-form-item label="申请人:">
      <el-input
        v-if="!isView"
        class="select-item"
        v-model.trim="formModel.applicants"
        :size="size"
        :disabled="isDisabled"
        placeholder="请输入申请人"
        clearable
      />
      <span v-else>{{formModel.applicants}}</span>
    </el-form-item>
    <el-form-item label="申请部门:">
      <el-input
        v-if="!isView"
        class="select-item"
        v-model.trim="formModel.applyingDepartment"
        :size="size"
        :disabled="isDisabled"
        placeholder="请输入申请部门"
        clearable
      />
      <span v-else>{{formModel.applyingDepartment}}</span>
    </el-form-item>
    <el-form-item label="备注:">
      <el-input
        v-if="!isView"
        type="textarea"
        :disabled="isDisabled"
        :rows="4"
        v-model.trim="formModel.remark"
        :size="size"
        maxlength="100"
        show-word-limit
        placeholder="请输入备注"
        clearable
      />
      <p v-else>{{formModel.remark}}</p>
    </el-form-item>
  </c-card>
</template>
<script>
import MixinFormCard from 'mixins/formCard'

export default {
  mixins: [MixinFormCard]
}
</script>
<style lang="less" scoped>
.form-card {
  .select-item {
    width: 30%;
  }
  .input-select {
    width: 80px;
  }
}
</style>
