<template>
<c-card :name="title" class="form-card" id="form-pay">
    <el-form
      ref="formRef"
      :model="formModel"
      :rules="rules"
      label-width="120px"
      class="form"
      label-position="right"
    >
      <el-form-item label="定制单金额:" prop="payAmount">
        <el-input
          class="select-item"
           v-model="formModel.payAmount"
            :size="size"
          maxlength="10"
          placeholder="请输入定制单金额"
          clearable
        />
      </el-form-item>
       <el-form-item label="付款状态:" prop="payStatus">
         <el-select
          class="select-item"
          placeholder="选择状态"
          v-model="formModel.payStatus"
        >
        <el-option
            v-for="item in payStatus"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
    <el-form-item label="付款方式:" prop="payType">
        <el-input
          class="select-item"
          v-model="formModel.payType"
          :size="size"
          maxlength="50"
          placeholder="付款方式"
          clearable
        />
      </el-form-item>
      <el-form-item label="付款时间:" prop="payTime">
        <el-date-picker
          v-model="formModel.payTime"
          value-format="yyyy-MM-dd"
          type="date"
          class="select-item"
          placeholder="选择日期">
      </el-date-picker>
    </el-form-item>
    </el-form>
</c-card>
</template>

<script>
import CCard from 'components/card'
// 付款状态
const payStatus = [
  {
    label: '待支付',
    value: 1
  },
  {
    label: '已付款',
    value: 2
  },
  {
    label: '已退款',
    value: 3
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
  data() {
    // 付款金额不能大于1000w
    var validateMaxNums = (rule, value, callback) => {
      const temp = /^(\d+)(.\d{0,2})?$/
      if (!temp.test(value) && value) {
        callback(new Error('请输入正数且小数只能包含2位'))
      } else if ((value < 1 || value > 10000000) && value) {
        callback(new Error('付款金额不能小于1或大于1000W'))
      } else {
        callback()
      }
    }
    return {
      payStatus,
      rules: {
        payAmount: [
          { validator: validateMaxNums, trigger: 'blur' }
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
