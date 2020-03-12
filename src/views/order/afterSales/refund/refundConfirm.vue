<template>
  <div>
    <el-form
      ref="formRef"
      :model="formModel"
      :inline="true"
      class="dialog-form"
      label-position="left"
    >
      <p>退款总金额{{curItemInfo.refundFee}}元，至用户账户余额</p>
      <div v-for="(item,index) in formModel.afterRefundLogList" :key="index">
        <el-form-item label="扣费项目:">
          <el-select
            class="select-item"
            clearable
            v-model.trim="formModel.afterRefundLogList[index].typeId"
          >
            <el-option
              v-for="item in feeList"
              :key="item.id"
              :label="item.feeName"
              :value="item.id"
            ></el-option>
          </el-select>
          <!-- <el-input v-model.trim="formModel.afterRefundLogList[index].typeId"></el-input> -->
        </el-form-item>
        <el-form-item label="金额:">
          <el-input type="number" @blur="moneyBlur($event,index)" :max="canRefundFee" v-model.trim="formModel.afterRefundLogList[index].money"></el-input>
        </el-form-item>
        <el-form-item label="备注:">
          <el-input v-model.trim="formModel.afterRefundLogList[index].remark"></el-input>
        </el-form-item>
        <el-button @click="addItem(item)" type="primary">新增</el-button>
        <el-button @click.prevent="removeItem(index)">删除</el-button>
      </div>
      <p>总计扣费余额：{{accumulateRefundFee}}元</p>
      <p>总计退款至余额：{{canRefundFee}}元</p>
      <el-form-item>
        <el-button type="primary" @click="submitForm">确认</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
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
      formModel: {
        afterRefundLogList: [
          {
            typeId: '',
            money: 0,
            remark: ''
          }
        ]
      },
      canRefundFee:0,//当前可扣除的数目
      accumulateRefundFee:0,//累计已扣费
      curItemInfo:{},//当前退款信息
      feeList:[],//可扣款项目
    }
  },
  created(){
    this.feeList=this.initData.feeList
    this.curItemInfo=this.initData.row
    this.canRefundFee=this.curItemInfo.refundFee
  },
  methods: {
    submitForm() {
      console.log('this-----,', this.formModel,this.$refs.formRef)
      //自定义校验
      this.formModel.afterRefundLogList.map((elem,index)=>{

      })
      this.$emit('submit',{refundOrder:this.curItemInfo.refundOrder,...this.formModel})
    },
    removeItem(index) {
      if (this.formModel.afterRefundLogList.length>1 ) {
        this.formModel.afterRefundLogList.splice(index, 1)
      }
    },
    addItem() {
      this.formModel.afterRefundLogList.push({
        typeId: '',
        money: 0,
        remark: ''
      })
    },
    //计算累计扣费
    caculateRefundFee(){
      this.accumulateRefundFee=this.formModel.afterRefundLogList.reduce((pre,cur)=>{
        return (parseInt(pre)+parseInt(cur.money))
      },0)
    },
    //金额输入框校验
    moneyBlur(e,index){
      let value=e.target.value
      if (value<0) value=-value//转为正数
      this.formModel.afterRefundLogList[index].money = parseInt(value)
      this.caculateRefundFee()//累计扣费
      let diff = parseInt(this.curItemInfo.refundFee) - parseInt(this.accumulateRefundFee)
      if(diff>=0){
        this.canRefundFee = diff//当前剩余
      }else{
        this.formModel.afterRefundLogList[index].money = parseInt(value)+parseInt(diff)
        this.accumulateRefundFee=this.curItemInfo.refundFee
        this.canRefundFee =0
      }
    }
  }
}
</script>
