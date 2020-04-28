<template>
  <div class="pay-detail">
    <line-card title="定制信息">
      <div class="row">
        <span>当前状态：{{formModel.operatorName}}</span>
      </div>
      <div class="row">
        <span>定制单号：{{formModel.intentionNo}}</span>
        <span>提交时间：{{formModel.createdAt}}</span>
        <span>用户昵称：{{formModel.memberName}}</span>
      </div>
      <div class="row">
        <span>手机：{{formModel.memberPhone}}</span>
        <span>版型：{{formModel.type}}</span>
        <span>颜色：{{formModel.color}}</span>
      </div>
      <div class="row">
        <span>印花工艺：{{formModel.printing}}</span>
        <span>功能：{{formModel.features}}</span>
        <span>客户姓名：{{formModel.username}}</span>
      </div>
      <div class="row">
        <span>客户手机：{{formModel.mobile}}</span>
        <span>滤芯：{{formModel.filter}}</span>
        <span>包装：{{formModel.packageName}}</span>
      </div>
      <div class="row">
        <span>预订数量：{{formModel.qty}}</span>
        <span>预期交付时间：{{formModel.expectedDtime}}</span>
      </div>
      <div class="row">
          <span>备注：{{formModel.remark}}</span>
      </div>
       <div class="row-line">
          <span>设计参考图：</span>
          <el-image class="picImg" v-for="item in formModel.productImage" :key="item" :src="item"></el-image>
      </div>

    </line-card>
     <line-card title="付款信息">
        <div class="row">
          <span>定制单金额：{{formModel.payAmount}}</span>
           <span>付款状态：{{formModel.payStatusText}}</span>
      </div>
      <div class="row">
          <span>付款方式：{{formModel.payType}}</span>
          <span>付款时间：{{formModel.payTime}}</span>
      </div>
     </line-card>
      <line-card title="设计图">
        <div class="row">
           <el-image class="picImg" v-for="item in formModel.images" :key="item" :src="item"></el-image>
        </div>
     </line-card>
     <line-card title="收货信息">
        <div class="row">
          <span>收货人：{{formModel.deliveryUser}}</span>
           <span>手机：{{formModel.deliveryMobile}}</span>
      </div>
      <div class="row">
          <span>收货时间：{{formModel.receiptTime}}</span>
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
.pay-detail {
  .picImg{
     width: 100px;
     height: 100px;
     margin-right: 20px;
  }
  .row {
    display: flex;
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
