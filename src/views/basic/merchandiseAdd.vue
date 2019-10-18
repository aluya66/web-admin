<template>
  <el-form
    ref="formRef"
    :model="formModel"
    :rules="rules"
    label-width="120px"
    class="form"
    label-position="right"
  >
    <el-form-item label="参数分类:" prop="type">
      <el-select
        v-model="formModel.type"
        class="search-item"
        placeholder="请选择参数分类"
        clearable
      >
        <el-option
          v-for="item in parameterSelect"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="显示方式:" prop="paramType">
      <el-select
        v-model="formModel.paramType"
        class="search-item"
        placeholder="请选择显示方式"
        clearable
      >
        <el-option
          v-for="item in paramTypeSelect"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="名称:" prop="name">
      <el-input
        v-model.trim="formModel.name"
        placeholder='请输入名称'
        clearable
      ></el-input>
    </el-form-item>
    <el-form-item label="排序:" prop="sort">
      <el-input-number
        v-model.trim="formModel.sort"
        controls-position="right"
        :min="1"
        :max="10000"
      ></el-input-number>
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

    <el-form-item
      v-for="(item, index) in formModel.items"
      :label="'属性值'"
      :key="item.key"
      :prop="'items.' + index + '.value'"

      :rules="{
        required: true, message: '属性值不能为空', trigger: 'blur'
      }"
      >
      <el-col :span="9">
        <el-input v-model="item.value" style="width: 100%;" placeholder="属性值"></el-input>
      </el-col>
      <el-col class="line" :span="1">&nbsp;&nbsp;</el-col>
      <el-col :span="9">
        <el-input v-model="item.description" style="width: 100%;" placeholder="备注"></el-input>
      </el-col>
      <el-col class="line" :span="1">&nbsp;&nbsp;</el-col>
      <el-col :span="4">
        <el-button @click.prevent="removeDomain(item, index)" v-if="index>0">删除</el-button>
      </el-col>
    </el-form-item>
    <el-form-item>
      <el-button @click="addDomain">新增</el-button>
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
          type: '',
          name: '',
          sort: 100,
          items: [
            {
              value: '',
              description: ''
            }
          ],
          paramType: ''
        }
      }
    }
  },
  data() {
    return {
      type: '',
      parameterSelect: [
        {
          value: 1,
          label: '参数'
        },
        {
          value: 2,
          label: '属性'
        }
      ],
      paramTypeSelect: [
        {
          value: 1,
          label: 'text文本框'
        },
        {
          value: 2,
          label: 'radio单选'
        },
        {
          value: 3,
          label: 'checkbox复选框'
        }
      ],
      addSoreList: [],
      rules: {
        type: [
          { required: true, message: '请选择参数', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入名称', trigger: 'change' }
        ],
        sort: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        // paramType: [
        //   { required: true, message: '请选择', trigger: 'change' }
        // ],
        labelStatus: [
          { required: true, message: '请填写描述', trigger: 'blur' }
        ]
        // createdby: [
        //   { required: true, message: '请填写创建人', trigger: 'blur' }
        // ],
        // updatedby: [
        //   { required: true, message: '请填写更新人', trigger: 'blur' }
        // ]
      }

    }
  },
  created() {
  },
  computed: {
    formModel() {
      return this.initData
    }
  },
  methods: {
    addDomain () {
      this.formModel.items.push({
        value: '',
        description: ''
      })
    },
    removeDomain(item, index) {
      var indexItem = this.formModel.items.indexOf(item)
      if (indexItem !== -1) {
        this.formModel.items.splice(indexItem, 1)
      }
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
