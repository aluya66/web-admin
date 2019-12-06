<template>
  <c-view>
    <template v-slot:header>
      <el-page-header
        @back="goBack"
        :content="$route.meta.name || $t(`route.${$route.meta.title}`)"
      ></el-page-header>
    </template>
    <div class="point-wrapper">
      <el-steps direction="vertical">
        <el-step
          v-for="(item, index) in stepList"
          :key="index"
          :title="item.name"
          v-point="item.id"
        ></el-step>
      </el-steps>
    </div>
    <el-form
      ref="formRef"
      :model="formModel"
      :rules="rules"
      label-width="120px"
      class="form"
      label-position="right"
    >
      <g-basic
        :is-view="isView"
        :is-disabled="isDisabled"
        :data-obj="formModel"
        v-if="formModel.id"
        ref="basicRef"
        title="基础信息"
        @show-image="reviewImage"
      ></g-basic>
      <g-sales
        :is-view="isView"
        :is-disabled="isDisabled"
        v-if="formModel.id"
        :data-obj="formModel"
        ref="salesRef"
        title="销售信息"
      ></g-sales>
      <g-params
        :is-view="isView"
        :is-disabled="isDisabled"
        v-if="formModel.id"
        :data-obj="formModel"
        @show-image="reviewImage"
        ref="paramsRef"
        title="商品信息"
      ></g-params>
      <!-- <g-other
        :is-view="isView"
        :is-disabled="isDisabled"
        v-if="formModel.id"
        :data-obj="formModel"
        ref="otherRef"
        title="其他信息"
      ></g-other>-->
      <el-form-item class="form-btn" v-if="!isView">
        <el-button
          :loading="btnLoading"
          v-permission="$route.meta.roles"
          type="primary"
          @click.native.prevent="submitHandle"
        >保存</el-button>
      </el-form-item>
    </el-form>
    <div v-if="dialogObj.isShow">
      <el-dialog :visible.sync="dialogObj.isShow" v-if="dialogObj.imageUrl || dialogObj.videoUrl">
        <img
          width="100%"
          :src="dialogObj.imageUrl"
          v-if="dialogObj.fileType === 1"
          style="object-fit: contain;"
          alt
        />
        <video
          class="video"
          controls
          :src="dialogObj.videoUrl"
          width="100%"
          v-if="dialogObj.fileType === 2"
        >您的浏览器不支持 video 标签。</video>
      </el-dialog>
    </div>
  </c-view>
</template>

<script>
import MixinForm from 'mixins/form'
import GBasic from './basic'
import GSales from './sales'
import GParams from './params'

