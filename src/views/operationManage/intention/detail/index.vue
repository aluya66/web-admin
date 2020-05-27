<template>
  <c-view>
    <template v-slot:header>
      <el-page-header
        @back="goBack"
        :content="$route.meta.name || $t(`route.${$route.meta.title}`)"
      ></el-page-header>
    </template>
    <div class="detail-form">
       <!--当前状态 -->
      <g-status :data-obj.sync="formModel" title="当前状态" ref="statusRef"></g-status>

       <!--订单信息模块 -->
      <g-order :data-obj.sync="formModel" title="订单信息" ref="orderRef"></g-order>

       <!--客户信息模块 -->
      <g-custom :data-obj.sync="formModel" title="客户信息" ref="customRef"></g-custom>

      <!--商品信息模块 -->
      <g-goods :data-obj.sync="formModel" title="商品信息" ref="goodsRef"></g-goods>

       <!--其他信息模块 -->
      <g-other :data-obj.sync="formModel" title="其他信息" ref="otherRef"></g-other>

      <!--流程信息模块 -->
      <g-flow :data-obj.sync="formModel" title="流程信息" ref="flowRef"></g-flow>

      <!--付款信息模块 -->
       <g-pay :data-obj.sync="formModel" title="付款信息" ref="payRef"></g-pay>

       <!--收货地址模块 -->
       <g-address :data-obj.sync="formModel" title="收货信息" ref="addressRef"></g-address>

       <!--设计图模块 -->
       <g-img :data-obj.sync="formModel" title="设计图列表" ref="imgsRef"></g-img>

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
import GOther from './other'
import GPay from './pay'
import GAddress from './address'
import GImg from './img'
import GFlow from './flow'
import GStatus from './status'
import GOrder from './order'
import GCustom from './custom'
import GGoods from './goods'

export default {
  name: 'operationManage',
  mixins: [MixinForm],
  components: {
    GOther,
    GPay,
    GAddress,
    GImg,
    GFlow,
    GStatus,
    GOrder,
    GCustom,
    GGoods
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
            productImage,
            images,
            receiptTime
          } = res
          // 图片json转换
          let pImg = productImage ? JSON.parse(productImage) : []
          let img = images ? JSON.parse(images) : []

          this.formModel = {
            ...this.formModel,
            ...res,
            goodFlag: true,
            receiptTime: receiptTime || '',
            productImage: pImg.map((item, index) => {
              return {
                id: index + new Date().getTime(),
                name: '设计图',
                url: item,
                fileType: 'image',
                ref: 'imgList'
              }
            }),
            images: img.map((item, index) => {
              return {
                name: '设计图',
                url: item,
                fileType: 'image'
              }
            }),

            receiverName: deliveryAddress ? deliveryAddress.name : '',
            receiverMobile: deliveryAddress ? deliveryAddress.mobile : '',
            receiverArea: deliveryAddress ? [deliveryAddress.provinceCode, deliveryAddress.cityCode, deliveryAddress.regionCode] : [],
            address: deliveryAddress ? deliveryAddress.address : ''
          }
        }
      })
    },

    dialogConfirm() {
      this.dialogObj.isShow = false
    },
    goBack() {
      this.$confirm('当前页面如有更改，直接返回会导致您更改的信息数据丢失！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.go(-1)
      }).catch(() => {
        // 取消 todo...
      })
    },
    handleData() {
      const params = {
        ...this.formModel,
        deliveryAddress: {
          address: this.formModel.address || '',
          provinceCode: this.formModel.receiverArea[0] || '',
          cityCode: this.formModel.receiverArea[1] || '',
          regionCode: this.formModel.receiverArea[2] || '',
          mobile: this.formModel.receiverMobile || '',
          name: this.formModel.receiverName || ''
        },
        productImages: this.formModel.productImage.map(item => {
          return item.url
        }),
        images: JSON.stringify(this.formModel.images.map(item => {
          return item.url
        })),
        logRespList: [] // 不需要传入操作日志数据
      }

      this.$api.operationManage.updateIntention(params).then(res => {
        if (res) {
          this.$msgTip('编辑成功')
          this.closeCurrentTag()
          this.$router.go(-1)
        }
      })
    },
    submitHandle() {
      // 确认完成按钮，需要做必填项校验
      const statusForm = this.$refs.statusRef.$refs.formRef
      const orderForm = this.$refs.orderRef.$refs.formRef
      const customForm = this.$refs.customRef.$refs.formRef
      const otherForm = this.$refs.otherRef.$refs.formRef
      const payForm = this.$refs.payRef.$refs.formRef
      const addressForm = this.$refs.addressRef.$refs.formRef
      Promise.all([statusForm, orderForm, customForm, otherForm, payForm, addressForm].map(this.getFormPromise)).then(res => {
        // 所有子表单是否校验通过
        const validateResult = res.every(item => !!item)
        // 商品信息是否填写正确
        const goodFlag = this.formModel.goodFlag
        if (validateResult && goodFlag) {
          this.handleData()
        } else if (!goodFlag) {
          this.$msgTip('预订数量不能小于1或者大于100W/滤芯数量不能小于0或者大于99', 'error')
        } else {
          console.log('校验未通过')
        }
      })
    }
  }
}
</script>
