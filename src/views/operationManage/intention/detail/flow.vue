<template>
<c-card :name="title" class="form-card" id="form-flow">
    <el-form
      ref="formRef"
      :model="formModel"
      label-width="120px"
      class="form"
      label-position="right"
    >
      <el-form-item label="需求确认单号:" prop="confirmNo">
        <el-input
          class="select-item"
          v-model="formModel.confirmNo"
          :size="size"
          placeholder="需求确认单号"
          maxlength="20"
          autocomplete="off"
          clearable
        />
      </el-form-item>
        <el-form-item label="生产指令单号:" prop="makeNo">
        <el-input
          class="select-item"
          v-model="formModel.confirmNo"
          :size="size"
          placeholder="生产指令单号"
           maxlength="20"
          autocomplete="off"
          clearable
        />
      </el-form-item>
    <el-form-item label="备注:" prop="makeRemark">
        <el-input
          type="textarea"
          class="select-item"
          :rows="4"
          v-model="formModel.makeRemark"
          placeholder="请输入备注"
          maxlength="500"
        ></el-input>（注：最大限制输入500个字符）
      </el-form-item>
    </el-form>
</c-card>
</template>

<script>
import CCard from 'components/card'
import utils from '@/utils'
export default {
  components: {
    CCard
  },
  computed: {
    formModel() {
      return this.dataObj
    }
  },
  data() {
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
   
  },
  methods: {
    
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
