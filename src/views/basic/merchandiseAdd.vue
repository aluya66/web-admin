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
    <el-col :span="12">
      <el-form-item label="参数分类:" prop="type">
        <el-select
          v-model="formModel.type"
          class="select-type"
          :disabled="isEdit"
          @change="changeType"
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
    </el-col>
    <el-col :span="12">
      <el-form-item label="显示方式:" prop="paramType">
        <el-select
          v-model="formModel.paramType"
          class="select-type"
          :popper-append-to-body="false"
          :disabled="formModel.type === 2"
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
    </el-col>
    <el-form-item label="类型名称:" prop="name">
      <el-input v-model.trim="formModel.name" class="form-item" clearable></el-input>
    </el-form-item>
    <el-form-item label="排序:">
      <el-input-number
        v-model.trim="formModel.sort"
        class="sort-item"
        controls-position="right"
        :min="1"
        :max="10000"
      ></el-input-number>
    </el-form-item>
    <el-form-item
      v-for="(item, index) in formModel.items"
      :label="'属性值'"
      :key="item.key"
      :prop="'items.' + index + '.value'"
      :rules="{
        required: true, message: '属性值不能为空', trigger: 'blur'
      }"
    >
      <el-col :span="10">
        <el-input v-model="item.value" style="width: 100%;" placeholder="属性值"></el-input>
      </el-col>
      <el-col class="line" :span="1">&nbsp;&nbsp;</el-col>
      <el-col :span="10">
        <el-input v-model="item.description" style="width: 100%;" placeholder="备注"></el-input>
      </el-col>
      <el-col class="line" :span="1">&nbsp;&nbsp;</el-col>
      <el-col :span="2">
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
          paramType: 'checkbox'
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
      parameterSelect: [
        {
          value: 0,
          label: '分类'
        },
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
          value: 'checkbox',
          label: '复选框'
        },
        {
          value: 'radio',
          label: '单选框'
        },
        {
          value: 'select',
          label: '下拉选择'
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
        // sort: [
        //   { required: true, message: '请选择', trigger: 'change' }
        // ],
        paramType: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        labelStatus: [
          { required: true, message: '请填写描述', trigger: 'blur' }
        ]
      }

    }
  },
  computed: {
    formModel() {
      return this.initData
    }
  },
  methods: {
    changeType(val) {
      if (val === 2) {
        this.formModel.paramType = 'checkbox'
      } else if (val === 0) {
        this.formModel.paramType = 'select'
      }
    },
    addDomain() {
      this.formModel.items.push({
        value: '',
        description: ''
      })
    },
    removeDomain(item, index) {
      this.formModel.items.splice(index, 1)
      if (item.id) {
        this.delArr.push({ id: item.id })
      }
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
  .select-type {
    width: 100%;
  }
  .sort-item {
    width: 41.8%;
  }
}
.body .el-select {
  position: fixed !important;
}
.select-item {
  width: 50%;
}
</style>
