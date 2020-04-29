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
    <el-form-item label="当前状态:" prop="operatorStatus">
        <el-select
          class="select-item"
          placeholder="选择当前状态"
          v-model="formModel.operatorStatus"
        >
          <el-option
              v-for="item in operatorStatusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="定制单号:">
        <el-input
          class="select-item"
          disabled
          v-model.trim="formModel.intentionNo"
          :size="size"
          placeholder="请输入定制单号"
          clearable
        />
      </el-form-item>
       <el-form-item label="提交时间:">
        <el-input
          class="select-item"
          disabled
          v-model.trim="formModel.createdAt"
          :size="size"
          placeholder="请输入提交时间"
          clearable
        />
      </el-form-item>
      <el-form-item label="用户昵称:">
        <el-input
          class="select-item"
          disabled
          v-model.trim="formModel.memberName"
          :size="size"
          placeholder="请输入用户昵称"
          clearable
        />
      </el-form-item>
      <el-form-item label="手机:">
        <el-input
          class="select-item"
          disabled
          v-model.trim="formModel.memberPhone"
          :size="size"
          placeholder="请输入手机号码"
          clearable
        />
      </el-form-item>
      <el-form-item label="版型:" prop='type'>
        <el-select
          class="select-item"
          placeholder="选择版型"
          v-model="formModel.type"
        >
          <el-option
              v-for="item in stereotype"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="颜色:" prop="color">
         <el-select
          class="select-item"
          placeholder="选择颜色"
          v-model="formModel.color"
        >
          <el-option
              v-for="item in intentionColor"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="印花:" prop="printing">
         <el-select
          class="select-item"
          placeholder="选择印花图案"
          v-model="formModel.printing"
        >
        <el-option
            v-for="item in intentionStamp"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="功能:" prop="features">
        <el-select
          class="select-item"
          placeholder="选择功能类型"
          v-model="formModel.features"
        >
        <el-option
            v-for="item in intentionCraft"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="滤芯:" prop="filter">
        <el-select
          class="select-item"
          placeholder="选择滤芯"
          v-model="formModel.filter"
        >
        <el-option
            v-for="item in filterList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="包装:" prop="packageName">
        <el-select
          class="select-item"
          placeholder="选择包装类型"
          v-model="formModel.packageName"
        >
        <el-option
            v-for="item in packageNameList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
       <el-form-item label="预订数量:" prop="qty">
        <el-input
          class="select-item"
          v-model.number="formModel.qty"
          :size="size"
          maxlength="50"
          placeholder="请输入数量"
          clearable
        />
      </el-form-item>
      <el-form-item label="预期交付时间:" prop="expectedDtime">
        <el-date-picker
          v-model="formModel.expectedDtime"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions"
          type="date"
          class="select-item"
          placeholder="选择日期">
      </el-date-picker>
    </el-form-item>
      <el-form-item label="客户姓名:" prop='username'>
        <el-input
          class="select-item"
          v-model.trim="formModel.username"
          maxlength="50"
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
          placeholder="请输入手机号码"
          clearable
        />
      </el-form-item>
       <el-form-item label="设计参考图:">
          <el-image class="tempimg" v-for="item in formModel.images" :key="item.id" :src="item.url"></el-image>
      </el-form-item>
      <el-form-item label="备注:" prop="remark">
        <el-input
          type="textarea"
          class="select-item"
          v-model.trim="formModel.remark"
          placeholder="请输入备注"
          maxlength="200"
          show-word-limit
        ></el-input>
      </el-form-item>
    </el-form>
</c-card>
</template>

<script>
import dictObj from '@/store/dictData'
import CCard from 'components/card'
import utils from '@/utils'

// 意向单颜色
const intentionColor = [
  {
    label: '黑色',
    value: '黑色'
  },
  {
    label: '白色',
    value: '白色'
  },
  {
    label: '灰色',
    value: '灰色'
  },
  {
    label: '红色',
    value: '红色'
  },
  {
    label: '绿色',
    value: '绿色'
  },
  {
    label: '黄色',
    value: '黄色'
  }
]

// 滤芯列表
const filterList = [
  {
    label: '不需要',
    value: '不需要'
  },
  {
    label: '1片',
    value: '1片'
  },
  {
    label: '5片',
    value: '5片'
  }
]

// 滤芯列表
const packageNameList = [
  {
    label: '标准包装设计',
    value: '标准包装设计'
  },
  {
    label: '自定义设计',
    value: '自定义设计'
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
      operatorStatusList: dictObj.intentionStaus, // 意向单状态
      stereotype: dictObj.stereotype, // 类型列表
      intentionColor, // 颜色列表
      filterList, // 功能列表
      packageNameList, // 包装列表
      pickerOptions: { // 日期过滤
        disabledDate(time) {
          return new Date(vm.formModel.createdAt) > time
        }
      },
      rules: {
        operatorStatus: [
          { required: true, message: '请选择当前意向单状态', trigger: 'change' }
        ],
        type: [
          { required: true, message: '请选择版型', trigger: 'change' }
        ],
        color: [
          { required: true, message: '请选择颜色', trigger: 'change' }
        ],
        printing: [
          { required: true, message: '请选择印花', trigger: 'change' }
        ],
        features: [
          { required: true, message: '请选择工艺', trigger: 'change' }
        ],
        filter: [
          { required: true, message: '请选择滤芯', trigger: 'change' }
        ],
        packageName: [
          { required: true, message: '请选择包装', trigger: 'change' }
        ],
        qty: [
          { required: true, message: '请输入预订数量', trigger: 'blur' },
          { type: 'number', message: '请输入正确的数字', trigger: 'blur' }
        ],
        expectedDtime: [
          { required: true, message: '请选择预期交付时间', trigger: 'change' }
        ],
        username: [
          { required: true, message: '请输入客户姓名', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入客户手机号码', trigger: 'blur' },
          { validator: utils.validater.phoneNumber, message: '请输入正确的手机号码格式', trigger: 'blur' }
        ],
        remark: [
          { min: 0, max: 200, message: '长度在 0 到 200 个字符', trigger: 'blur' }
        ]
      },
      intentionStamp: dictObj.intentionStamp,
      intentionCraft: dictObj.intentionCraft

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
