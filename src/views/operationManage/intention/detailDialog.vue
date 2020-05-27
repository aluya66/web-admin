<template>
  <div class="pay-detail">
      <div class="row">
        <span>当前状态：{{formModel.operatorName}}</span>
      </div>
    <line-card title="订单信息">
      <div class="row">
          <span>定制单号：{{formModel.intentionNo}}</span>
          <span>提交时间：{{formModel.createdAt}}</span>
          <span>提交用户：{{formModel.memberName}}</span>
          <span>手机：{{formModel.memberPhone}}</span>
      </div>
    </line-card>
   <line-card title="客户信息">
      <div class="row">
         <span>客户姓名：{{formModel.username}}</span>
         <span>客户手机：{{formModel.mobile}}</span>
         <span>订单类型：{{formModel.source}}</span>
         <span>公司名称：{{formModel.companyName}}</span>
      </div>
    </line-card>
    <line-card title="商品信息">
        <table class="el-table goods-table" cellspacing="0" cellpadding="0">
          <thead>
            <tr>
              <th style="width: 100px;">商品类型</th>
              <th style="width: 200px;">版型</th>
              <th style="width: 150px;">款式</th>
              <th style="width: 150px;">预订数量</th>
              <th style="width: 150px;">滤芯（搭配一片口罩）</th>
              <th style="width: 150px;">备注</th>
            </tr>
          </thead>
          <tbody>
              <tr v-for="(item,index) in formModel.goodsList" :key="index">
                  <td>{{item.name}}</td>
                  <td>{{item.specs.type || ''}}</td>
                  <td>{{item.specs.style || ''}}</td>
                  <td>{{item.qty}}</td>
                  <td>{{item.specs.filter || ''}}</td>
                  <td>{{item.remark}}</td>
              </tr>
          </tbody>
        </table>
    </line-card>
    <line-card title="其他信息">
      <div class="row">
        <span>预期交付时间：{{formModel.expectedDtime}}</span>
      </div>
      <div class="row">
          <span>备注：{{formModel.remark}}</span>
      </div>
       <div class="row-line">
          <span>设计参考图：</span>
          <el-image class="picImg" v-for="item in formModel.images" :key="item" :src="item" :preview-src-list="formModel.images"></el-image>
      </div>
    </line-card>

     <line-card title="流程信息">
        <div class="row">
          <span>需求确认单号：{{formModel.confirmNo}}</span>
          <span>生产指令单号：{{formModel.makeNo}}</span>
      </div>
        <div class="row">
          <span>备注：{{formModel.makeRemark}}</span>
      </div>
     </line-card>
     <line-card title="付款信息">
        <div class="row">
          <span>定制单金额：{{formModel.payAmount}}</span>
           <span>付款状态：{{formModel.payName}}</span>
          <span>付款方式：{{formModel.payType}}</span>
      </div>
      <div class="row">
          <span>付款时间：{{formModel.payTime}}</span>
      </div>
     </line-card>
      <line-card title="设计图">
        <div class="row">
           <el-image class="picImg" v-for="item in formModel.productImage" :key="item" :src="item" :preview-src-list="formModel.productImage"></el-image>
        </div>
     </line-card>
     <line-card title="收货信息">
        <div class="row">
          <span>收货人：{{formModel.deliveryUser}}</span>
           <span>手机：{{formModel.deliveryMobile}}</span>
          <span>收货时间：{{formModel.receiptTime}}</span>
      </div>
          <div class="row">
          <span>物流公司：{{formModel.deliveryUser}}</span>
           <span>物流单号：{{formModel.deliveryMobile}}</span>
          <span>物流费用：{{formModel.receiptTime}}</span>
      </div>
      <div class="row">
          <span>收货区域：{{formModel.provinceName}}-{{formModel.cityName}}-{{formModel.regionName}}</span>
      </div>
       <div class="row">
          <span>收货地址：{{formModel.address}}</span>
      </div>

     </line-card>
       <line-card title="操作日志">
        <div class="table-row">
          <c-table
            ref="cTable"
            hasBorder
            noPage
            :loading="false"
            :max-height="300"
            :size="size"
            :table-header="tableHeader"
            :table-list="formModel.logRespList"
          ></c-table>
        </div>
       </line-card>
  </div>
</template>

<script>
import dictObj from '@/store/dictData'
import mixinTable from 'mixins/table'
import LineCard from '@/views/common/lineCard'

export default {
  mixins: [mixinTable],
  components: {
    LineCard
  },
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
      formModel: {},
      tableHeader: [

        {
          label: '操作人',
          prop: 'intentionId'
        },
        {
          label: '操作时间',
          prop: 'created'
        }
      ],
      payTypeList: dictObj.payTypeList,
      orderBusinessTypeList: dictObj.orderBusinessTypeList
    }
  },
  created() {
    this.getDeliveryDetail()
  },
  methods: {
    /*
	   * 查询意向单详情
	   */
    getDeliveryDetail() {
      const { id } = this.initData
      this.$api.operationManage.queryIntentionDetail({ id }).then(res => {
        this.formModel = {
          ...res,
          productImage: res.productImage ? JSON.parse(res.productImage) : [],
          images: res.images ? JSON.parse(res.images) : [],
          deliveryUser: res.deliveryAddress && res.deliveryAddress.name,
          deliveryMobile: res.deliveryAddress && res.deliveryAddress.mobile,
          provinceName: res.deliveryAddress && res.deliveryAddress.provinceName,
          cityName: res.deliveryAddress && res.deliveryAddress.cityName,
          regionName: res.deliveryAddress && res.deliveryAddress.regionName,
          address: res.deliveryAddress && res.deliveryAddress.address
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.goods-table{
  width: 95%;
  margin: 0 auto;
           border: 1px solid @border-default;
            td,
            th {
            border-right: 1px solid @border-default;
            text-align: center;
            .el-input {
                width: 80%;
            }
            &:last-child {
                border-right: none;
            }
        }
      }
.pay-detail {
  .picImg{
     width: 120px;
     margin-right: 20px;
  }
  .row {
    display: -webkit-box;
    flex-wrap: wrap;
    span {
      display: inline-block;
      margin: 10px 20px 10px 0;
      min-width: 220px;
    }
  }
  .table-row {
    padding: 0 80px 30px 80px;
  }
}
</style>
