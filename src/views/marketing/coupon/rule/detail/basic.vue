<template>
  <c-card :name="title" class="form-card">
    <el-form-item label="卡券名称:" prop="couponRuleName">
      <el-input
        v-if="!isView"
        class="select-item"
        v-model.trim="formModel.couponRuleName"
        :size="size"
        :disabled="isDisabled"
        placeholder="请输入卡劵名称"
        clearable
      />
      <span v-else>{{formModel.couponRuleName}}</span>
    </el-form-item>
    <el-form-item label="卡券类型:" prop="couponRuleType">
      <el-radio-group v-model="formModel.couponRuleType">
        <el-radio
          v-for="item in couponRuleTypeArr"
          :key="item.value"
          :disabled="isView || isDisabled"
          :label="item.value"
        >{{item.label}}</el-radio>
      </el-radio-group>
    </el-form-item>
    <!-- <el-form-item label="渠道:" prop="">
      <el-select
        v-if="!isView"
        class="select-item"
        :disabled="isDisabled"
        v-model="formModel.goodsTypeId"
        placeholder="请选择渠道"
        clearable
      >
        <el-option
          v-for="item in channelList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <span v-else>{{formModel.goodsTypeId ? channelList[formModel.goodsTypeId - 1].label : ''}}</span>
    </el-form-item>-->

    <el-form-item label="生成密码:">
      <el-switch v-model="formModel.useCode" :disabled="isView || isDisabled"></el-switch>
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
    <!-- <el-form-item>
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
    </el-form-item>-->
  </c-card>
</template>
<script>
import MixinFormCard from 'mixins/formCard'

export default {
  mixins: [MixinFormCard],
  data() {
    return {
      channelList: [{
        label: 111,
        value: 1
      }, {
        label: 2222,
        value: 2
      }],
      couponRuleTypeArr: [{
        label: '劵',
        value: 0
      }, {
        label: '卡',
        value: 1
      }, {
        label: '通用劵',
        value: 2
      }, {
        label: '运费券',
        value: 3
      }, {
        label: '售后代金劵',
        value: 4
      }],
      limitList: [{
        label: '限日期',
        value: 0
      }, {
        label: '限时长',
        value: 1
      }]
    }
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
