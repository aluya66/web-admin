<template>
  <c-card :name="title" class="form-card">
    <el-form-item label="类型名称:" prop="couponRuleName">
      <el-input
        v-if="!isView"
        class="select-item"
        v-model.trim="formModel.couponRuleName"
        :size="size"
        :disabled="isDisabled"
        placeholder="请输入券名称"
        clearable
      />
      <span v-else>{{formModel.couponRuleName}}</span>
    </el-form-item>
    <el-form-item label="城市渠道:" prop>
      <el-cascader
        v-if="!isView"
        class="select-item"
        :disabled="isDisabled"
        placeholder="检索城市渠道"
        v-model="formModel.categoryCode"
        :options="areaList"
        filterable
      ></el-cascader>
      <span v-else>{{formModel.categoryName}}</span>
    </el-form-item>
    <el-form-item label="应用渠道:" prop>
      <el-select
        v-if="!isView"
        class="select-item"
        :disabled="isDisabled"
        v-model="formModel.goodsTypeId"
        placeholder="请选择商品类型"
      >
        <el-option
          v-for="item in channelList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <span v-else>{{formModel.goodsTypeId ? channelList[formModel.goodsTypeId - 1].label : ''}}</span>
    </el-form-item>
    <el-form-item label="生成密码:">
      <el-switch v-model="formModel.hasCode" :disabled="isView || isDisabled"></el-switch>
    </el-form-item>
    <el-form-item label="限制类型:">
      <el-radio-group v-model="formModel.limit">
        <el-radio
          v-for="item in limitList"
          :key="item.value"
          :disabled="isView || isDisabled"
          :label="item.value"
        >{{item.label}}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-input
        v-if="!isView"
        class="select-item"
        v-model.trim="formModel.goodsName"
        :size="size"
        :disabled="isDisabled"
        placeholder="请输入时间"
        clearable
      >
        <el-select v-model="formModel.unit" slot="append" placeholder="请选择" class="input-select">
          <el-option label="天" :value="1"></el-option>
          <el-option label="小时" :value="2"></el-option>
          <el-option label="分" :value="3"></el-option>
        </el-select>
      </el-input>
    </el-form-item>
  </c-card>
</template>
<script>
import CCard from 'components/card'
// import utils from 'utils'

export default {
  props: {
    title: String,
    dataObj: {
      type: Object,
      required: true
    },
    isView: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'medium'
    },
    isDisabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      areaList: [],
      channelList: [],
      limitList: [{
        label: '限日期',
        value: 0
      }, {
        label: '限时长',
        value: 1
      }],
      formModel: {
        unit: 1
      }
    }
  },
  created() {
    const curData = this.dataObj
    this.formModel = Object.assign({}, this.formModel, curData)
  },
  methods: {

  },
  components: {
    CCard
  }
}
</script>
<style lang="less" scoped>
.form-card {
  .select-item {
    width: 30%;
  }
  .input-select {
    width: 80px;
  }
}
</style>
