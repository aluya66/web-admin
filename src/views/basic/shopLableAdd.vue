<template>
  <el-form
    ref="formRef"
    :model="formModel"
    :rules="rules"
    label-width="120px"
    class="form"
    label-position="right"
  >
   <el-form-item label="标签名称:">
      <el-input
        v-model.trim="formModel.labelName"
        placeholder='请输入标签名称'
        clearable
      ></el-input>
    </el-form-item>
    <el-form-item label="标签拼音:">
      <el-input
        v-model.trim="formModel.initial"
        placeholder='请输入标签拼音'
        clearable
      ></el-input>
    </el-form-item>
    <el-form-item label="标签状态:">
      <el-select
        v-model.trim="formModel.labelStatus"
        class="search-item"
        placeholder="请选择状态"
        clearable
      >
        <el-option
          v-for="item in marketableSelect"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="创建人:">
      <el-input
      v-model.trim="formModel.createdby"
      placeholder='请输入创建人'
      clearable
      ></el-input>
    </el-form-item>
    <el-form-item label="更新人:">
      <el-input
      v-model.trim="formModel.updatedby"
      placeholder='请输入更新人'
      clearable
      ></el-input>
    </el-form-item>
    <el-form-item label="标签分类:">
      <el-checkbox-group v-model.trim="formModel.labelParentIds">
        <el-checkbox
        :label="item.id"
        v-for="(item, index) in addSoreList"
        :key="index"
        name="type"
        >{{ item.categoryName }}</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="描述:">
      <el-input
      type="textarea"
      v-model.trim="formModel.labelDesc"
      placeholder='请填写描述'
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
          labelName: '',
          initial: '',
          labelStatus: '',
          createdby: '',
          updatedby: '',
          labelParentIds: [],
          labelDesc: ''
        }
      }
    }
  },
  data() {
    return {
      marketableSelect: [
        {
          value: '1',
          label: '有效'
        },
        {
          value: '2',
          label: '无效'
        }
      ],
      rules: {
        labelName: [
          { required: true, message: '请输入标签名称', trigger: 'blur' }
        ],
        initial: [
          { required: true, message: '请输入标签拼音', trigger: 'blur' }
        ],
        labelStatus: [
          { required: true, message: '请选择状态', trigger: 'blur' }
        ],
        createdby: [
          { required: true, message: '请输入创建人', trigger: 'blur' }
        ],
        updatedby: [
          { required: true, message: '请输入更新人', trigger: 'blur' }
        ],
        labelParentIds: [
          { required: true, trigger: 'blur' }
        ],
        labelDesc: [
          { required: true, message: '请填写描述', trigger: 'blur' }
        ]
      },
      addSoreList: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.$api.basic.addSoreQuerypage(
        {
          categoryType: this.categoryType
        }
      ).then(res => {
        console.log(res.data)
        this.addSoreList = res.data
        console.log(this.addSoreList)
      })
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
