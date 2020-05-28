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
      <el-form-item label="收货人:" prop="receiverName">
        <el-input
          class="select-item"
          v-model="formModel.receiverName"
          :size="size"
          placeholder="请输入收货人"
          maxlength="50"
          autocomplete="off"
          clearable
        />
      </el-form-item>
        <el-form-item label="手机:" prop="receiverMobile">
        <el-input
          class="select-item"
          v-model="formModel.receiverMobile"
          :size="size"
          placeholder="请输入手机"
          maxlength="20"
           autocomplete="off"
          clearable
        />
      </el-form-item>
     <el-form-item label="收货时间:" prop="receiptTime">
        <el-date-picker
            v-model="formModel.receiptTime"
            value-format="yyyy-MM-dd"
            type="date"
            class="select-item"
            placeholder="请选择收货时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="收货区域:" prop="receiverArea">
        <el-cascader
            clearable
            class="select-item"
            v-model="formModel.receiverArea"
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
        v-model="formModel.address"
        :size="size"
        placeholder="请输入详细地址"
        clearable
        maxlength="50"
      />
    </el-form-item>
    <el-form-item label="物流公司:" prop="deliveryName">
        <el-input
          class="select-item"
          v-model="formModel.deliveryName"
          :size="size"
          maxlength="20"
          placeholder="请输入物流公司"
          autocomplete="off"
          clearable
        />
      </el-form-item>
       <el-form-item label="物流单号:" prop="deliveryNo">
        <el-input
          class="select-item"
          v-model="formModel.deliveryNo"
          :size="size"
          maxlength="20"
          placeholder="请输入物流单号"
          autocomplete="off"
          clearable
        />
      </el-form-item>
      <el-form-item label="物流费用:" prop="deliveryFee">
        <el-input
          class="select-item"
          v-model="formModel.deliveryFee"
          :size="size"
          maxlength="20"
          placeholder="请输入物流费用"
          autocomplete="off"
          clearable
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
        receiverMobile: [
          { validator: utils.validater.notCnEnText, trigger: 'blur' }
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
    this.fetchAreaData()
  },
  methods: {
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
