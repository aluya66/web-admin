<template>
  <c-card :name="title" class="form-card">
    <el-form-item label="联系人:" prop="contact">
      <el-input
        v-if="!isView"
        class="select-item"
        v-model.trim="formModel.contact"
        :size="size"
        placeholder="请输入联系人"
        clearable
      />
      <span v-else>{{formModel.contact}}</span>
    </el-form-item>
    <el-form-item label="联系人手机号:" prop="contactTel">
      <el-input
        v-if="!isView"
        class="select-item"
        v-model.trim="formModel.contactTel"
        :size="size"
        placeholder="请输入手机号"
        clearable
      />
      <span v-else>{{formModel.contactTel}}</span>
    </el-form-item>
    <el-form-item label="地区选择">{{ formModel.areaName }}</el-form-item>
    <el-form-item label="详情地址:" prop="address">
      <el-input
        class="select-item"
        v-if="!isView"
        v-model.trim="formModel.address"
        :size="size"
        placeholder="请输入详情地址"
        clearable
      ></el-input>
      <span v-else>{{formModel.address}}</span>
    </el-form-item>
    <el-form-item label="门店名称:" prop="shopName">
      <el-input
        class="select-item"
        v-if="!isView"
        v-model.trim="formModel.shopName"
        :size="size"
        placeholder="请输入门店名称"
        clearable
      ></el-input>
      <span v-else>{{formModel.shopName}}</span>
    </el-form-item>
    <el-form-item label="营业时间:" prop="businessHours">
      <el-input
        class="select-item"
        v-if="!isView"
        v-model.trim="formModel.businessHours"
        :size="size"
        placeholder="请输入营业时间"
        clearable
      ></el-input>
      <span v-else>{{formModel.businessHours}}</span>
    </el-form-item>
    <el-form-item label="关联打印机:" prop="printer">
      <el-input
        class="select-item"
        v-if="!isView"
        v-model.trim="formModel.printer"
        :size="size"
        placeholder="请输入打印机号"
        clearable
      ></el-input>
      <span v-else>{{formModel.printer}}</span>
    </el-form-item>
    <el-form-item label="门店描述:" prop="status">
      <el-input
        class="select-item"
        v-if="!isView"
        v-model.trim="formModel.status"
        :size="size"
        placeholder="请输入描述"
        clearable
      ></el-input>
      <span v-else>{{formModel.status}}</span>
    </el-form-item>
    <el-form-item label="状态:">
      <el-switch v-model="formModel.marketable" :disabled="isView || isDisabled"></el-switch>
    </el-form-item>
  </c-card>
</template>
<script>
import CCard from 'components/card'

export default {
  data() {
    return {
      editor: null,
      formModel: {}
    }
  },
  props: {
    title: String,
    dataObj: Object,
    size: {
      type: String,
      default: 'medium'
    },
    isView: {
      type: Boolean,
      default: false
    },
    isDisabled: {
      type: Boolean,
      default: false
    }
  },
  created() {
    const {
      contact,
      areaName,
      contactTel,
      address,
      businessHours,
      status,
      printer,
      shopName,
      marketable
    } = this.dataObj
    this.formModel = {
      contact,
      contactTel,
      areaName,
      status,
      businessHours,
      printer,
      address,
      shopName,
      marketable: marketable === 1
    }
  },
  components: {
    CCard
  }
}
</script>
<style lang="less" scoped>
.form-card {
  .el-form-item {
    width: 98%;
    margin-bottom: 15px;
  }
  .select-item {
    width: 30%;
  }
}
</style>
