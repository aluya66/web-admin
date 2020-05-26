<template>
<c-card :name="title" class="form-card" id="form-status">
    <el-form
      ref="formRef"
      :model="formModel"
      label-width="120px"
      :rules="rules"
      class="form"
      label-position="right"
    >
    <el-form-item label="当前状态:" prop="operatorStatus">
        <el-select
          class="select-item"
          placeholder="选择当前状态"
          v-model="formModel.operatorStatus"
        >
          <el-option
              v-for="item in operatorStatusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
</c-card>
</template>

<script>
import dictObj from '@/store/dictData'
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
      operatorStatusList: dictObj.intentionStaus, // 意向单状态
      rules: {
        operatorStatus: [
          { required: true, message: '请选择当前意向单状态', trigger: 'change' }
        ]
       }  
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
      //todo...
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
