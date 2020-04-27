<template>
  <c-view>
    <template v-slot:header>
      <el-page-header
        @back="goBack"
        :content="$route.meta.name || $t(`route.${$route.meta.title}`)"
      ></el-page-header>
    </template>
    <div class="detail-form">
       <!--定制信息模块 -->
      <g-customize :data-obj.sync="formModel" title="定制信息" ref="customizeRef"></g-customize>

      <!--付款信息模块 -->
       <g-pay :data-obj.sync="formModel" title="付款信息" ref="payRef"></g-pay>

       <!--收货地址模块 -->
       <g-address :data-obj.sync="formModel" title="收货信息" ref="addressRef"></g-address>

       <!--设计图模块 -->
       <g-img :data-obj.sync="formModel" title="设计图列表" ref="addressRef"></g-img>


      <div class="btn-wrapper">
        <el-button
          :size="size"
          :loading="btnLoading"
          type="primary"
          @click.native.prevent="submitHandle"
        >保存</el-button>
        <el-button :size="size" @click.native.prevent="goBack">返回</el-button>
      </div>
    </div>
  </c-view>
</template>

<script>
import MixinForm from 'mixins/form'
import GCustomize from './customize'
import GPay from './pay'
import GAddress from './address'
import GImg from './img'

export default {
  name: 'operationManage',
  mixins: [MixinForm],
  components: {
    GCustomize,
    GPay,
    GAddress,
    GImg
  },
  data() {
    return {
      formModel: {
        // TODO... 初始化数据，需加备注
      },
      dialogObj: {},
      btnLoading: false
    }
  },

  created() {
    this.fetchData()
  },

  methods: {
    fetchData() {
      const { id } = this.$route.params
      this.$api.operationManage.queryIntentionDetail({ id }).then(res => {
        this.setTagsViewTitle()
        if (res) {
          const {
            deliveryAddress,
            images,
            productImage
          } = res
          this.formModel = {
            ...this.formModel,
            ...res,
            productImage: Array.isArray(productImage) ? productImage : [],
            deliveryAddress: {
              ...deliveryAddress,
              area: [deliveryAddress.provinceCode, deliveryAddress.cityCode, deliveryAddress.regionCode]
            }
          }
        }
      })
    },
    dialogConfirm() {
      this.dialogObj.isShow = false
    },
    submitHandle() {
        const params = {
            ...this.formModel,
            logRespList:[]  //不需要传入操作日志数据
        }
        this.$api.operationManage.updateIntention(params).then(res=>{
              if(res){
                
              }
        })

    }
  }
}
</script>
