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
          maxlength="30"
          placeholder="请输入公司名称"
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
      <el-form-item label="款式:" prop="style">
         <el-select
          class="select-item"
          placeholder="选择款式"
          v-model="formModel.style"
        >
          <el-option
              v-for="item in intentionStyle"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="滤芯(搭配口罩):" prop="filter">
        <el-input
          class="select-item"
          maxlength="2"
          v-model.number="formModel.filter"
          :size="size"
          placeholder="请输入搭配口罩数量"
          clearable
        />
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
          maxlength="10"
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

       <el-form-item label="设计参考图:">
          <el-image class="tempimg" v-for="item in formModel.images" :key="item.id" :src="item.url"></el-image>
      </el-form-item>
      <el-form-item label="备注:" prop="remark">
        <el-input
          type="textarea"
          class="select-item"
          :rows="4"
          v-model="formModel.remark"
          disabled
          placeholder="请输入备注"
          maxlength="200"
        ></el-input>（注：最大限制输入200个字符）
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
    label: '精装',
    value: '精装'
  },
  {
    label: '简装',
    value: '简装'
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
    // 校验数字不能大于10w
    var validateMaxNums = (rule, value, callback) => {
      if (value > 1000000 || value < 1 || !/\d+/.test(value)) {
        callback(new Error('预订数量不能小于1或者大于100W'))
      } else {
        callback()
      }
    }
    // 校验数字不能大于100
    var validateMax = (rule, value, callback) => {
      if (value >= 100 || value < 0 || !/\d+/.test(value)) {
        callback(new Error('数量不能小于0或者大于99'))
      } else {
        callback()
      }
    }

    return {
      operatorStatusList: dictObj.intentionStaus, // 意向单状态
      stereotype: dictObj.stereotype, // 类型列表
      intentionColor, // 颜色列表
      filterList, // 功能列表
      orderTypeList, // 订单类型
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
        source: [
          { required: true, message: '请选择订单类型', trigger: 'change' }
        ],
        companyName: [
          { required: true, message: '请输入公司名字', trigger: 'blur' }
        ],
        features: [
          { message: '请选择功能', trigger: 'change' }
        ],
        style: [
          { required: true, message: '请选择款式', trigger: 'blur' }
        ],
        filter: [
          { required: true, message: '请输入滤芯数量', trigger: 'blur' },
          { validator: validateMax, trigger: 'blur' }
        ],
        packageName: [
          { required: true, message: '请选择包装', trigger: 'change' }
        ],
        qty: [
          { required: true, message: '请输入预订数量', trigger: 'blur' },
          { validator: validateMaxNums, trigger: 'blur' }
        ],
        expectedDtime: [
          { required: true, message: '请选择预期交付时间', trigger: 'change' }
        ],
        username: [
          { required: true, message: '请输入客户姓名', trigger: 'blur' },
          { validator: utils.validater.usernameRule, message: '只能输入中文和英文', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入客户手机号码', trigger: 'blur' },
          { validator: utils.validater.notCnEnText, message: '请输入正确的手机号码格式', trigger: 'blur' }
        ],
        remark: [
          { min: 0, max: 200, message: '长度在 0 到 200 个字符', trigger: 'blur' }
        ]
      },
      intentionStamp: dictObj.intentionStamp,
      intentionCraft: dictObj.intentionCraft,
      intentionStyle: dictObj.intentionStyle // 款式

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
