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
    <el-form-item label="类型名称:" prop="categoryName">
      <el-input v-model.trim="formModel.categoryName" class="form-item" clearable/>
    </el-form-item>
    <el-form-item label="业务线:" prop="categoryLob">
      <query-dict
        :dict-list="lobList"
        class="form-select"
        disabled
        placeholder="请选择业务线"
        :value.sync="formModel.categoryLob"
      ></query-dict>
    </el-form-item>
    <el-form-item label="类型分类:" prop="categoryType">
      <query-dict
        :dict-list="categoryType"
        class="form-select"
        placeholder="请选择类型分类"
        :value.sync="formModel.categoryType"
      ></query-dict>
      <span class="input-info">* 区分属性与标签</span>
    </el-form-item>
    <el-form-item label="类型描述:" prop="categoryDesc">
      <el-input
        type="textarea"
        :rows="3"
        maxlength="300"
        show-word-limit
        placeholder="请输入类型描述"
        v-model.trim="formModel.categoryDesc"
      ></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
import dictObj from '@/store/dictData'
import MixinForm from 'mixins/form'

export default {
  mixins: [MixinForm],
  props: {
    initData: {
      type: Object,
      default() {
        return {
          categoryName: '', // 标签类型
          categoryLob: 'commons', // 业务线
          categoryType: '', // 类型分类
          categoryDesc: '' // 描述
        }
      }
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      lobList: dictObj.lobList, // 业务线集合
      categoryType: dictObj.categoryType, // 类型分类集合
      rules: {
        categoryName: [
          { required: true, message: '请输入类型名称', trigger: 'blur' }
        ],
        categoryLob: [
          { required: true, message: '请选择业务线', trigger: 'change' }
        ],
        categoryType: [
          { required: true, message: '请选择分类类型', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    formModel: {
      get() {
        return this.initData
      },
      set(val) {
        this.$emit('update:init-data', val)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.form {
  margin-right: 50px;
  .form-item {
    width: 100%;
  }
  .form-select{
    width: 50%;
  }
}
</style>
