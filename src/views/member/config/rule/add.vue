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
        :dict-list="businessList"
        class="search-item"
        size="medium"
        placeholder="请选择"
        :value.sync="formModel.appCode"
      ></query-dict>
    </el-form-item>
    <el-form-item label="会员类型名称:" prop="memberTypeName">
      <el-input v-model.trim="formModel.memberTypeName" class="form-item" clearable></el-input>
    </el-form-item>
    <el-form-item label="会员类型:" prop="memberTypeId">
      <query-dict
        :dict-list="memberTypeList"
        class="search-item"
        size="medium"
        placeholder="请选择"
        :value.sync="formModel.memberTypeId"
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
    <el-form-item label="会员开通送积分:" prop="pointGift">
      <el-input v-model.trim="formModel.pointGift" class="form-item" clearable></el-input>
    </el-form-item>
    <el-form-item label="会员有效天数:" prop="val">
      <el-input v-model.trim="formModel.val" class="form-item" clearable></el-input>
    </el-form-item>
    <el-form-item label="会员有效期单位:" prop="unit">
      <el-select
        v-model="formModel.unit"
        class="select-item"
        :popper-append-to-body="false"
        clearable
      >
        <el-option
          v-for="item in validDayUnitList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
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
    <el-form-item label="排序:" prop="sort">
      <el-input-number
        v-model="formModel.sort"
        controls-position="right"
        class="select-item"
        :min="1"
        :max="10000"
      ></el-input-number>
    </el-form-item>
    <el-form-item label="会员说明:" prop="description">
      <el-input
        type="text"
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
export default {
  components: {
    QueryDict
  },
  props: {
    memberTypeList: {
      type: Array
    },
    businessList: {
      type: Array
    },
    initData: {
      type: Object,
      default() {
        return {
          appCode: '', // 业务线
          memberTypeName: '', // 会员名称
          memberTypeId: '', // 会员类型
          isEnable: '', // 状态
          pointGift: '', // 会员开通送积分
          days: '', // 会员有效天数
          currentPrice: '', // 当前开通价
          formerPrice: '', // 原开通价
          title: '', // 标题
          sort: 100, // 排序
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
  data() {
    return {
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
        appCode: [{ required: true, message: '请选择', trigger: 'change' }],
        memberTypeName: [{ required: true, message: '请填写', trigger: 'blur' }],
        memberTypeId: [{ required: true, message: '请选择', trigger: 'change' }],
        isEnable: [{ required: true, message: '请选择', trigger: 'change' }],
        pointGift: [{ required: true, message: '请填写', trigger: 'blur' }],
        days: [{ required: true, message: '请填写', trigger: 'blur' }],
        currentPrice: [{ required: true, message: '请填写', trigger: 'blur' }],
        formerPrice: [{ required: true, message: '请填写', trigger: 'blur' }],
        title: [{ required: true, message: '请填写', trigger: 'blur' }],
        sort: [{ required: true, message: '请填写', trigger: 'blur' }]
      }
    }
  },
  computed: {
    formModel() {
      return this.initData
    }
  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
.form {
  width: 90%;
  .form-item {
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
