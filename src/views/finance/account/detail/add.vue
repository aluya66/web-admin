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
		<el-form-item label="交易类型:" prop="type">
			<query-dict
				:disabled="isEdit"
				:dict-list="salesTypeList"
				class="select-item"
				placeholder="请选择交易类型"
				:value.sync="formModel.type"
			></query-dict>
		</el-form-item>
    <el-form-item label="交易金额:" prop="transactionAmount">
			<el-input v-model.trim="formModel.transactionAmount" class="form-item" clearable></el-input>
		</el-form-item>
    <el-form-item label="交易编号:" prop="orderNo">
			<el-input v-model.trim="formModel.orderNo" class="form-item" clearable></el-input>
		</el-form-item>
    <el-form-item label="交易时间:" prop="transactionTime">
      <el-date-picker
        class="select-item"
        v-model="formModel.transactionTime"
        type="datetime"
        placeholder="选择交易日期时间">
      </el-date-picker>
		</el-form-item>
    <el-form-item label="备注:" prop="remark">
      <el-input
        type="textarea"
        class="form-item"
        v-model="formModel.remark"
        placeholder="请输入备注"
        maxlength="300"
        show-word-limit
      ></el-input>
		</el-form-item>
  </el-form>
</template>

<script>
import dictObj from '@/store/dictData'
import MixinForm from 'mixins/form'

export default {
  mixins: [MixinForm],
  props: {
    initData: {
      type: Object,
      default() {
        return {
          shopId: '', // 店铺id
          type: '', // 交易类型
          transactionTime: '', // 交易时间
          transactionAmount: '', // 交易金额
          orderNo: '', // 交易编号
          remark: '' // 备注
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
      salesTypeList: dictObj.salesTypeList, // 交易类型集合
      rules: {
        type: [
          { required: true, message: '交易类型不能为空', trigger: 'change' }
        ],
        transactionAmount: [
          { required: true, message: '交易金额不能为空', trigger: 'blur' }
        ],
        orderNo: [
          { required: true, message: '交易编号不能为空', trigger: 'blur' }
        ],
        transactionTime: [
          { required: true, message: '交易时间不能为空', trigger: 'change' }
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
  }
}
</script>

<style lang="less" scoped>
.form {
  width: 90%;
  .form-item {
    width: 100%;
  }
  .select-item {
	width: 50%;
  }
}
</style>
