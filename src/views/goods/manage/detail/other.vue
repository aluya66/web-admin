<template>
  <c-card :name="title" class="form-card">
    <el-form-item label="渠道名称:" prop="goodsChannelValue">
      <el-input
        v-if="!isView"
        class="select-item"
        :disabled="isDisabled"
        v-model.trim="formModel.goodsChannelValue"
        :size="size"
        placeholder="请输入渠道名称"
        clearable
      />
      <span v-else>{{formModel.goodsChannelValue}}</span>
    </el-form-item>
    <el-form-item label="发货地:" prop="place">
      <el-input
        v-if="!isView"
        :disabled="isDisabled"
        class="select-item"
        :title="formModel.place"
        v-model.trim="formModel.place"
        :size="size"
        placeholder="请输入发货地"
        clearable
      />
      <span v-else>{{formModel.place}}</span>
    </el-form-item>
    <el-form-item label="重量:" prop="weight">
      <el-input
        class="select-item"
        v-if="!isView"
        :disabled="isDisabled"
        v-model.trim="formModel.weight"
        :size="size"
        placeholder="请输入重量"
        clearable
      ></el-input>
      <span v-else>{{formModel.weight}}</span>
    </el-form-item>
    <el-form-item label="单位:" prop="weightUnit">
      <el-input
        class="select-item"
        v-if="!isView"
        :disabled="isDisabled"
        v-model.trim="formModel.weightUnit"
        :size="size"
        placeholder="请输入单位"
        clearable
      ></el-input>
      <span v-else>{{formModel.weightUnit}}</span>
    </el-form-item>
    <el-form-item label="上架:">
      <el-switch v-model="formModel.marketable" :disabled="isView || isDisabled"></el-switch>
    </el-form-item>
    <!-- <el-form-item label="上架时间:" v-if="isView || isDisabled">
      {{formModel.uptime}}
    </el-form-item>
    <el-form-item label="下架时间:" v-if="isView || isDisabled">
      {{formModel.downtime}}
    </el-form-item> -->
    <el-form-item label="创建时间:" v-if="isView || isDisabled">
      {{formModel.created}}
    </el-form-item>
    <el-form-item label="更新时间:" v-if="isView || isDisabled">
      {{formModel.updated}}
    </el-form-item>
    <el-form-item label="商品详情:">
      <c-wangEditor :is-view="isView || isDisabled" :content.sync="formModel.intro"></c-wangEditor>
    </el-form-item>
  </c-card>
</template>
<script>
import CCard from 'components/card'
import CWangEditor from 'components/wangEditor'

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
      intro,
      place,
      goodsChannelValue,
      weight,
      weightUnit,
      marketable,
      created,
      updated
    } = this.dataObj

    this.formModel = {
      intro,
      place,
      goodsChannelValue,
      weight,
      weightUnit,
      marketable: marketable === 1,
      created,
      updated
    }
  },
  components: {
    CCard,
    CWangEditor
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
