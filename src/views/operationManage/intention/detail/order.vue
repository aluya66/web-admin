<template>
<c-card :name="title" class="form-card" id="form-base">
    <el-form
      ref="formRef"
      :model="formModel"
      label-width="120px"
      class="form"
      label-position="right"
    >
      <el-form-item label="定制单号:">
        <el-input
          class="select-item"
          disabled
          v-model.trim="formModel.intentionNo"
          :size="size"
          placeholder="请输入定制单号"
          clearable
        />
      </el-form-item>
       <el-form-item label="提交时间:">
        <el-input
          class="select-item"
          disabled
          v-model.trim="formModel.createdAt"
          :size="size"
          placeholder="请输入提交时间"
          clearable
        />
      </el-form-item>
      <el-form-item label="用户昵称:">
        <el-input
          class="select-item"
          disabled
          v-model.trim="formModel.memberName"
          :size="size"
          placeholder="请输入用户昵称"
          clearable
        />
      </el-form-item>
      <el-form-item label="手机:">
        <el-input
          class="select-item"
          disabled
          v-model.trim="formModel.memberPhone"
          :size="size"
          placeholder="请输入手机号码"
          clearable
        />
      </el-form-item>
     
    </el-form>
</c-card>
</template>

<script>
import CCard from 'components/card'


export default {
  components: {
    CCard
  },
  computed: {
    formModel() {
      return this.dataObj
    }
  },
  data(vm) {

    return {
     

    }
  },
  props: {
    title: String,
    dataObj: {
      type: Object,
      required: true
    },
    size: {
      type: String,
      default: 'medium'
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {

    }
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
  .pic {
    padding-bottom: 25px;
    span {
      display: inline-block;
      margin-bottom: 10px;
    }
    .info {
      line-height: 20px;
      height: 20px;
      margin-top: 5px;
      font-size: @f12;
    }
  }
  .tempimg {
    width: 200px;
    height: 200px;
    display: inline-block;
    margin-right: 5px;
  }
}
</style>
