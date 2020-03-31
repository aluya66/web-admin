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
		<el-form-item label="名称:" prop="name">
			<el-input v-model.trim="formModel.name" class="form-item" clearable></el-input>
		</el-form-item>
    <el-form-item label="电话号码:" prop="phone">
			<el-input v-model.trim="formModel.phone" class="form-item" clearable></el-input>
		</el-form-item>
		<el-form-item label="角色:" prop="role">
			<query-dict
				:dict-list="shopRole"
				class="select-item"
				placeholder="请选择"
				:value.sync="formModel.role"
			></query-dict>
		</el-form-item>
		<el-form-item label="店铺:" prop="shopId">
      <!-- <query-dict
				:disabled="isEdit"
				:dict-list="lobList"
				class="select-item"
				placeholder="请选择"
				:value.sync="formModel."
			></query-dict> -->
    </el-form-item>
    <el-form-item label="状态:" prop="status">
      <query-dict
          :dict-list="shopStatus"
          class="select-item"
          placeholder="请选择"
          :value.sync="formModel.status"
        ></query-dict>
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
      shopRole: dictObj.shopRole,
      shopStatus:dictObj.openStatus,
      rules: {}
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
  },

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
