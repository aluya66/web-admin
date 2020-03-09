<template>
  <div>
    <el-row>
      <el-col :span="4"><div>单号:</div></el-col>
      <el-col :span="20"><div>{{formModel.refundOrder}}</div></el-col>
    </el-row>
    <el-row>
      <el-col :span="4"><div>客户名称:</div></el-col>
      <el-col :span="20"><div>{{formModel.userName}}</div></el-col>
    </el-row>
    <el-row>
      <el-col :span="4"><div>状态:</div></el-col>
      <el-col :span="20"><div>{{formModel.status===0?'未退款':'已退款'}}</div></el-col>
    </el-row>
    <el-row>
      <el-col :span="4"><div>售后时间:</div></el-col>
      <el-col :span="20"><div>{{formModel.afterTime}}</div></el-col>
    </el-row>
    <el-row>
      <el-col :span="4"><div>客户电话:</div></el-col>
      <el-col :span="20"><div>{{formModel.userPhone}}</div></el-col>
    </el-row>
    <el-row>
      <el-col :span="4"><div>退款类型:</div></el-col>
      <el-col :span="20"><div>{{refundAllType[formModel.refundType]}}</div></el-col>
    </el-row>
     <el-row>
      <el-col :span="4"><div>退款金额:</div></el-col>
      <el-col :span="20"><div>{{formModel.refundFee}}</div></el-col>
    </el-row>
  </div>
</template>

<script>

export default {
  components: {
  },
  props: {
    initData: {
      type: Object,
      default() {
        return {
        }
      }
    }
  },
  data() {
    return {
      refundAllType: {
        1: '余额',
        2: '星GO卡',
        3: '代金券'
      }
    }
  },
  computed: {
    formModel() {
      return this.initData
    }
  }
}
</script>
