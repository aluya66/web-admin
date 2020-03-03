<template>
  <el-form
    ref="formRef"
    :model="formModel"
    :rules="rules"
    label-width="140px"
    class="dialog-form"
    label-position="right"
    status-icon
  >
    <el-form-item label="订单编码:">{{formModel.orderCode}}</el-form-item>
    <el-form-item label="订单总金额(元):">{{formModel.orderTotalAmount}}</el-form-item>
    <el-form-item label="收货人姓名:" prop="name">
      <el-input v-model.trim="formModel.name" placeholder="请收货人姓名" class="input-item" clearable></el-input>
    </el-form-item>
    <el-form-item label="收货人电话:" prop="mobile">
      <el-input v-model.trim="formModel.mobile" placeholder="请收货人电话" class="input-item" clearable></el-input>
    </el-form-item>
    <el-form-item label="收货区域:" prop="addressCode">
      <el-cascader
        clearable
        class="select-item"
        :options="areaOptions"
        :props="optionsProps"
        v-model="formModel.addressCode"
        placeholder="请选择收货区域"
        filterable
      ></el-cascader>
    </el-form-item>
    <el-form-item label="收货地址:" prop="address">
      <el-input v-model.trim="formModel.address" placeholder="请输入详收货地址" class="input-item" clearable></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
import utils from 'utils'
import MixinForm from 'mixins/form'

export default {
  mixins: [MixinForm],
  props: {
    initData: {
      type: Object,
      default() {
        return {
          orderTotalAmount: '', // 订单总金额
          orderCode: '', // 订单编码
          name: '', // 收货人名称
          mobile: '', // 收货人电话
          address: '', // 详细地址
          addressCode: [] // 区域code
        }
      }
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    areaOptions: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data(vm) {
    return {
      optionsProps: {
        value: 'code',
        label: 'name',
        leaf: 2
      },
      rules: {
        name: [
          { required: true, message: '收货人姓名不能为空', trigger: 'blur' }
        ],
        mobile: [
          { required: true, validator: utils.validater.phoneNumber, trigger: 'blur' }
        ],
        addressCode: [{
          required: true, message: '地址省市区不能为空', trigger: 'change'
        }],
        address: [{
          required: true, message: '详细地址不能为空', trigger: 'blur'
        }]
      }
    }
  },
  computed: {
    formModel: {
      get() {
        return this.initData
      },
      set(val) {
        this.$emit('update:init-data', val)
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      const { orderCode, orderTotalAmount } = this.formModel
      this.$api.order.queryAddressInfo({
        orderCode
      }).then(res => {
        if (res) {
          const { provinceCode, cityCode, regionCode, mobile, address, name } = res
          this.formModel = {
            orderCode,
            orderTotalAmount,
            name,
            mobile,
            address,
            addressCode: [provinceCode, cityCode, regionCode] // 区域code
          }
        }
      })
    }
  }
}
</script>
