<template>
  <el-form
    ref="formRef"
    :model="formModel"
    :rules="rules"
    label-width="150px"
    class="form"
    label-position="right"
    status-icon
  >
    <el-form-item label="开放平台APPKEY:" prop="appKey">
      <el-input
        v-model.trim="formModel.appKey"
        :disabled="!!formModel.id"
        class="form-item"
        maxlength="16"
        clearable
      ></el-input>
    </el-form-item>
    <el-form-item label="启用token验证:" prop="tokenStatus">
      <el-radio-group v-model="formModel.tokenStatus" :disabled="formModel.status === 0">
        <el-radio :label="item.value" v-for="(item, index) in statusList" :key="index">{{item.label}}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="是否启用签名:" prop="signStatus">
      <el-radio-group v-model="formModel.signStatus" :disabled="formModel.status === 0">
        <el-radio :label="item.value" v-for="(item, index) in statusList" :key="index">{{item.label}}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="是否启用加密:" prop="encryptStatus">
      <el-radio-group v-model="formModel.encryptStatus" :disabled="formModel.status === 0">
        <el-radio :label="item.value" v-for="(item, index) in statusList" :key="index">{{item.label}}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="是否启用:" prop="status">
      <el-radio-group v-model="formModel.status" @change="changeStatus">
        <el-radio :label="item.value" v-for="(item, index) in statusList" :key="index">{{item.label}}</el-radio>
      </el-radio-group>
    </el-form-item>
  </el-form>
</template>

<script>
import MixinForm from 'mixins/form'
import utils from 'utils'
import dictObj from '@/store/dictData'
export default {
  mixins: [MixinForm],
  props: {
    initData: {
      type: Object,
      default() {
        return {
          appKey: '', // appkey
          tokenStatus: '', // token是否启用
          signStatus: '', // 签名是否启用
          encryptStatus: '', // 加密是否启用
          status: '' // 是否启用
        }
      }
    }
  },
  data() {
    let checkAppkey = (rule, value, callback) => {
      if (!value) {
        return callback(
          new Error('请输入【限制: 纯英文字母, 长度4-16个字母】')
        )
      }
      if (!utils.validater.validateAlphabets(value, '{4,16}')) {
        return callback(
          new Error('请输入【限制: 纯英文字母, 长度4-16个字母】')
        )
      }
      this.formModel.id ? callback() : this.checkAppkeyFun(callback) // 编辑不需要校验
    }
    return {
      statusList: dictObj.disStatus, // 状态字典
      rules: {
        appKey: [
          { required: true, validator: checkAppkey, trigger: 'blur' }
        ],
        tokenStatus: [
          { required: true, message: '请选择是否验证token' }
        ],
        signStatus: [
          { required: true, message: '请选择是否启用签名' }
        ],
        encryptStatus: [
          { required: true, message: '请选择是否启用加密' }
        ],
        status: [
          { required: true, message: '请选择是否启用' }
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
  },
  methods: {
    // 状态总开关
    changeStatus(val) {
      const statusList = {
        ...this.formModel,
        tokenStatus: val,
        signStatus: val,
        encryptStatus: val
      }
      Object.assign(this.formModel, statusList)
    },
    // appkey校验
    checkAppkeyFun(callback) {
      const appKey = this.formModel.appKey
      this.$api.settings.checkAppkey({ appKey }).then(({ code }) => {
        if (code !== 0) {
          callback(new Error('该appKey已存在'))
        } else {
          callback()
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.form {
  margin-right: 50px;
  .form-item {
    width: 100%;
  }
  .form-select {
    width: 50%;
  }
}
</style>
