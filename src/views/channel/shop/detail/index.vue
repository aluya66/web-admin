<template>
  <c-view>
    <template v-slot:header>
      <el-page-header
        @back="goBack"
        :content="$route.meta.name || $t(`route.${$route.meta.title}`)"
      ></el-page-header>
    </template>
    <div class="form">
      <s-shop
        :is-view="isView"
        :is-disabled="isDisabled"
        :data-obj.sync="formModel"
        ref="formRef"
        @show-image="reviewImage"
        @open-dialog="showDialog"
      ></s-shop>
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

    <div v-if="dialogObj.isShow">
      <c-dialog
        :is-show="dialogObj.isShow"
        :title="dialogObj.title"
        close-btn
        width="80%"
        @before-close="dialogObj.isShow = false"
        @on-submit="dialogConfirm"
      >
        <channel-connect ref="childRef" :initChecked="formModel.channelCode"></channel-connect>
      </c-dialog>
    </div>
  </c-view>
</template>

<script>
import MixinForm from 'mixins/form'
import SShop from './shop'
import ChannelConnect from './add'
import CDialog from './add'

export default {
  name: 'shopDetail',
  components: {
    SShop,
    ChannelConnect,
    CDialog
  },
  mixins: [MixinForm],
  data() {
    return {
      dialogObj: {},
      formModel: {
        shopType: 1, // 门店类型
        businessCode: '', // 选择商户
        shopLogo: [], // 门店logo
        shopName: '', // 门店名称
        shopAddress: 1, // 门店地址
        address: '', // 详细地址
        coordinate: '', // 门店坐标
        contact: '', // 联系人
        contactTel: '', // 联系手机
        usePos: '', // 使用pos
        isConnectPrinter: '', // 是否关联打印机
        printer: '', // 打印机编号
        businessType: 1, // 经营方式 1加盟
        settleType: 1, // 结算方式 1先款后贷
        status: '', // 状态
        isRecommend: 1, // 是否推荐
        style: '', // 店铺风格
        shopImage: [], // 店招图片
        exhibitionImage: [], // 展馆图
        videoUrl: [], // 店铺视频
        businessHours: '', // 营业时间
        shopDescription: '', // 描述
        isVisible: '', // 是否隐藏门店
        stockCheck: '', // 支持盘点
        channelCode: [] // 关联渠道
      },
      isView: true,
      isDisabled: true,
      btnLoading: false
    }
  },
  created() {
    // this.fetchData()
  },
  methods: {
    dialogConfirm() {
      this.formModel.channelCode = this.$refs.childRef.checkedAttr
      this.dialogObj.isShow = false
    },
    showDialog() {
      this.dialogObj = {
        isShow: true,
        title: '关联渠道'
      }
      console.log(this.dialogObj)
    },
    fetchData() {
      const { params } = this.$route
      this.isDisabled = true
      this.$api.channel.getShopDetail({ id: params.shopId }).then(res => {
        if (res) {
          this.formModel = res
        } else {
          this.$msgTip('接口数据异常，请稍后重新尝试')
        }
      })
    },
    submitHandle() {
      const shopForm = this.$refs.formRef.$refs.shopFormRef
      Promise.all([shopForm].map(this.getFormPromise)).then(res => {
        // 所有子表单是否校验通过
        const validateResult = res.every(item => !!item)
        if (validateResult) {
          console.log(this.$refs.formRef.formModel)
        } else {
          console.log('未校验通过')
        }
      })
    },
    reviewImage(file) {
      this.dialogObj = {
        isShow: true,
        imageUrl: file.url,
        videoUrl: file.videoUrl,
        fileType: file.fileType
      }
    }
  }
}
</script>

<style lang='less' scoped>
.form {
  background-color: @white;
  padding: 15px 15px;
  .form-btn {
    margin-left: 20px;
    margin-top: 20px;
  }
}
.btn-wrapper {
  margin-left: 140px;
}
</style>
