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
    <el-form-item label="业务线:" prop="appCode">
      <query-dict
        :disabled="isEdit"
        :dict-list="lobList"
        class="select-item"
        placeholder="请选择业务线"
        :value.sync="formModel.appCode"
      ></query-dict>
    </el-form-item>
    <el-form-item label="积分名称:" prop="pointName">
      <el-input v-model.trim="formModel.pointName" class="form-item" maxlength="30" clearable></el-input>
    </el-form-item>
    <el-form-item label="积分汇率:" prop="moneyRatio">
      <el-input
        v-model.trim.number="formModel.moneyRatio"
        class="select-item"
        clearable
      ></el-input>
      <span class="input-info">* 抵扣1元</span>
    </el-form-item>
    <el-form-item label="积分获取:" prop="pointRatio">
      <el-input
        v-model.trim.number="formModel.pointRatio"
        class="select-item"
        clearable
      ></el-input>
      <span class="input-info">* 获取1积分</span>
    </el-form-item>
    <el-form-item label="积分有效期:" prop="type">
      <el-col :span="12">
        <el-select
          v-model="formModel.type"
          class="select-type"
          :popper-append-to-body="false"
          clearable
        >
          <el-option
            v-for="item in typeSelect"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="1"> &nbsp;</el-col>
      <el-col :span="11" :rules="[{ required: true, message: '请输入', trigger: 'blur' }]">
        <el-input
          v-model.trim="formModel.days"
          v-if="formModel.type === 2"
          class="from-item"
          clearable
        >
          <template slot="append">天</template>
        </el-input>
      </el-col>
    </el-form-item>
  </el-form>
</template>

<script>
import QueryDict from '../../../common/queryDict'
import dictObj from '@/store/dictData'

export default {
  components: {
    QueryDict
  },
  props: {
    initData: {
      type: Object,
      default() {
        return {
          pointName: '', // 积分名称
          pointRatio: '', // 积分获取
          moneyRatio: '', // 积分汇率
          type: '', // 积分有效期1 永久   2 有效天数
          days: '', // type 为2是必填。有效天数
          appCode: '' // 业务线
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
      lobList: dictObj.lobList,
      typeSelect: [
        {
          value: 1,
          label: '永久'
        },
        {
          value: 2,
          label: '有效天数'
        }
      ],
      rules: {
        pointName: [{ required: true, message: '请填写积分名称', trigger: 'blur' }],
        pointRatio: [{ required: true, type: 'number', message: '请填写积分获取', trigger: 'blur' }],
        moneyRatio: [{ required: true, type: 'number', message: '请填写积分汇率', trigger: 'blur' }],
        type: [{ required: true, message: '请选择', trigger: 'change' }],
        appCode: [{ required: true, message: '请选择', trigger: 'blur' }]
      }
    }
  },
  computed: {
    formModel() {
      return this.initData
    }
  },
  methods: {}
}
</script>

<style lang="less" scoped>
.form {
  width: 90%;
  .form-item {
    width: 100%;
  }
  .select-type {
    width: 100%;
  }
}
.body .el-select {
  position: fixed !important;
}
.select-item {
  width: 50%;
}
</style>
