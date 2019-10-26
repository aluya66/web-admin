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
    <!-- <el-form-item label="卡劵类型" prop="couponName">
      <el-input v-model.trim="formModel.couponName" class="form-item"/>
    </el-form-item>
    <el-form-item label="卡劵类型名称" prop="couponName">
      <el-input v-model.trim="formModel.couponName" class="form-item"/>
    </el-form-item> -->
    <el-form-item label="劵规则" prop="couponRuleId">
      <el-input v-model.trim="formModel.couponRuleId" class="form-item"/>
    </el-form-item>
    <el-form-item label="生成数量" prop="couponNumber">
      <el-input-number
        v-model.trim="formModel.couponNumber"
        class="select-item"
        controls-position="right"
        :min="1"
        :max="10000"
      ></el-input-number>
    </el-form-item>
    <el-form-item label="激活截止" required>
      <el-col :span="11">
        <el-form-item prop="limitActivateDay">
          <el-date-picker type="date" placeholder="选择日期" v-model="formModel.limitActivateDay" style="width: 100%;"></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col class="line" :span="2">&nbsp;</el-col>
      <el-col :span="11">
        <el-form-item prop="limitActivateTimeStart">
          <el-time-picker placeholder="选择时间" v-model="formModel.limitActivateTimeStart" style="width: 100%;"></el-time-picker>
        </el-form-item>
      </el-col>
    </el-form-item>
    <el-form-item label="描述:">
      <el-input
      type="textarea"
      class="form-item"
      v-model.trim="formModel.couponRemark"
      clearable
      ></el-input>
    </el-form-item>
    <!-- <el-form-item class="couponBtn">
      <el-button  type="primary">仅保存为草稿</el-button>
      <el-button  type="primary">保存并申请</el-button>
    </el-form-item> -->
  </el-form>
</template>

<script>
export default {
  props: {
    initData: {
      type: Object,
      default() {
        return {
          limitActivateDay: '', // 日期
          limitActivateTimeStart: '', // 时间
          couponNumber: 1, // 生成数量
          couponRuleId: '', // 劵规则ID
          couponName: '', // 劵名称
          couponRemark: '' // 备注
        }
      }
    }
  },
  data() {
    return {
      rules: {
        couponRuleId: [
          { required: true, message: '请输入卡劵类型ID', trigger: 'blur' }
        ],
        couponNumber: [
          { required: true, message: '请填写数量', trigger: 'blur' }
        ],
        limitActivateTimeStart: [
          { required: true, message: '请选择时间', trigger: 'change' }
        ],
        limitActivateDay: [
          { required: true, message: '请选择日期', trigger: 'change' }
        ],
        couponName: [
          { required: true, message: '请输入卡劵名称', trigger: 'blur' }
        ]
      }
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
  .select-item{
    width: 46%;
  }
  .couponBtn{
    display: flex;
    justify-content: space-between;
  }
}
</style>
