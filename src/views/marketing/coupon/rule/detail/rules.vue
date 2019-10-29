<template>
  <c-card :name="title" class="form-card">
    <el-form-item label="人均限量:" prop="limitReceive">
      <el-input-number
        v-model="formModel.limitReceive"
        controls-position="right"
        :size="size"
        :min="1"
        :max="10"
        :disabled="isDisabled"
        placeholder="请输入限量数值"
      ></el-input-number>
    </el-form-item>
    <el-form-item label="品类规则:" prop="categoryType">
      <el-radio-group v-model="formModel.categoryType" :disabled="isDisabled">
        <el-radio :label="0">全部类</el-radio>
        <el-radio :label="1">限品类</el-radio>
      </el-radio-group>
      <span class="input-info">* 选择全品类后不可更改为限品类;</span>
    </el-form-item>
    <el-form-item label="重复规则:" prop="repeatUse">
      <el-checkbox v-model="formModel.repeatUse" :disabled="isDisabled">本券可重复使用</el-checkbox>
      <span class="input-info">* 可重复使用代表券金额抵扣后若仍大于0，则可在下次订单结算时继续选中抵扣;<br/>&nbsp;&nbsp;若不能重复使用，则即时抵扣金额小于券金额，使用一次券后券状态也会变更为“已使用”;</span>
    </el-form-item>
  </c-card>
</template>

<script>
import CCard from 'components/card'
// import utils from 'utils'

export default {
  props: {
    title: String,
    dataObj: {
      type: Object,
      required: true
    },
    isView: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'medium'
    },
    isDisabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formModel: {
        categoryType: 0
      }
    }
  },
  created() {
    const curData = this.dataObj
    this.formModel = Object.assign({}, this.formModel, curData)
    console.log(this.formModel)
  },
  methods: {

  },

  components: {
    CCard
  }
}
</script>

<style lang='less' scope>
.form-card {
  .select-item {
    width: 30%;
  }
  .input-select {
    width: 80px;
  }
}
</style>
