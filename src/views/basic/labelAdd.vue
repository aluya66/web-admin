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
   <el-form-item label="标签名称:" prop="labelName">
      <el-input
        v-model.trim="formModel.labelName"
        class="form-item"
        clearable
      ></el-input>
    </el-form-item>
    <!-- <el-form-item label="标签拼音:" prop="initial">
      <el-input
        v-model.trim="formModel.initial"
        placeholder='请输入标签拼音'
        clearable
      ></el-input>
    </el-form-item> -->
    <el-form-item label="标签状态:" prop="labelStatus">
      <el-select
        v-model.trim="formModel.labelStatus"
        class="select-item"
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
    <!-- <el-form-item label="创建人:" prop="createdby">
      <el-input
      v-model.trim="formModel.createdby"
      placeholder='请输入创建人'
      clearable
      ></el-input>
    </el-form-item>
    <el-form-item label="更新人:" prop="updatedby">
      <el-input
      v-model.trim="formModel.updatedby"
      placeholder='请输入更新人'
      clearable
      ></el-input>
    </el-form-item> -->
    <el-form-item label="标签分类:" prop="labelParentIds">
      <el-checkbox-group v-model="formModel.labelParentIds">
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
      class="form-item"
      v-model.trim="formModel.labelDesc"
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
          labelStatus: 1,
          labelParentIds: [],
          labelDesc: ''
        }
      }
    },
    categoryType: {
      type: String,
      default: '1'
    }
  },
  data() {
    return {
      changeTab: '',
      marketableSelect: [
        {
          value: 1,
          label: '有效'
        },
        {
          value: 2,
          label: '无效'
        }
      ],
      addSoreList: [],
      rules: {
        labelName: [
          { required: true, message: '请输入标签名称', trigger: 'blur' }
        ],
        // initial: [
        //   { required: true, message: '请输入标签拼音', trigger: 'blur' }
        // ],
        labelStatus: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        labelParentIds: [
          { required: true, message: '请选择标签分类', trigger: 'change' }
        ],
        labelDesc: [
          { required: true, message: '请填写描述', trigger: 'blur' }
        ]
      }

    }
  },
  created() {
    this.changeTab = this.categoryType
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.$api.basic.addSoreQuerypage(
        {
          categoryType: this.categoryType
        }
      ).then(res => {
        this.addSoreList = res.data
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

<style lang="less" scoped>
.form {
  width: 90%;
  .form-item {
    width: 100%;
  }
  .select-item{
    width: 50%
  }
}
</style>
