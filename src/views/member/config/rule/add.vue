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
    <el-form-item label="业务线:" prop="appCode">
      <query-dict
        :disabled="isEdit"
        :dict-list="lobList"
        class="select-item"
        placeholder="请选择业务线"
        :value.sync="formModel.appCode"
      ></query-dict>
    </el-form-item>
    <el-form-item label="会员类型名称:" prop="memberTypeName">
      <el-input v-model.trim="formModel.memberTypeName" class="form-item" disabled></el-input>
    </el-form-item>
    <el-form-item label="会员类型:" prop="memberTypeId">
      <query-dict
        :dict-list="memberTypeList"
        class="select-item"
        placeholder="请选择会员类型"
        :value.sync="formModel.memberTypeId"
        @ChangeQueryDict="changeMemberType"
      ></query-dict>
    </el-form-item>
    <el-form-item label="状态:" prop="isEnable">
      <el-select
        v-model="formModel.isEnable"
        class="select-item"
        :popper-append-to-body="false"
        clearable
      >
        <el-option
          v-for="item in isEnableSelect"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="积分兑换比率:" prop="pointRatio">
      <el-input v-model.trim="formModel.pointRatio" class="form-item" @blur="changePointRatio" clearable></el-input>
    </el-form-item>
    <el-form-item label="会员开通送积分:" prop="pointGift">
      <el-input v-model.trim.number="formModel.pointGift" class="form-item" clearable></el-input>
    </el-form-item>
    <el-form-item label="会员有效时间:" prop="val">
      <el-input v-model.number="formModel.val" class="select-item" clearable>
        <el-select v-model="formModel.unit" class="input-select" slot="append">
          <el-option
            v-for="item in validDayUnitList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-input>
    </el-form-item>
    <el-form-item label="当前开通价:" prop="currentPrice">
      <el-input v-model.trim="formModel.currentPrice" class="form-item" clearable></el-input>
    </el-form-item>
    <el-form-item label="原开通价:" prop="formerPrice">
      <el-input v-model.trim="formModel.formerPrice" class="form-item" clearable></el-input>
    </el-form-item>
    <el-form-item label="标题信息:" prop="title">
      <el-input v-model.trim="formModel.title" class="form-item" clearable></el-input>
    </el-form-item>
    <el-form-item label="会员说明:" prop="description">
      <el-input
        type="textarea"
        v-model.trim="formModel.description"
        placeholder="请输入内容"
        maxlength="300"
        show-word-limit
      ></el-input>
    </el-form-item>
    <el-form-item label="备注:">
      <el-input
        type="textarea"
        placeholder="请输入内容"
        v-model.trim="formModel.remark"
        maxlength="300"
        show-word-limit
      ></el-input>
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
    memberTypeList: {
      type: Array
    },
    initData: {
      type: Object,
      default() {
        return {
          appCode: '', // 业务线
          memberTypeName: '', // 会员名称
          memberTypeId: '', // 会员类型
          isEnable: 1, // 状态
          pointGift: '', // 会员开通送积分
          unit: 1, // 会员有效时间单位
          val: '', // 会员有效时间
          currentPrice: '', // 当前开通价
          formerPrice: '', // 原开通价
          title: '', // 标题
          description: '', // 会员说明
          remark: '' // 备注
        }
      }
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data(vm) {
    const checkVal = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('会员有效期不能为空'))
      }
      if (!Number.isInteger(value)) {
        return callback(new Error('请输入数字值'))
      }
      if (vm.formModel.unit === 1) {
        if (value < 1) {
          callback(new Error('请输入大于0的年数'))
        }
      } else if (vm.formModel.unit === 2) {
        if (value < 1 || value > 12) {
          callback(new Error('请输入1~12月份'))
        }
      } else if (vm.formModel.unit === 3) {
        if (value < 1 || value > 31) {
          callback(new Error('请输入1~31天数'))
        }
      }
      callback()
    }
    const checkPointRatio = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('积分兑换比率不能为空'))
      }
      if (!Number(value)) {
        return callback(new Error('请输入数字值'))
      }
      callback()
    }
    return {
      lobList: dictObj.lobList,
      validDayUnitList: [{ // 1.年  2.月 3.日
        label: '年',
        value: 1
      }, {
        label: '月',
        value: 2
      }, {
        label: '日',
        value: 3
      }],
      isEnableSelect: [
        {
          value: 0,
          label: '禁用'
        },
        {
          value: 1,
          label: '启用'
        }
      ],
      rules: {
        appCode: [{ required: true, message: '请选择业务线', trigger: 'change' }],
        memberTypeName: [{ required: true, message: '请输入会员类型名称', trigger: 'blur' }],
        memberTypeId: [{ required: true, message: '请选择会员类型', trigger: 'change' }],
        isEnable: [{ required: true, message: '请选择状态', trigger: 'change' }],
        val: [{ required: true, validator: checkVal, type: 'number', trigger: 'blur' }],
        pointRatio: [{ required: true, validator: checkPointRatio, type: 'number', trigger: 'blur' }],
        pointGift: [{ required: false, type: 'number', message: '请输入数字', trigger: 'blur', transform(value) { return Number(value) } }],
        currentPrice: [{ required: true, type: 'number', message: '请输入', trigger: 'blur', transform(value) { return Number(value) } }],
        formerPrice: [{ type: 'number', message: '请输入数字', trigger: 'blur', transform(value) { return Number(value) } }]
      }
    }
  },
  methods: {
    changeMemberType(item) {
      this.formModel.memberTypeName = item.label
    },
    changePointRatio() {
      this.formModel.pointRatio = this.formModel.pointRatio ? Number(this.formModel.pointRatio).toFixed(2) : ''
    }
  },
  computed: {
    formModel() {
      return this.initData
    }
  }
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
  .input-select {
    width: 80px;
  }
}
</style>
