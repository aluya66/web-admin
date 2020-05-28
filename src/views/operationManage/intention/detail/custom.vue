<template>
<c-card :name="title" class="form-card" id="form-base">
    <el-form
      ref="formRef"
      :model="formModel"
      label-width="120px"
      :rules="rules"
      class="form"
      label-position="right"
    >

       <el-form-item label="客户姓名:" prop='username'>
        <el-input
          class="select-item"
          v-model.trim="formModel.username"
          maxlength="20"
          :size="size"
          placeholder="请输入客户姓名"
          clearable
        />
      </el-form-item>
      <el-form-item label="手机:" prop="mobile">
        <el-input
          class="select-item"
          v-model.trim="formModel.mobile"
          :size="size"
          maxlength="20"
          placeholder="请输入手机号码"
          clearable
        />
      </el-form-item>
      <el-form-item label="订单类型:" prop="source">
         <el-select
          class="select-item"
          placeholder="请选择订单类型"
          v-model="formModel.source"
        >
          <el-option
              v-for="item in orderTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="公司名称:" prop="companyName">
        <el-input
          class="select-item"
          v-model.trim="formModel.companyName"
          :size="size"
          maxlength="50"
          placeholder="请输入公司名称"
          clearable
        />
      </el-form-item>

    </el-form>
</c-card>
</template>

<script>
import CCard from 'components/card'
import utils from '@/utils'

// 订单类型
const orderTypeList = [
  {
    label: '国内订单',
    value: '国内订单'
  },
  {
    label: '国外订单',
    value: '国外订单'
  }
]

export default {
  components: {
    CCard
  },
  computed: {
    formModel() {
      return this.dataObj
    }
  },
  data(vm) {
    return {
      orderTypeList,
      rules: {
        username: [
          { required: true, message: '请输入客户姓名', trigger: 'blur' },
          { validator: utils.validater.usernameRule, message: '只能输入中文和英文', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入客户手机号码', trigger: 'blur' },
          { validator: utils.validater.notCnEnText, message: '请输入正确的手机号码格式', trigger: 'blur' }
        ],
        source: [
          { required: true, message: '请选择订单类型', trigger: 'change' }
        ],
        companyName: [
          { required: true, message: '请输入公司名称', trigger: 'blur' }
        ]
      }

    }
  },
  props: {
    title: String,
    dataObj: {
      type: Object,
      required: true
    },
    size: {
      type: String,
      default: 'medium'
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {

    }
  }

}
</script>

<style lang="less" scoped>
.form-card {
  .el-form-item {
    width: 98%;
    margin-bottom: 15px;
  }
  .select-item {
    width: 30%;
  }
  .pic {
    padding-bottom: 25px;
    span {
      display: inline-block;
      margin-bottom: 10px;
    }
    .info {
      line-height: 20px;
      height: 20px;
      margin-top: 5px;
      font-size: @f12;
    }
  }
  .tempimg {
    width: 200px;
    height: 200px;
    display: inline-block;
    margin-right: 5px;
  }
}
</style>
