<template>
	<div class="pass-view">
		<el-form
			ref="formRef"
			:model="formModel"
			:rules="rules"
			label-width="100px"
			class="form"
			label-position="right"
		>
			<el-form-item label="用户名:" prop="userName">
				<!-- 多加一个input解决自动填充问题 -->
				<el-input style="position:fixed;bottom:-9999px;"></el-input>
				<el-input
					v-model="formModel.userName"
					class="input-width"
					autocomplete="off"
					placeholder="请输入用户名"
					readonly
				/>
			</el-form-item>
			<el-form-item label="新密码:" prop="password">
				<!-- 多加一个input解决自动填充问题 -->
				<el-input
					type="password"
					style="position:fixed;bottom:-9999px;"
				></el-input>
				<el-input
					v-model.trim="formModel.password"
					show-password
					class="input-width"
					autocomplete="off"
					placeholder="请输入新密码"
				/>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
import utils from 'utils'

export default {
  props: {
    userInfo: {
      type: Object,
      default () {
        return {
          userName: ''
        }
      }
    }
  },
  data () {
    return {
      formModel: {
        password: '',
        userName: ''
      },
      rules: {
        password: [
          { required: true, validator: utils.validater.validatePass, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.formModel.userName = this.userInfo.userName
  }
}
</script>

<style lang="less" scoped>
.form {
	width: 90%;
}
</style>
