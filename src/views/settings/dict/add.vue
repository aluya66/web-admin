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
    <el-form-item label="字典名称" prop="dictName">
      <el-input v-model.trim="formModel.dictName" class="form-item" clearable></el-input>
    </el-form-item>
    <el-form-item label="字典编码" prop="dictCode">
      <el-input v-model.trim="formModel.dictCode" :disabled="isEdit" class="form-item" clearable></el-input>
    </el-form-item>
    <el-form-item label="业务线编码:" prop="dictLob">
      <el-input v-model.trim="formModel.dictLob" class="form-item" placeholder="请输入业务线编码，默认使用commons" clearable></el-input>
    </el-form-item>
    <el-form-item label="状态:" prop="status">
      <el-radio-group v-model="formModel.status">
        <el-radio :label="0">禁用</el-radio>
        <el-radio :label="1">启用</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="备注:" prop="remark">
      <el-input
        type="textarea"
        :rows="2"
        maxlength="100"
        show-word-limit
        placeholder="请输入备注"
        v-model="formModel.remark"
      ></el-input>
    </el-form-item>
    <el-form-item
      v-for="(item, index) in formModel.values"
      :label="'字典值 '+ (index + 1)"
      :key="index"
      :prop="'values.' + index + '.dictValue'"
      :rules="{
        required: true, message: '字典值不能为空', trigger: 'blur'
      }"
    >
      <el-col :span="10">
        <el-input v-model="item.dictValue" placeholder="字典值"></el-input>
      </el-col>
      <el-col class="line" :span="1">&nbsp;&nbsp;</el-col>
      <el-col :span="2">
        <el-button @click.prevent="removeDict(item, index)">删除</el-button>
      </el-col>
    </el-form-item>
    <el-form-item>
      <el-button @click="addDict">新增</el-button>
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
          dictName: '',
          dictCode: '',
          dictLob: 'commons',
          remark: '',
          values: [{
            dictValue: ''
          }],
          status: 1
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
      delArr: [], // 删除id集合
      rules: {
        dictName: [
          { required: true, message: '请输入字典名称', trigger: 'blur' }
        ],
        dictCode: [
          { required: true, message: '请输入字典编码', trigger: 'blur' }
        ],
        dictLob: [
          { required: true, message: '请输入业务线编码', trigger: 'blur' }
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
  },
  methods: {
    addDict() {
      this.formModel.values.push({
        dictValue: ''
      })
    },
    removeDict(item, index) {
      this.formModel.values.splice(index, 1)
      if (item.id) {
        this.delArr.push({ id: item.id })
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
}
</style>
