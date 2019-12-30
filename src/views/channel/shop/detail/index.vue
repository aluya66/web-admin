<template>
  <c-view>
    <template v-slot:header>
      <el-page-header
        @back="goBack"
        :content="$route.meta.name || $t(`route.${$route.meta.title}`)"
      ></el-page-header>
    </template>
    <el-form
      ref="formRef"
      :model="formModel"
      label-width="110px"
      class="form"
      label-position="right"
    >
      <s-shop
        :is-view="isView"
        :is-disabled="isDisabled"
        :data-obj.sync="formModel"
        ref="basicRef"
        @show-image="reviewImage"
      ></s-shop>
      <el-form-item class="form-btn" v-if="!isView">
        <el-button :loading="btnLoading" type="primary" @click.native.prevent="submitHandle">保存</el-button>
      </el-form-item>
    </el-form>
  </c-view>
</template>

<script>
import MixinForm from 'mixins/form'
import SShop from './shop'

export default {
  name: 'shopDetail',
  components: {
    SShop
  },
  mixins: [MixinForm],
  data() {
    return {
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
        usePos: false, // 使用pos
        isConnectPrinter: false, // 是否关联打印机
        printer: '', // 打印机编号
        businessType: 1, // 经营方式 1加盟
        settleType: 1, // 结算方式 1先款后贷
        status: '', // 状态
        isRecommend: '', // 是否推荐
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
    this.fetchData()
  },
  methods: {
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
      this.$refs.formRef.validate(valid => {
        if (valid) {
          console.log(this.$refs.formModel)
        } else {
          console.log('error submit!!')
          return false
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
</style>
