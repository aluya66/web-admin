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
          <el-input type="number" v-model.trim="formModel.afterRefundLogList[index].money"></el-input>
        </el-form-item>
        <el-form-item label="备注:">
          <el-input v-model.trim="formModel.afterRefundLogList[index].remark"></el-input>
        </el-form-item>
        <el-button @click="addItem(item)" type="primary">新增</el-button>
        <el-button @click.prevent="removeItem(item)">删除</el-button>
      </div>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
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
            money: '',
            remark: ''
          }
        ]
      },
      curItemInfo:{},
      feeList:[]
    }
  },
  created(){
    this.feeList=this.initData.feeList
    this.curItemInfo=this.initData.row
  },
  methods: {
    submitForm() {
      console.log('this-----,', this.formModel,this.$refs.formRef)

      //自定义校验
      this.formModel.afterRefundLogList.map((elem,index)=>{

      })

      //
      this.$emit('submit',{refundOrder:this.curItemInfo.refundOrder,...this.formModel})

    },
    removeItem(item) {
      var index = this.formModel.afterRefundLogList.indexOf(item)
      if (index !== -1 && index !== 0) {
        this.formModel.afterRefundLogList.splice(index, 1)
      }
    },
    addItem() {
      this.formModel.afterRefundLogList.push({
        typeId: '',
        money: '',
        remark: ''
      })
    }
  }
}
</script>
