<template>
  <div class="detail">
    <div class="row">
      <span>订单号：{{formModel.thirdOrderCode}}</span>
      <span>售后单号：{{formModel.afterSalesCode}}</span>
    </div>
    <div class="row">
      <span>所属店铺：{{formModel.storeName}}</span>
      <span>售后时间：{{formModel.created}}</span>
    </div>
    <div class="row">
      <span>客户名称：{{formModel.buyerNick}}</span>
      <span>客户电话：{{formModel.buyerMobile}}</span>
    </div>
    <div class="row">
      <span>售后状态：{{formModel.statusName}}</span>
      <span>
        售后类型：
        <span v-if="formModel.dialogType === 1">{{formModel.afterSalesTypeName}}</span>
        <query-dict
          v-else
          showType="select"
          class="select-item"
          :dict-list="afterSalesTypes"
          placeholder="请选择"
          :value.sync="formModel.afterSalesType"
        ></query-dict>
      </span>
    </div>
    <div class="row" v-if="formModel.dialogType === '1'">
      <span>星购卡优惠：{{formModel.totalStoredCardDiscountAmount}}</span>
      <span>星购卡抵扣：{{formModel.totalStoredCardAmount}}</span>
    </div>
    <div class="table-row">
      <el-divider content-position="left">退货商品信息</el-divider>
      <c-table
        ref="cTable"
        hasBorder
        noPage
        :loading="false"
        :max-height="300"
        :size="size"
        :table-header="tableHeader"
        :table-list="formModel.detailList"
      ></c-table>
    </div>
    <!--更新物流信息-->
    <div class="delivery-row">
      <el-divider content-position="left">物流信息</el-divider>
      <div v-if="formModel.status==30||formModel.status==40||formModel.status==50">
        <el-form
          ref="formRef"
          :model="logiticFormModel"
          :rules="rules"
          class="form"
          label-width="100px"
          label-position="right"
        >
          <el-form-item label="物流公司：" prop="deliveryName" >
            <el-select
              v-model="logiticFormModel.deliveryName"
              class="select-item"
              clearable>
              <el-option
                v-for="item in logisticsList"
                :key="item.value"
                :label="item.label"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="物流单号：" prop="deliveryNo">
            <el-input class="select-item" v-model.trim="logiticFormModel.deliveryNo" />
          </el-form-item>
          <el-form-item>
            <el-button
              :size="size"
              type="primary"
              @click.native.prevent="submitHandle"
            >修改物流</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div v-else>
        <div class="delivery-item-row">
          <span>物流公司：{{formModel.deliveryList.length ? formModel.deliveryList[0].deliveryName : ''}}</span>
          <span>物流单号：{{formModel.deliveryList.length ? formModel.deliveryList[0].deliveryNo : ''}}</span>
        </div> 
        <div class="delivery-item-row">
          <span>操作物流发货时间：{{formModel.deliveryList.length ? formModel.deliveryList[0].created : ''}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dictObj from '@/store/dictData'
import mixinTable from 'mixins/table'

export default {
  mixins: [mixinTable],
  props: {
    initData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      logiticFormModel:{
        deliveryName:'',deliveryNo:''
      },
      rules: {
        deliveryName: [
          { required: true, message: '请输入物流公司', trigger: 'blur' }
        ],
        deliveryNo: [
          { required: true, message: '请输入物流单号', trigger: 'blur' }
        ],
      },
      afterSalesTypes: dictObj.afterSalesTypes,
      tableHeader: [
        {
          label: '商品编码',
          prop: 'skuCode'
        },
        {
          label: '商品图片',
          prop: 'picturePath',
          width: 100,
          isImage: true
        },
        {
          label: '商品名称',
          prop: 'productAtrName'
        },
        {
          label: '商品规格',
          prop: 'specifications'
        },
        {
          label: '商品单价',
          prop: 'salePrice'
        },
        {
          label: '售后数量',
          prop: 'skuQty'
        },
        {
          label: '商品总价',
          formatter(row) {
            return (row.salePrice * row.skuQty).toFixed(2)
          }
        },
        {
          label: '退款金额',
          prop: 'refundAmount'
        },
        {
          label: '备注',
          prop: 'remark'
        }
      ]
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
    },
    logisticsList:{
      get() {
        return this.initData.logisticsList
      },
    }
  },
  created(){
    if(this.initData.deliveryList.length){
      this.logiticFormModel={
        deliveryName:this.initData.deliveryList[0].deliveryName,
        deliveryNo:this.initData.deliveryList[0].deliveryNo
      }
    }
  },
  methods:{
    submitHandle(){
      this.$refs.formRef.validate(valid => {
        const deliveryInfo=this.logiticFormModel.deliveryName
        if (valid) {
          const params={
            afterSalesCode:this.formModel.afterSalesCode,//售后单单号	
            deliveryCode:deliveryInfo.value,//物流公司编码
            deliveryName:deliveryInfo.label,//物流公司名称	
            deliveryNo:this.logiticFormModel.deliveryNo,//物流单编号	
            deliveryType:2//配送类型 1:门店自提，2:快递
          }
          this.$emit('update-submit',params)
        }else{
          return false
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.detail {
  .row{ padding: 0 80px; }
  .row ,.delivery-item-row{
    display: flex;
    flex-wrap: wrap;
    span {
      display: flex;
      align-items: center;
      margin: 10px 20px 10px 0;
      min-width: 220px;
    }
  }
  .table-row,.delivery-row {
    padding: 0 80px 30px 80px;
  }
  .select-item{
    width:50%
  }
}
</style>
