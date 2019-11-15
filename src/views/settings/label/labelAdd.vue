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
    <el-form-item label="标签名称" prop="tagName">
      <el-input v-model.trim="formModel.tagName" class="form-item" clearable></el-input>
    </el-form-item>
    <el-form-item label="标签类型" prop="categoryId">
      <query-dict
        :dict-list="tagType"
        class="form-select"
        placeholder="请选择标签类型"
        :value.sync="formModel.categoryId"
      ></query-dict>
    </el-form-item>
    <el-form-item label="标签状态:" prop="tagStatus">
      <query-dict
        :dict-list="disStatus"
        class="form-select"
        placeholder="请选择标签状态"
        :value.sync="formModel.tagStatus"
      ></query-dict>
    </el-form-item>
    <el-form-item label="显示方式:" prop="operateType">
      <query-dict
        :dict-list="pageItemType"
        class="form-select"
        placeholder="请选择显示方式"
        :value.sync="formModel.operateType"
      ></query-dict>
    </el-form-item>
    <el-form-item label="标签描述:" prop="tagDesc">
      <el-input
        type="textarea"
        :rows="3"
        maxlength="300"
        show-word-limit
        placeholder="请输入标签描述"
        v-model="formModel.tagDesc"
      ></el-input>
    </el-form-item>
    <el-form-item
      v-for="(item, index) in formModel.tagValues"
      :label="'标签值 '+ (index + 1)"
      :key="index"
      :prop="'tagValues.' + index + '.value'"
      :rules="{
        required: true, message: '标签值不能为空', trigger: 'blur'
      }"
    >
      <el-col :span="10">
        <el-input v-model="item.value" placeholder="标签值"></el-input>
      </el-col>
      <el-col class="line" :span="1">&nbsp;&nbsp;</el-col>
      <el-col :span="2">
        <el-button @click.prevent="removeHandle(item, index)">删除</el-button>
      </el-col>
    </el-form-item>
    <el-form-item>
      <el-button @click="addHandle">新增</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import MixinForm from 'mixins/form'
import dictObj from '@/store/dictData'

export default {
  mixins: [MixinForm],
  props: {
    initData: {
      type: Object,
      default() {
        return {
          tagName: '', // 标签名称
          categoryId: '', // 标签类型
          tagStatus: 1, // 标签状态
          tagDesc: '', // 标签描述
          operateType: '', // 显示类型
          tagValues: [{ // 标签值
            value: ''
          }]
        }
      }
    },
    tagType: {
      type: Array,
      default() {
        return []
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
      disStatus: dictObj.disStatus, // 启用/禁用
      pageItemType: [{
        label: '文本',
        value: 1
      }, {
        label: '复选',
        value: 2
      }, {
        label: '单选',
        value: 3
      }, {
        label: '下拉',
        value: 4
      }, {
        label: '多文本',
        value: 5
      }], // 页面显示类型
      rules: {
        tagName: [
          { required: true, message: '请输入标签名称', trigger: 'blur' }
        ],
        categoryId: [
          { required: true, message: '请选择标签类型', trigger: 'change' }
        ],
        operateType: [
          { required: true, message: '请选择显示方式', trigger: 'change' }
        ],
        tagStatus: [
          { required: true, message: '请选择标签状态', trigger: 'change' }
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
    addHandle() {
      this.formModel.tagValues.push({
        value: ''
      })
    },
    removeHandle(item, index) {
      this.formModel.tagValues.splice(index, 1)
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
  .form-select{
    width: 50%;
  }
}
</style>
