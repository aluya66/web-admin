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
    <h3 v-if="!!formModel.id">【tip】编辑成功后，二维码状态会更改为未审核</h3>
    <el-form-item label="二维码名称:" prop="qrcodeName">
      <el-input v-model.trim="formModel.qrcodeName" class="form-item" clearable></el-input>
    </el-form-item>
    <el-form-item label="二维码编码:" prop="qrcodeCode">
      <el-input
        v-model.trim="formModel.qrcodeCode"
        :disabled="!!formModel.id"
        class="form-item"
        maxlength="16"
        clearable></el-input>
    </el-form-item>
    <el-form-item label="二维码生产者:" prop="producerCode">
      <query-dict
        :dict-list="lobList"
        class="form-select"
        placeholder="请选择"
        :value.sync="formModel.producerCode"
      ></query-dict>
    </el-form-item>
    <el-form-item label="二维码使用者:" prop="userCode">
      <query-dict
        multiple
        :dict-list="lobList"
        class="form-select"
        placeholder="请选择"
        :value.sync="formModel.userCode"
      ></query-dict>
    </el-form-item>
    <el-form-item label="描述:" prop="description">
      <el-input
        type="textarea"
        :rows="2"
        maxlength="100"
        show-word-limit
        placeholder="请输入"
        v-model.trim="formModel.description"
      ></el-input>
    </el-form-item>
    <el-form-item
      v-for="(item, index) in formModel.contextKey"
      :label="'字段值 '+ (index + 1)"
      :key="index"
      :prop="'contextKey.' + index + '.value'"
      :rules="{
        required: true, validator: checkContextKey, trigger: 'blur'
      }"
    >
      <el-col :span="10">
        <el-input v-model="item.value" placeholder="字段值" maxlength="32"></el-input>
      </el-col>
      <el-col class="line" :span="1">&nbsp;&nbsp;</el-col>
      <el-col :span="2">
        <el-button @click.prevent="removeContextKey(item, index)">删除</el-button>
      </el-col>
    </el-form-item>
    <el-form-item>
      <el-button @click="addContextKey">新增</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import MixinForm from 'mixins/form'
import dictObj from '@/store/dictData'
import utils from 'utils'
export default {
  mixins: [MixinForm],
  props: {
    initData: {
      type: Object,
      default() {
        return {
          qrcodeName: '',
          qrcodeCode: '',
          producerCode: '',
          contextKey: [{
            value: ''
          }]
        }
      }
    }
  },
  data() {
    let checkQrcodeCode = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入【限制: 纯大写英文字母, 长度4-16个字母】'))
      }
      if (!utils.validater.validateUpperCase(value, '{4,16}')) {
        return callback(new Error('请输入【限制: 纯大写英文字母, 长度4-16个字母】'))
      }
      this.formModel.id ? callback() : this.checkQrcode(callback) // 编辑不需要校验
    }
    let checkContextKey = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入【纯英文字母, 长度4-32个字母】'))
      }
      if (!utils.validater.validateAlphabets(value, '{4,32}')) {
        return callback(new Error('请输入【纯英文字母, 长度4-32个字母】'))
      } else {
        callback()
      }
    }
    return {
      checkContextKey,
      lobList: dictObj.lobList, // 业务线集合
      rules: {
        qrcodeName: [
          { required: true, message: '请输入二维码名称', trigger: 'blur' }
        ],
        qrcodeCode: [
          { required: true, validator: checkQrcodeCode, trigger: 'blur' }
        ],
        producerCode: [
          { required: true, message: '请选择', trigger: 'blur' }
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
    checkQrcode(callback) {
      const qrcodeCode = this.formModel.qrcodeCode
      // 校验qrcode是否已存在
      this.$api.settings.checkQrcode({ qrcodeCode }).then(({ code }) => {
        if (code !== 0) {
          callback(new Error('该二维码编码已存在'))
        } else {
          callback()
        }
      })
    },
    addContextKey() {
      this.formModel.contextKey.push({
        value: ''
      })
    },
    removeContextKey(item, index) {
      this.formModel.contextKey.splice(index, 1)
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
  .form-select{
    width: 50%;
  }
}
h3 {
  padding: 15px;
  text-align: center;
  color: red;
}
</style>