export default {
  name: 'goodsDetail',
  mixins: [MixinForm],
  data() {
    return {
      currentStep: 1, // 媌点下标
      stepList: [{
        name: '基础信息',
        id: '#form-base'
      }, {
        name: '商品信息',
        id: '#form-params'
      }, {
        name: '销售信息',
        id: '#form-sales'
      }],
      formModel: {},
      isView: false,
      dialogObj: {
        isShow: false,
        type: 1,
        curData: {}
      },
      isDisabled: true,
      btnLoading: false,
      rules: {
        goodsName: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ]
      }
    }
  },

  created() {
    this.fetchData()
  },

  methods: {
    fetchData() {
      const { params, name } = this.$route
      if (name === 'goodsSnapshootDetail') { // 快照详情数据
        this.isView = true
        this.$api.goods.getSnapshotDetail({ id: params.id }).then(res => {
          this.setTagsViewTitle()
          if (res) {
            const { goodsSnapshot, goodsSkuSn, ...other } = res
            const curoGodsSnapshot = goodsSnapshot ? JSON.parse(goodsSnapshot) : {}
            this.formModel = {
              ...other,
              ...curoGodsSnapshot
            }
          } else {
            this.$msgTip('接口数据异常，请稍后重新尝试', 'warning')
          }
        })
      } else {
        this.isDisabled = false
        // this.formModel = {
        //   brandId: 38,
        //   brandName: 'Mika Mika',
        //   businessValue: '自营',
        //   buyCount: 0,
        //   categoryCode: '052500',
        //   categoryName: '牛仔外套',
        //   commentsCount: 0,
        //   commodityType: 2,
        //   costprice: 12960,
        //   coverImg: 'https://starimg.yosar.com/19/138/7c5d0285fc029866cd86e22d3b5d1042.JPG',
        //   created: '2019-11-28 03:36:06',
        //   downtime: '2019-11-28 11:36:06',
        //   goodsAttrs: [],
        //   goodsBn: '1K1BK31CY0006',
        //   goodsBrief: '',
        //   goodsName: '洗水毛边牛仔外套',
        //   goodsShortName: '洗水毛边牛仔外套',
        //   goodsStaticFiles: [
        //     {
        //       fileType: 1,
        //       imageUrl: 'https://starimg.yosar.com/19/138/7c5d0285fc029866cd86e22d3b5d1042.JPG'
        //     },
        //     {
        //       fileType: 2,
        //       videoUrl: 'https://starimg.yosar.com/19/138/7c5d0285fc029866cd86e22d3b5d1042.JPG'
        //     }
        //   ],
        //   id: 1792,
        //   intro: "<p><img src='https://starimg.yosar.com/19/220/e655111c6a5656161becce099521cddd.jpg'/></p>",
        //   isHot: 2,
        //   isNew: 2,
        //   isNomalVirtual: 1,
        //   isReadable: 1,
        //   isRecommend: 2,
        //   largePrice: 15800,
        //   marketable: 1,
        //   mktprice: 0,
        //   mustQuantity: 0,
        //   place: '420104',
        //   price: 31800,
        //   purchUrl: '',
        //   saleYear: '2019',
        //   salesTotal: 0,
        //   sampleCostprice: 130,
        //   season: 3,
        //   skus: [{ goodsBn: '1K1BK31CY0006', goodsId: 1792, goodsSkuSn: '1K1BK31CY0006-1', commodityType: 2 }],
        //   sort: 100,
        //   stargoGoodsId: 886,
        //   stock: 0,
        //   supplyprice: 12960,
        //   tagprice: 62800,
        //   unit: '',
        //   updated: '2019-11-28 11:36:06',
        //   uptime: '2019-11-28 11:36:06',
        //   videoUrl: '',
        //   viewCount: 0,
        //   weight: 0,
        //   weightUnit: '',
        //   wholesaleprice: 16800
        // }
        // let videoList = []; let goodsImageList = []
        // this.formModel.goodsStaticFiles.forEach(item => {
        //   // 1.图片  2.视频
        //   if (item.fileType === 1) {
        //     goodsImageList.push({ url: item.imageUrl })
        //   } else {
        //     videoList.push({ url: item.videoUrl })
        //   }
        // }) // 图片、视频资源
        // this.formModel = { ...this.formModel, goodsImageList, videoList }
        this.$api.goods.getDetail({ id: params.id }).then(res => {
          this.setTagsViewTitle()
          if (res) {
            let videoList = []; let goodsImageList = []
            res.goodsStaticFiles.forEach(item => {
              // 1.图片  2.视频
              if (item.fileType === 1) {
                goodsImageList.push(item.imageUrl)
              } else {
                videoList.push(item.videoUrl)
              }
            }) // 图片、视频资源
            this.formModel = { ...res, goodsImageList, videoList }
          } else {
            this.$msgTip('接口数据异常，请稍后重新尝试', 'warning')
          }
        })
      }
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
        type: 1,
        imageUrl: file.url,
        videoUrl: file.videoUrl,
        fileType: file.fileType
      }
    }
  },

  components: {
    GBasic,
    GSales,
    GParams
  }
}
</script>
<style lang="less">
.w-e-menu {
  z-index: 1001!important;
}
.w-e-text-container {
  z-index: 1001 !important;
}
</style>
<style lang='less' scoped>
.form {
  background-color: @white;
  padding: 15px 15px;
  .form-btn {
    margin-left: 20px;
    margin-top: 20px;
  }
}
.point-wrapper {
  position: fixed;
  right: 50px;
  top: 200px;
  z-index: 1005;
  height: 300px;
  cursor: pointer;
}
.video {
  max-height: 500px;
}
</style>
