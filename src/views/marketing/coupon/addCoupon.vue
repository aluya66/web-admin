<template>
  <el-form
    ref="formRef"
    :model="formModel"
    :rules="rules"
    label-width="120px"
    class="form"
    label-position="right"
  >
    <el-form-item label="劵名称" prop="couponName">
      <el-input v-model.trim="formModel.couponName" class="form-item"/>
    </el-form-item>
    <el-row>
      <el-col :span="13">
        <el-form-item label="劵规则" prop="couponRuleId">
          <el-input v-model.trim="formModel.couponRuleId" class="form-item"/>
        </el-form-item>
      </el-col>
      <el-col :span="8" class="test-item">
        <a href="#">劵规则查询</a>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="13">
        <el-form-item label="生成数量" prop="couponNumber">
          <el-input-number
            v-model.trim="formModel.couponNumber"
            class="form-item"
            controls-position="right"
            :min="1"
            :max="10000"
          ></el-input-number>
        </el-form-item>
      </el-col>
      <el-col :span="8" class="test-item">
        <span>单位：张</span>
      </el-col>
    </el-row>
    <el-form-item label="激活时间类型:" prop="limitActivateDayType">
      <el-select
        v-model="formModel.limitActivateDayType"
        class="select-item"
        clearable
        :disabled="activateType"
        @change="changeType"
        >
        <el-option
          v-for="item in limitSelect"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="激活时间">
      <el-col :span="11">
        <el-form-item>
          <el-date-picker
            type="date"
            placeholder="选择激活开始时间"
            v-model="formModel.limitActivateTimeStart"
            class="form-item"
            :disabled="formModel.limitActivateDayType === 1"
          ></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col class="line" :span="2">&nbsp;</el-col>
      <el-col :span="11">
        <el-form-item>
          <el-date-picker
            type="date"
            placeholder="选择激活结束时间"
            v-model="formModel.limitActivateTimeEnd"
            class="form-item"
            :disabled="formModel.limitActivateDayType === 1"
          ></el-date-picker>
        </el-form-item>
      </el-col>
    </el-form-item>
    <el-form-item label="激活时间(月份)">
      <el-select
        v-model="formModel.limitActivateMonths"
        class="select-item"
        clearable
        :disabled="formModel.limitActivateDayType === 1"
        >
        <el-option
          v-for="item in limitMonthsSelect"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="激活时间(天数)">
      <el-input-number
        v-model.trim="formModel.limitActivateDays"
        class="select-item"
        controls-position="right"
        :min="1"
        :max="100"
      ></el-input-number>
    </el-form-item>

    <el-form-item label="过期时间类型:" prop="limitExpireDayType">
      <el-select
        v-model="formModel.limitExpireDayType"
        class="select-item"
        clearable
        :disabled="pastType"
        >
        <el-option
          v-for="item in endLimitSelect"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="激活时间(天数)">
      <el-input-number
        v-model.trim="formModel.limitExpireDay"
        class="select-item"
        controls-position="right"
        :min="1"
        :max="100"
        :disabled="formModel.limitExpireDayType === 0 || formModel.limitExpireDayType === 1"
      ></el-input-number>
    </el-form-item>
    <el-form-item label="过期时间">
      <el-col :span="11">
        <el-form-item>
          <el-date-picker
            type="date"
            placeholder="选择有效期开始时间"
            v-model="formModel.limitExpireTimeStart"
            class="form-item"
            :disabled="formModel.limitExpireDayType === 0 || formModel.limitExpireDayType === 2"
          ></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col class="line" :span="2">&nbsp;</el-col>
      <el-col :span="11">
        <el-form-item>
          <el-date-picker
            type="date"
            placeholder="选择有效期结束时间"
            v-model="formModel.limitExpireTimeEnd"
            class="form-item"
            :disabled="formModel.limitExpireDayType === 0 || formModel.limitExpireDayType === 2"
          ></el-date-picker>
        </el-form-item>
      </el-col>
    </el-form-item>

    <el-form-item label="提交状态" required>
      <el-select v-model="formModel.submitStatus" class="select-item" clearable>
        <el-option
          v-for="item in submitSelect"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="描述:">
      <el-input type="textarea" class="form-item" v-model.trim="formModel.couponRemark" clearable></el-input>
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
          couponName: '', // 劵名称
          couponNumber: 1, // 生成数量
          limitActivateDayType: '', // 激活时间类型
          limitActivateTimeStart: '', // 激活开始时间
          limitActivateTimeEnd: '', // 激活结束时间
          limitActivateDays: '', // 激活时间_天数
          limitActivateMonths: '', // 激活时间_月份

          limitExpireDayType: '', // 过期时间类型
          limitExpireDay: '', // 有效期截止类型_天数
          limitExpireTimeStart: '', // 有效期开始时间
          limitExpireTimeEnd: '', // 有效期结束时间
          submitSelect: '', // 提交状态
          couponRuleId: '', // 劵规则ID
          couponRemark: '' // 备注
        }
      }
    }
  },
  data() {
    return {
      activateType: false,
      pastType: false,
      limitSelect: [
        {
          label: '固定时间领取',
          value: 0
        },
        {
          label: '所有时间领取',
          value: 1
        }
      ],
      endLimitSelect: [
        {
          label: '无时间限制',
          value: 0
        },
        {
          label: '固定时间',
          value: 1
        },
        {
          label: '领取时间',
          value: 2
        }
      ],
      submitSelect: [
        {
          label: '草稿',
          value: 0
        },
        {
          label: '提交审核',
          value: 1
        }
      ],
      limitMonthsSelect: [
        {
          label: '一月',
          value: 1
        },
        {
          label: '二月',
          value: 2
        },
        {
          label: '三月',
          value: 3
        },
        {
          label: '四月',
          value: 4
        },
        {
          label: '五月',
          value: 5
        },
        {
          label: '六月',
          value: 6
        },
        {
          label: '七月',
          value: 7
        },
        {
          label: '八月',
          value: 8
        },
        {
          label: '九月',
          value: 9
        },
        {
          label: '十月',
          value: 10
        },
        {
          label: '十一月',
          value: 11
        },
        {
          label: '十二月',
          value: 12
        }
      ],
      rules: {
        couponRuleId: [
          { required: true, message: '请输入卡劵类型ID', trigger: 'blur' }
        ],
        limitActivateDayType: [
          { required: true, message: '请输入激活时间类型', trigger: 'change' }
        ],
        limitExpireDayType: [
          { required: true, message: '请输入过期时间类型', trigger: 'change' }
        ],
        couponNumber: [
          { required: true, message: '请填写数量', trigger: 'blur' }
        ],
        // limitActivateTimeStart: [
        //   { required: true, message: "请选择时间", trigger: "change" }
        // ],
        // limitActivateDay: [
        //   { required: true, message: "请选择日期", trigger: "change" }
        // ],
        couponName: [
          { required: true, message: '请输入卡劵名称', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    changeType(val) {
      console.log(val)
    }
  },
  computed: {
    formModel() {
      return this.initData
    }
  }
}
</script>

<style lang="less" scope>
.form {
  width: 90%;
  .form-item {
    width: 100%;
  }
  .select-item {
    width: 46%;
  }
  .test-item {
    line-height: 38px;
    margin-left: 10px;
  }
}
</style>
