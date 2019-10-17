<template>
  <c-card :name="title" class="form-item">
    <el-form-item label="基础分类:">
        <el-input
          v-model="formModel.categoryName"
          :size="size"
          placeholder="请输入基础分类"
          clearable
        />
    </el-form-item>
  </c-card>
</template>
<script>
import CCard from 'components/card'

export default {
  data() {
    return {
    }
  },
  props: {
    title: String,
    dataObj: Object,
    size: {
      type: String,
      default: 'medium'
    }
  },
  computed: {
    formModel() {
      return this.dataObj
    }
  },
  components: {
    CCard
  }
}
</script>
<style lang="less" scoped>
.form-item {
  .el-form-item {
    width: 97%;
  }
}
</style>
