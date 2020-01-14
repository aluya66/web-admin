<template>
  <el-form
    ref="formRef"
    :model="formModel"
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
        disabled
        :dict-list="formModel.memberTypeList"
        class="select-item"
        placeholder="请选择会员类型"
        :value.sync="formModel.memberTypeId"
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
          memberTypeList: [], // 会员类型集合
          memberTypeId: '', // 会员类型id
          appCode: '' // 业务线
        }
      }
    }
  },
  data() {
    return {
      lobList: dictObj.lobList
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
