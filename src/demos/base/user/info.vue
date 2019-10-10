<template>
	<div class="adduser">
		<el-form
			ref="formRef"
			:model="formModel"
			:rules="rules"
			label-width="160px"
			class="form"
			label-position="right"
		>
			<el-form-item label="用户名:" prop="userName">
				<!-- 多加一个input解决自动填充问题 -->
				<el-input style="position:fixed;bottom:-9999px;"></el-input>
				<el-input
					v-model.trim="formModel.userName"
					class="input-width"
					placeholder="请输入用户名"
					autocomplete="off"
					:disabled="!!userMsg.userName"
				/>
			</el-form-item>
			<el-form-item label="密码:" prop="password" v-if="!userMsg.id">
				<!-- 多加一个input解决自动填充问题 -->
				<el-input
					type="password"
					style="position:fixed;bottom:-9999px;"
				></el-input>
				<el-input
					v-model.trim="formModel.password"
					autocomplete="off"
					show-password
					class="input-width"
					placeholder="请输入用户密码"
				/>
			</el-form-item>
			<el-form-item label="再次输入密码:" prop="rePassword" v-if="!userMsg.id">
				<!-- 多加一个input解决自动填充问题 -->
				<el-input
					type="password"
					style="position:fixed;bottom:-9999px;"
				></el-input>
				<el-input
					v-model.trim="formModel.rePassword"
					autocomplete="off"
					show-password
					class="input-width"
					placeholder="请再次输入用户密码"
				/>
			</el-form-item>
			<el-form-item label="用户角色:" prop="roles">
				<el-select
					v-model="formModel.roles"
					class="input-width"
					multiple
					placeholder="请选择角色"
				>
					<el-option
						v-for="item in rolesList"
						:key="'roles_' + item.value"
						:label="item.label"
						:value="item.value"
						:disabled="item.status === 1"
					>
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="运营商:" prop="operator">
				<el-select
					v-model="formModel.operator"
					class="input-width"
					multiple
					placeholder="请选择运营商"
				>
					<el-option
						v-for="item in supplyList"
						:key="'roles_' + item.value"
						:label="item.label"
						:value="item.value"
					>
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="用户状态:" prop="status">
				<el-radio-group v-model="formModel.status">
					<el-radio :label="0">启用</el-radio>
					<el-radio :label="1">禁用</el-radio>
				</el-radio-group>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import utils from 'utils'

export default {
  components: {},
  props: {
    userMsg: {
      type: Object
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'operatorObj'])
  },
  created () {
    const { id } = this.userMsg
    this.supplyList = Object.keys(this.operatorObj).map(res => ({
      label: this.operatorObj[res],
      value: res
    }))
    if (id) {
      const { userName, status, roles, operator } = this.userMsg
      this.formModel = {
        ...this.formModel,
        roles: roles.map(res => res.id),
        operator: operator.split(','),
        userName,
        status
      }
    }
    this.$api.role.getRoleList({}, 1, 50).then(res => {
      let curRoles = []
      if (res.page) {
        curRoles = res.data
      } else {
        curRoles = res
      }
      this.rolesList = curRoles.map(res => ({
        label: res.roleName,
        value: res.id,
        status: res.status
      }))
    })
  },
  data (vm) {
    const validatePass = (rule, value, callback) => {
      if (/^[A-Za-z0-9_]{6,10}$/.test(value)) {
        if (vm.formModel.rePassword !== '') {
          vm.$refs.formRef.validateField('rePassword')
        }
        callback()
      } else {
        callback(new Error('请输入6至10位字符、数字或下划线'))
      }
    }
    const validateRePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== vm.formModel.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      formModel: {
        userName: '',
        password: '',
        rePassword: '',
        roles: [],
        operator: [],
        status: 0
      },
      rolesList: [],
      supplyList: [],
      rules: {
        userName: [
          {
            required: true,
            validator: utils.validater.validateUserName,
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        rePassword: [
          { required: true, validator: validateRePassword, trigger: 'blur' }
        ],
        roles: [
          { required: true, message: '用户角色不能为空', trigger: 'change' }
        ],
        status: [
          { required: true, message: '用户状态不能为空', trigger: 'change' }
        ],
        operator: [
          { required: true, message: '运营商不能为空', trigger: 'change' }
        ]
      }
    }
  }
}
</script>

<style lang="less" scoped>
.form {
	width: 90%;
	.input-width {
		width: 100%;
	}
}
</style>
