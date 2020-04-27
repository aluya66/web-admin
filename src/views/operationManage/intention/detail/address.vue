<template>
<c-card :name="title" class="form-card" id="form-address">
    <el-form
      ref="formRef"
      :model="formModel"
      :rules="rule"
      label-width="120px"
      class="form"
      label-position="right"
    >
      <el-form-item label="收货人:" prop="deliveryName">
        <el-input
          class="select-item"
          v-model="formModel.deliveryAddress.name"
          :size="size"
          placeholder="请输入收货人"
          clearable
        />
      </el-form-item>
        <el-form-item label="手机:" prop="deliveryMobile">
        <el-input
          class="select-item"
          v-model="formModel.deliveryAddress.mobile"
          :size="size"
          placeholder="请输入手机"
          clearable
        />
      </el-form-item>
     <el-form-item label="收货时间:" prop="deliveryTime">
        <el-input
          class="select-item"
          v-model="formModel.deliveryAddress.receiptTime"
          :size="size"
          placeholder="请输入收货时间"
          clearable
        />
      </el-form-item>
      <el-form-item label="收货区域:" prop="deliveryArea">
        <el-cascader
            clearable
            class="select-item"
            v-model="formModel.deliveryAddress.area"
            :props="optionsProps"
            :options="areaOptions"
            placeholder="请选择区域"
            filterable
            ref="cascaderRef"
        ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址:" prop="address">
      <el-input
        class="select-item"
        v-model.trim="formModel.deliveryAddress.address"
        :size="size"
        placeholder="请输入详细地址"
        clearable
        maxlength="50"
      />
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
      optionsProps: {
        value: 'code',
        label: 'name'
      },
      areaOptions: [], // 地址列表
      rule: {
          deliveryMobile: [
            { validator: utils.validater.phoneNumber, message: '请输入正确的手机号码格式', trigger: 'blur'}
          ]
      },
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
    this.fetchAreaData()
  },
  methods: {
    initData() {

    },
    fetchAreaData() {
      this.$api.basic.getAreaAll().then(res => {
        if (res.length) {
          this.areaOptions = res
        }
      })
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
