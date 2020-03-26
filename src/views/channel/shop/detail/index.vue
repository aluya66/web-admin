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
        :style-lists.sync="styleList"
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
        <channel-connect
          v-if="dialogObj.type === 'channel'"
          ref="childRef"
          :initChecked="formModel.channelCode"
        ></channel-connect>
        <div class="preview-bow" v-if="dialogObj.type === 'preview'">
          <img
            class="preview-item"
            v-if="dialogObj.fileType === 'image'"
            width="100%"
            :src="dialogObj.imageUrl"
            style="object-fit: contain;"
            alt
          />
          <video
            class="preview-item"
            v-if="dialogObj.fileType === 'video'"
            controls
            :src="dialogObj.videoUrl"
            width="100%"
          >您的浏览器不支持 video 标签。</video>
        </div>
      </c-dialog>
    </div>
  </c-view>
</template>

<script>
import MixinForm from 'mixins/form'
import SShop from './shop'
import ChannelConnect from './add'
import CDialog from 'components/dialog'

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
        shopType: '', // 门店类型
        businessCode: '', // 选择商户
        shopLogo: [], // 门店logo
        shopName: '', // 门店名称
        shopAddress: [], // 门店地址
        address: '', // 详细地址
        coordinate: '', // 门店坐标
        contact: '', // 联系人
        contactTel: '', // 联系手机
        usePos: 0, // 使用pos
        isConnectPrinter: 0, // 是否关联打印机
        printer: '', // 打印机编号
        businessType: 1, // 经营方式 1 自营
        settleType: 1, // 结算方式 1先款后贷
        status: 1, // 状态
        isRecommend: 1, // 是否推荐
        style: '', // 店铺风格
        shopStyle: '', // 店铺风格
        shopImage: [], // 店招图片
        exhibitionImage: [], // 展馆图
        videoUrl: [], // 店铺视频
        businessHours: '', // 营业时间
        shopDescription: '', // 描述
        isVisible: 0, // 是否隐藏门店
        stockCheck: 0, // 支持盘点
        channelCode: [], // 关联渠道
        changeStatus: 0, // 开单调价
        openVipStatus: 0, // 支持代开会员
        canEditOperation:true
      },
      isView: true,
      isDisabled: true,
      btnLoading: false,
      styleList: [], // 风格列表
    }
  },
  created() {
    const { params } = this.$route
    params.id && this.fetchData(params.id)
    this.getStyleList()
  },
  methods: {
     getStyleList() {
      this.$api.channel
        .getShopStyle({
          pageSize: 100,
          pageNo: 1
        })
        .then(res => {
          this.isLoading = false
          if (res && res.totalCount) {
            const { data } = res
            this.styleList = data || []
          } else {
            this.styleList = res || []
          }
        })
    },
    dialogConfirm() {
      if (this.$refs.childRef.selectedList.length > 1) return this.$msgTip('只能选择一条渠道', 'warning')
      this.formModel.channelCode = this.$refs.childRef.selectedList
      this.dialogObj.isShow = false
    },
    showDialog() {
      this.dialogObj = {
        isShow: true,
        type: 'channel',
        title: '关联渠道'
      }
    },
    fetchData(shopId) {
      this.$api.channel.getShopDetail({ shopId }).then(res => {
        if (res) {
          this.setTagsViewTitle()
          let {
            shopLogo,
            printer,
            shopImage,
            exhibitionImage,
            videoUrl,
            channelInfoRespList,
            businessHours,
            provinceCode,
            cityCode,
            areaCode
          } = res

          this.formModel = {
            ...this.formModel,
            ...res,
            canEditOperation: !res.operationCode,
            shopAddress: [provinceCode, cityCode, areaCode], // 门店省市区
            businessHours: businessHours ? businessHours.split('~') : [],
            shopLogo: [{ url: shopLogo, name: '门店LOGO', fileType: 'image', ref: 'shopLogo' }],
            isConnectPrinter: printer ? 1 : 0,
            shopImage: shopImage ? [{ url: shopImage, name: '门招', fileType: 'image', ref: 'shopImage' }] : [],
            exhibitionImage: exhibitionImage ? [{ url: exhibitionImage, name: '展馆图', fileType: 'image', ref: 'exhibitionImage' }] : [],
            videoUrl: videoUrl ? [{ url: videoUrl, name: '门店视频', fileType: 'video', ref: 'videoUrl' }] : [],
            channelCode: channelInfoRespList && channelInfoRespList.length ? channelInfoRespList : []
          }
        } else {
          this.$msgTip('接口数据异常，请稍后重新尝试')
        }
      })
    },
    submitHandle() {
      const shopForm = this.$refs.formRef.$refs.shopFormRef
      const cascaderObj = this.$refs.formRef.$refs.cascaderRef
      const shopAddressText = cascaderObj.inputValue.split('/')
      Promise.all([shopForm].map(this.getFormPromise)).then(res => {
        // 所有子表单是否校验通过
        const validateResult = res.every(item => !!item)
        if (validateResult) {
          const requestMethods = {
            'add': this.$api.channel.addShop,
            'edit': this.$api.channel.editShop
          }
          const {
            shopId, // id
            shopType, // 门店类型
            businessCode, // 商户code
            shopLogo, // 门店
            operationCode, // 运营中心
            shopName, // 门店名称
            shopAddress, // 门店地址
            address, // 详细地址
            coordinate, // 门店坐标
            contact, // 联系人
            contactTel, // 联系手机
            usePos, // 是否使用pos
            isConnectPrinter, // 是否关联打印机
            printer, // 打印机编号
            isRecommend, // 是否推荐
            style, // 门店风格
            shopImage, // 店招
            exhibitionImage, // 展馆图
            videoUrl, // 门店视频
            businessHours, // 营业时间
            shopDescription, // 描述
            isVisible, // 是否隐藏门店
            stockCheck, // 是否支持盘点
            businessType, // 经营方式
            settleType, // 结算方式
            status, // 状态
            channelCode, // 渠道
            changeStatus, // 开单调价
            openVipStatus, // 支持代开会员
            changeType // 开启开单调价后： 调价底线 类型
          } = this.$refs.formRef.formModel
          let params = { // 基础参数
            shopType, // 门店类型
            operationCode, // 运营中心
            businessCode, // 商户code
            shopLogo: shopLogo.length ? shopLogo[0].url : '', // 门店
            shopName, // 门店名称
            address, // 详细地址
            provinceCode: shopAddress[0], // 省
            cityCode: shopAddress[1], // 市
            areaCode: shopAddress[2], // 区
            provinceName:shopAddressText[0],//省中文
            cityName:shopAddressText[1],//市中文
            areaName:shopAddressText[2],//区中文
            coordinate, // 门店坐标
            contact, // 联系人
            contactTel, // 联系手机
            usePos, // 是否使用pos
            businessType, // 经营方式
            settleType, // 结算方式
            status, // 状态
            channelCode: channelCode.length ? channelCode[0].channelCode : '', // 渠道
            changeStatus, // 开单调价
            openVipStatus // 支持代开会员
            // ————————————————加盟商户字段 ——————————————
            // shopImage: shopImage.length ? shopImage[0].url : '', // 店招
            // exhibitionImage: exhibitionImage.length ? exhibitionImage[0].url : '', // 展馆图
            // videoUrl: videoUrl.length ? videoUrl[0].url : '', // 门店视频
            // style, // 门店风格
            // isRecommend, // 是否推荐
            // businessHours: businessHours.length ? businessHours.join('~') : '', // 营业时间
            // shopDescription, // 描述
            // isVisible, // 是否隐藏门店
            // stockCheck // 是否支持盘点
          }
          // 关联打印机
          isConnectPrinter === 1 && Object.assign(params, { printer })
          // 开启开单调价
          changeStatus === 1 && Object.assign(params, { changeType })
          if (shopType === 1) { // 门店为自营类型
            Object.assign(params, {
              shopImage: shopImage.length ? shopImage[0].url : '', // 店招
              exhibitionImage: exhibitionImage.length ? exhibitionImage[0].url : '', // 展馆图
              videoUrl: videoUrl.length ? videoUrl[0].url : '', // 门店视频
              style:this.styleList[style].styleId, // 门店风格
              styleName:this.styleList[style].styleName,//门店风格中文名
              isRecommend, // 是否推荐
              businessHours: businessHours.length ? businessHours.join('~') : '', // 营业时间
              shopDescription, // 描述
              isVisible, // 是否隐藏门店
              stockCheck // 是否支持盘点
            })
          }
          shopId && Object.assign(params, { shopId })
          const reqFun = shopId
            ? requestMethods['edit'] : requestMethods['add']
          reqFun(params).then(() => {
            this.$msgTip('操作成功')
            this.closeCurrentTag()
            this.goBack()
          })
        } else {
          console.log('未校验通过')
        }
      })
    },
    reviewImage(file) {
      this.dialogObj = {
        isShow: true,
        type: 'preview',
        imageUrl: file.url,
        videoUrl: file.url,
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
.preview-bow {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 500px;
  .preview-item {
    width: 100%;
    height: 100%;
  }
}
</style>
