<template>
<c-card :name="title" class="form-card" id="form-other">
    <el-form
      ref="formRef"
      :model="formModel"
      label-width="120px"
      :rules="rules"
      class="form"
      label-position="right"
    >

      <el-form-item label="预期交付时间:" prop="expectedDtime">
        <el-date-picker
          v-model="formModel.expectedDtime"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions"
          type="date"
          class="select-item"
          placeholder="选择日期">
      </el-date-picker>
    </el-form-item>

       <el-form-item label="设计参考图:">
          <el-image class="tempimg" v-for="item in formModel.images" :key="item.id" :src="item.url"></el-image>
      </el-form-item>
      <el-form-item label="备注:" prop="remark">
        <el-input
          type="textarea"
          class="select-item"
          :rows="4"
          v-model="formModel.remark"
          disabled
          placeholder="请输入备注"
          maxlength="200"
        ></el-input>（注：最大限制输入200个字符）
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

      pickerOptions: { // 日期过滤
        disabledDate(time) {
          return new Date(vm.formModel.createdAt) > time
        }
      },
      rules: {
        expectedDtime: [
          { required: true, message: '请选择预期交付时间', trigger: 'change' }
        ],
        remark: [
          { min: 0, max: 500, message: '长度在 0 到 500 个字符', trigger: 'blur' }
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
