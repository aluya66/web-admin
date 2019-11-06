<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <h3 class="title">{{ title }}</h3>
      <el-form-item prop="userName">
        <span class="svg-container">
          <svg-icon icon-class="user"/>
        </span>
        <el-input
          v-model="loginForm.userName"
          class="input-class"
          name="userName"
          type="text"
          auto-complete="on"
          placeholder="用户名"
        />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"/>
        </span>
        <el-input
          v-model="loginForm.password"
          :type="pwdType"
          class="input-class"
          name="password"
          auto-complete="on"
          placeholder="密码"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="pwdType === 'password' ? 'eye' : 'eye-open'"/>
        </span>
      </el-form-item>
      <el-form-item prop="isChecked" class="no-class">
        <el-checkbox v-model="isChecked" @change="changeValue">记住密码</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button
          :loading="loading"
          type="primary"
          style="width:100%;"
          @click.native.prevent="handleLogin"
        >登录</el-button>
      </el-form-item>
      <div v-if="isDebug" class="tips">
        <span style="margin-right:20px;">用户名: {{ loginForm.userName }}</span>
        <span>密码: {{ loginForm.password }}</span>
      </div>
      <!-- <div class="forget-password">
				<router-link to="/forgetPwd">忘记密码</router-link>
      </div>-->
    </el-form>
  </div>
</template>

<script>
import utils from 'utils'

export default {
  name: 'login',
  data () {
    return {
      title: process.env.VUE_APP_TITLE,
      loginForm: {
        userName: utils.isDebug ? 'system' : '',
        password: utils.isDebug ? '123456' : ''
      },
      loginRules: {
        userName: [
          {
            required: true,
            trigger: 'blur',
            validator: utils.validater.validateUserName
          }
        ],
        password: [
          { required: true, trigger: 'blur', validator: utils.validater.validatePass }
        ]
      },
      loading: false,
      pwdType: 'password',
      redirect: undefined,
      isDebug: utils.isDebug,
      isChecked: false
    }
  },
  mounted () {
    if (utils.getCookie('userName') && utils.getCookie('password')) {
      this.loginForm.userName = utils.getCookie('userName')
      this.loginForm.password = utils.getCookie('password')
      this.isChecked = true
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    changeValue (value) {
      if (!value) {
        utils.delCookie('userName')
        utils.delCookie('password')
      }
    },
    showPwd () {
      if (this.pwdType === 'password') {
        this.pwdType = 'text'
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          let password = ''
          if (this.isChecked) {
            if (utils.getCookie('password') !== this.loginForm.password) {
              password = this.loginForm.password
            } else {
              password = utils.getCookie('password')
            }
          } else {
            password = this.loginForm.password
          }
          this.$store
            .dispatch('user/login', { ...this.loginForm, password })
            .then(() => {
              this.loading = false
              if (this.isChecked) {
                utils.setCookie('userName', this.loginForm.userName, 30) // 保存帐号到cookie，有效期7天
                utils.setCookie('password', this.loginForm.password, 30) // 保存密码到cookie，有效期7天
              }
              this.$router.push({ path: this.redirect || '/' })
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="less">
/* reset element-ui css */
.login-container {
  .input-class {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: @light_gray;
      height: 47px;
      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px @login-bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
  .el-checkbox__inner {
    background-color: @light_gray;
  }
  .el-checkbox__label {
    color: @light_gray;
    font-size: @f12;
  }
}
</style>

<style lang="less" scoped>
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: @login-bg;

  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    max-width: 100%;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
    .no-class {
      margin: -20px 0 0 2px;
      border: none;
      background: none;
      margin-bottom: 0rem;
    }
    .forget-password {
      text-align: center;
      color: @light_gray;
    }
  }
  .tips {
    font-size: @f14;
    color: @light_gray;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: @dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: @light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: @f16;
    color: @dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
