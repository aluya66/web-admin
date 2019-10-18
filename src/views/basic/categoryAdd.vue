<template>
  <el-form
    ref="formRef"
    :model="formModel"
    :rules="rules"
    label-width="120px"
    class="form"
    label-position="right"
  >
    <el-form-item label="类目名称:" prop="categoryName">
      <el-input
        v-model.trim="formModel.categoryName"
        clearable
      ></el-input>
    </el-form-item>
    <!-- <el-form-item label="图片地址:" prop="imageUrl">
      <el-input
        v-model.trim="formModel.imageUrl"
        clearable
      ></el-input>
    </el-form-item> -->
    <el-form-item label="父级分类编码:" prop="parentCode">
      <el-input
        v-model.trim="formModel.parentCode"
        clearable
      ></el-input>
    </el-form-item>
    <el-form-item label="安全级别：:" prop="safeLevel">
      <el-select
        v-model="formModel.safeLevel"
        class="search-item"
        clearable
      >
        <el-option
          v-for="item in safeLevelSelect"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="排序" prop="sortNumber">
      <el-input-number
        v-model.trim="formModel.sortNumber"
        controls-position="right"
        :min="1"
        :max="10000"
      ></el-input-number>
    </el-form-item>
    <el-form-item label="执行标准：:" prop="standard">
      <el-input
      v-model.trim="formModel.standard"
      clearable
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
          categoryName: '',
          imageUrl: '',
          parentCode: '',
          safeLevel: '',
          standard: '',
          sortNumber: 100
        }
      }
    }
  },
  data() {
    return {
      rules: {
        categoryName: [
          { required: true, message: '请填写类目名称', trigger: 'blur' }
        ],
        // imageUrl: [
        //   { required: true, message: "请填写图片地址", trigger: "blur" }
        // ],
        parentCode: [
          { required: true, message: '请填写父级分类编码', trigger: 'blur' }
        ],
        safeLevel: [
          { required: true, message: '请选择安全级别', trigger: 'change' }
        ],
        sortNumber: [
          { required: true, message: '请填写排序值', trigger: 'blur' }
        ],
        standard: [
          { required: true, message: '请填写执行标准', trigger: 'blur' }
        ]
      },
      safeLevelSelect: [
        {
          value: '',
          label: '全部'
        },
        {
          value: 1,
          label: '一级'
        },
        {
          value: 12,
          label: '二级'
        },
        {
          value: 3,
          label: '三级'
        }
      ]
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
