<template>
  <c-view>
    <template v-slot:header>
      <el-page-header
        @back="goBack"
        :content="$route.meta.name || $t(`route.${$route.meta.title}`)"
      ></el-page-header>
    </template>
    <div class="point-wrapper">
      <div
        class="point-item"
        v-for="(item, index) in stepList"
        :key="index"
        v-point="item.id"
        :class="{'current-point': currentPoint === index}"
        @click="selectPoint(index)"
      >
        <div class="point-box">
          <div class="circle">{{index + 1}}</div>
          <div class="line" v-show="index !== stepList.length-1"></div>
        </div>
        <div class="point-name">{{item.name}}</div>
      </div>
    </div>
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
    <div class="btn-wrapper">
      <el-button :loading="btnLoading" type="primary" @click.native.prevent="submitHandle">部分完善</el-button>
      <el-button
        :loading="btnLoading"
        type="primary"
        @click.native.prevent="submitHandle('confirmFinish')"
      >确认完成</el-button>
    </div>
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
  data(vm) {
    return {
      currentPoint: 0, // 媌点下标
      stepList: [{
        name: '基础信息',
        id: '#form-base'
      }, {
        name: '销售信息',
        id: '#form-sales'
      }, {
        name: '商品信息',
        id: '#form-params'
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
    }
  },

  created() {
    this.fetchData()
  },

  methods: {
    selectPoint(index) {
      this.currentPoint = index
    },
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
        this.isDisabled = params.type === 'view' ? true : false
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
    handleData() {
      const { goodsBn } = this.formModel
      const { operationName, marketable } = this.$refs.basicRef.formModel
      const { mustQuantity, sampleCostPrice, costPrice, supplyPrice, wholesalePrice, largeBatchPrice, memberPrice, retailPrice, goodsSkus } = this.$refs.salesRef.formModel
      const { videoList, goodsImageList, intro } = this.$refs.paramsRef.formModel
      const goodsStaticFiles = goodsImageList.map((item) => { return { imageUrl: item.url } })
      if (videoList.length) goodsStaticFiles.push(videoList.map((item) => { return { videoUrl: item.url } }))
      const skuList = goodsSkus && goodsSkus.length ? goodsSkus.map((item) => {
        return {
          goodsSkuSn: item.goodsSkuSn, // 商品SKU码
          garmentRetailPrice: item.memberPrice, // 会员价
          garmentMarketPrice: item.retailPrice, // 零售价
          garmentCostPrice: item.costPrice, // 成衣成本价
          sampleCostPrice: item.sampleCostPrice, // 样衣成本价
          garmentSupplyPrice: item.supplyPrice, // 供货价
          garmentWholesalePrice: item.wholesalePrice, // 散批价
          garmentLargePrice: item.largeBatchPrice, // 大批发价
          isDefalut: item.isDefalut // 是否默认货品
        }
      }) : []
      this.$api.goods.updateGoodsDetail({
        goodsBn, // 商品编码SPU码
        operationName, // 运营名称
        marketable, // 是否可售
        mustQuantity, // 起订量
        minGarmentCostPrice: sampleCostPrice, // 成衣成本价
        costprice: costPrice, // 样衣成本价
        minGarmentSupplyPrice: supplyPrice, // 供货价,
        minGarmentWholesalePrice: wholesalePrice, // 散批价
        minGarmentLargePrice: largeBatchPrice, // 大批价
        minGarmentRetailPrice: retailPrice, // 零售价
        goodsStaticFiles, // 商品资源文件集合 【视频、商品图片】
        intro, // 富文本
        price: memberPrice, // 会员价
        goodsSkus: skuList // sku列表
      }).then(() => {
        this.$msgTip('编辑成功')
        this.closeCurrentTag()
      })
    },
    submitHandle(type = '') {
      // 确认完成按钮，需要做必填项校验
      if (type === 'confirmFinish') {
        const salesForm = this.$refs.salesRef.$refs.salesFormRef
        const paramsForm = this.$refs.paramsRef.$refs.paramsFormRef
        Promise.all([salesForm, paramsForm].map(this.getFormPromise)).then(res => {
          // 所有子表单是否校验通过
          const validateResult = res.every(item => !!item);
          if (validateResult) {
            this.handleData()
          } else {
            console.log('未校验通过')
          }
        })
      } else {
        this.handleData()  
      }
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
  z-index: 1001 !important;
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
  .point-item {
    display: flex;
    font-size: @f16;
    color: @info;
    &.current-point {
      color: @active;
      .point-box {
        .circle {
          border: 1px solid @active;
        }
      }
    }
    .point-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-right: 15px;
      .circle {
        width: 25px;
        height: 25px;
        text-align: center;
        line-height: 25px;
        border-radius: 50%;
        border: 1px solid @border-default;
        background-color: #fff;
      }
      .line {
        width: 3px;
        height: 30px;
        background-color: @border-default;
      }
    }
    .point-name {
      line-height: 25px;
    }
  }
}
.btn-wrapper {
  display: flex;
  justify-content: center;
}
.video {
  max-height: 500px;
}
</style>
