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
		<el-form-item label="仓库名称:" prop="whName">
			<el-input v-model.trim="formModel.whName" class="input-item" clearable></el-input>
		</el-form-item>
    <el-form-item label="仓库编号:" prop="whCode">
			<el-input v-model.trim="formModel.whCode" class="input-item" clearable></el-input>
		</el-form-item>
		<el-form-item label="仓库地址:" prop="">
			<!-- <query-dict
				:disabled="isEdit"
				:dict-list="lobList"
				class="select-item"
				placeholder="请选择"
				:value.sync="formModel."
			></query-dict> -->
		</el-form-item>
		<el-form-item label="仓库属性:" prop="whType">
			<query-dict
				:disabled="isEdit"
				:dict-list="warehouseSaleType"
				class="select-item"
				placeholder="请选择仓库属性"
				:value.sync="formModel.whType"
			></query-dict>
		</el-form-item>
    <el-form-item label="仓库类型:" prop="whBusinessType">
			<query-dict
				:disabled="isEdit"
				:dict-list="warehouseType"
				class="select-item"
				placeholder="请选择仓库类型"
				:value.sync="formModel.whType"
			></query-dict>
      <!--如果选择的是店仓，则需要展示下拉店铺选择-->
      <!-- <query-dict
				:disabled="isEdit"
				:dict-list="warehouseType"
				class="select-item"
				placeholder="请选择仓库类型"
				:value.sync="formModel.whType"
			></query-dict> -->
		</el-form-item>
    <el-form-item label="所属公司:" prop="refGroupCode">
      <query-dict
				:disabled="isEdit"
				:dict-list="bussinessList"
				class="select-item"
				placeholder="请选择仓库类型"
				:value.sync="formModel.whType"
			></query-dict>
    </el-form-item>
    <el-form-item label="管理员名称:" prop="">
			<el-input v-model.trim="formModel.whName" class="input-item" clearable></el-input>
		</el-form-item>
    <el-form-item label="联系电话:" prop="">
			<el-input v-model.trim="formModel.whName" class="input-item" clearable></el-input>
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
          // TODO... 初始化数据，需加备注
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
      warehouseSaleType: dictObj.warehouseSaleType,
      warehouseType:dictObj.warehouseType,
      bussinessList:[],
      rules: {}
    }
  },
  created(){
    this.getBusiness()
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
  },
  methods:{
    // 商户列表数据
    getBusiness() {
      this.$api.channel.queryBusinessList({
        pageNo: 1,
        pageSize: 20
      }).then(res => {
        this.bussinessList = res.data
      })
    }
  }
}
</script>
