<template>
  <el-form
    ref="formRef"
    :model="formModel"
    :rules="rules"
    label-width="120px"
    class="dialog-form"
    label-position="right"
  >
    <el-form-item label="名称:" prop="feeName">
      <el-input :disabled="!!formModel.id" v-model.trim="formModel.feeName" class="input-item" placeholder="请输入名称" />
    </el-form-item>
    <el-form-item label="金额:" prop="feeAmount">
      <el-input v-model.trim="formModel.feeAmount" class="input-item" placeholder="请输入金额" />
    </el-form-item>
    <el-form-item label="状态:" prop="status">
      <query-dict
        :dict-list="disStatus"
        class="select-item"
        placeholder="状态"
        :value.sync="formModel.status"
      ></query-dict>
    </el-form-item>
  </el-form>
</template>

<script>
import dictObj from '@/store/dictData'
import QueryDict from '../../../common/queryDict'
import utils from 'utils'
export default {
  components: {
    QueryDict
  },
  props: {
    initData: {
      type: Object,
      default() {
        return {
          feeName: '', // 名称
          feeAmount: '', // 金额
          status: 0 // 状态
        }
      }
    }
  },
  data() {
    return {
      disStatus: dictObj.disStatus,
      rules: {
        feeName: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        feeAmount: [{ required: true, validator: utils.validater.checkNumber, trigger: 'change' }]
      }
    }
  },
  computed: {
    formModel() {
      return this.initData
    }
  }
}
</script>
