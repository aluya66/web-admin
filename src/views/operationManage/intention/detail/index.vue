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
import dictObj from '@/store/dictData'
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
            productImage,
            images,
            type,
            receiptTime
          } = res
          // 图片json转换
          let pImg = productImage ? JSON.parse(productImage) : []
          let img = images ? JSON.parse(images) : []

          this.formModel = {
            ...this.formModel,
            ...res,
            receiptTime: receiptTime || '',
            isShowFeat: type !== dictObj.diffIntentType, // 是否需要显示口罩功能
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

            deliveryName: deliveryAddress ? deliveryAddress.name : '',
            deliveryMobile: deliveryAddress ? deliveryAddress.mobile : '',
            deliveryArea: deliveryAddress ? [deliveryAddress.provinceCode, deliveryAddress.cityCode, deliveryAddress.regionCode] : [],
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
          provinceCode: this.formModel.deliveryArea[0] || '',
          cityCode: this.formModel.deliveryArea[1] || '',
          regionCode: this.formModel.deliveryArea[2] || '',
          mobile: this.formModel.deliveryMobile || '',
          name: this.formModel.deliveryName || ''
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
      const customizeForm = this.$refs.customizeRef.$refs.formRef
      const payForm = this.$refs.payRef.$refs.formRef
      const addressForm = this.$refs.addressRef.$refs.formRef
      Promise.all([customizeForm, payForm, addressForm].map(this.getFormPromise)).then(res => {
        // 所有子表单是否校验通过
        const validateResult = res.every(item => !!item)
        if (validateResult) {
          this.handleData()
        } else {
          console.log('未校验通过')
        }
      })
    }
  }
}
</script>
