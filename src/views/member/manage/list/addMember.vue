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
    <el-form-item label="业务线:" prop="appCode">
      <query-dict
        disabled
        :dict-list="lobList"
        class="select-item"
        placeholder="请选择业务线"
        :value.sync="formModel.appCode"
      ></query-dict>
    </el-form-item>
    <el-form-item label="会员类型:" prop="memberTypeId">
      <query-dict
        :dict-list="formModel.memberTypeList"
        class="select-item"
        placeholder="请选择会员类型"
        :value.sync="formModel.memberTypeId"
      ></query-dict>
    </el-form-item>
    <el-form-item label="开通方式:" prop="type">
      <query-dict
        :dict-list="typeList"
        class="select-item"
        placeholder="请选择开通方式"
        :value.sync="formModel.type"
      ></query-dict>
    </el-form-item>
    <el-form-item label="有效期:" prop="dateTime">
      <el-date-picker
        :size="size"
        v-model="formModel.dateTime"
        type="datetimerange"
        value-format="yyyy-MM-dd HH:mm:ss"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="截止日期"
        :default-time="['00:00:00', '23:59:59']"
        align="right"
      ></el-date-picker>
    </el-form-item>
    <template v-if="isShow">
      <el-form-item label="店员id:" prop="staffId" :rules="[{ required: true, validator: checkInt, trigger: 'blur' }]">
        <el-input
          class="input-item"
          v-model.trim="formModel.staffId"
          :size="size"
          placeholder="请输入店员id"
          clearable
          maxlength="50"
        />
      </el-form-item>
      <el-form-item label="店铺名称:" prop="shopName">
        <el-input
          class="input-item"
          v-model.trim="formModel.shopName"
          :size="size"
          placeholder="请输入店铺名称"
          clearable
        />
      </el-form-item>
      <el-form-item label="店员名称:" prop="memberName">
        <el-input
          class="input-item"
          v-model.trim="formModel.memberName"
          :size="size"
          placeholder="请输入店员名称"
          clearable
        />
      </el-form-item>
    </template>
  </el-form>
</template>

<script>
import dictObj from '@/store/dictData'
import MixinForm from 'mixins/form'
import utils from 'utils'

const typeList = [{
  label: '自开',
  value: 1
}, {
  label: '代开',
  value: 2
}, {
  label: '赠送',
  value: 3
}]

export default {
  mixins: [MixinForm],
  props: {
    initData: {
      type: Object,
      default() {
        return {
          dateTime: '', // 有效期
          memberTypeId: '', // 会员类型id
          appCode: '', // 业务线
          memberTypeList: [], // 会员类型集合
          type: '' // 开通类型
        }
      }
    }
  },
  data(vm) {
    return {
      typeList,
      pickerOptions: utils.pickerOptions,
      lobList: dictObj.lobList,
      isShow: false, // 为代开时显示
      rules: {
        appCode: [{ required: true, message: '请选择业务线', trigger: 'change' }],
        memberTypeId: [{ required: true, message: '请选择会员类型', trigger: 'change' }],
        type: [{ required: true, message: '请选择开通方式', trigger: 'change' }],
        dateTime: [{ required: true, message: '请选择会员有效期', trigger: 'change' }],
        shopName: [{ required: true, message: '请输入店铺名称', trigger: 'blur' }],
        memberName: [{ required: true, message: '请输入店员名称', trigger: 'blur' }]
      }
    }
  },
  watch: {
    'formModel.type'(newVal) {
      this.isShow = newVal === 2
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
