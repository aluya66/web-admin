<template>
  <el-form
    ref="formRef"
    :model="formModel"
    :rules="rules"
    label-width="120px"
    class="dialog-form"
    label-position="right"
    status-icon
  >
		<el-form-item label="价格名称:" prop="priceName">
			<el-input v-model.trim="formModel.priceName" class="input-item" clearable></el-input>
		</el-form-item>
		<el-form-item label="价格类型:" prop="priceType">
			<query-dict
				:disabled="isEdit"
				:dict-list="priceTypeList"
				class="select-item"
				placeholder="请选择"
				:value.sync="formModel.priceType"
			></query-dict>
		</el-form-item>
    <el-form-item label="应用类型:" prop="appliedType">
			<query-dict
				:disabled="isEdit"
				:dict-list="appliedTypeList"
				class="select-item"
				placeholder="请选择"
				:value.sync="formModel.appliedType"
			></query-dict>
		</el-form-item>
    <el-form-item label="状态:" prop="status">
			<query-dict
        show-type="radio"
				:disabled="isEdit"
				:dict-list="openStatus"
				:value.sync="formModel.status"
			></query-dict>
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
        return {}
      }
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      appliedTypeList: dictObj.channelAppliedType,
      priceTypeList: dictObj.channelPriceType,
      openStatus: dictObj.openStatus,
      rules: {
        priceName: [
          { required: true, message: '价格名称不能为空', trigger: 'blur' }
        ],
        priceType: [
          { required: true, message: '请选择价格类型', trigger: 'change' }
        ],
        appliedType: [
          { required: true, message: '请选择应用类型', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
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
