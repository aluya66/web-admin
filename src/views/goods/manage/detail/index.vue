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
    <div class="detail-form">
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
      <div class="btn-wrapper" v-if="formModel.id">
        <el-button
          v-if="formModel.detailsType === '部分完善' || formModel.detailsType === '未完善'"
          :loading="btnLoading"
          type="primary"
          :size="size"
          @click.native.prevent="submitHandle('partFinish')"
        >部分完善</el-button>
        <el-button
          :loading="btnLoading"
          type="primary"
          :size="size"
          @click.native.prevent="submitHandle(formModel.detailsType === '已完善' || formModel.detailsType === '完善' ? 'edit' : 'confirmFinish')"
        >{{ formModel.detailsType === '已完善' || formModel.detailsType === '完善' ? '保存' : '确认完成' }}</el-button>
        <el-button :size="size" @click.native.prevent="goBack">取消</el-button>
      </div>
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
      btnLoading: false
    }
  },

  created() {
    this.fetchData()
    window.addEventListener('scroll', this.handleScroll)
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll() {
      const top = document.documentElement.scrollTop
      if (top >= 0 && top < 900) {
        this.currentPoint = 0
      } else if (top >= 900 && top < 2500) {
        this.currentPoint = 1
      } else {
        this.currentPoint = 2
      }
    },
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
        this.isDisabled = params.type === 'view'
        this.$api.goods.getDetail({ id: params.id }).then(res => {
          this.setTagsViewTitle()
          if (res) {
            let videoList = []; let goodsImageList = []
            res.goodsStaticFiles.forEach(item => {
              // 1.图片  2.视频
              if (item.imageUrl) {
                goodsImageList.push({ url: item.imageUrl })
              }
              if (item.videoUrl) {
                videoList.push({ url: item.videoUrl })
              }
            }) // 图片、视频资源
            res.operationName = res.operationName ? res.operationName : res.goodsName // 默认首次同步样衣时，将运营名称设置为商品名称
            this.formModel = { ...res, goodsImageList, videoList }
          } else {
            this.$msgTip('接口数据异常，请稍后重新尝试', 'warning')
          }
        })
      }
    },
    handleData(type) {
      const requestFun = {
        'edit': this.$api.goods.editGoods,
        'partFinish': this.$api.goods.setPartPerfectGoods,
        'confirmFinish': this.$api.goods.setPerfectGoods
      }
      const { id } = this.formModel
      const { operationName, marketable } = this.$refs.basicRef.formModel
      const { mustQuantity } = this.$refs.salesRef.formModel
      const { childProductArray, specification } = this.$refs.salesRef.$refs.skuWrapRef
      if (childProductArray.length > 0) {
        const arr = [{
          value: 'costPrice',
          tip: '成衣成本价'
        }, {
          value: 'supplyPrice',
          tip: '成衣供货价'
        }, {
          value: 'memberPrice',
          tip: '成衣会员价'
        }, {
          value: 'largeBatchPrice',
          tip: '成衣大批价'
        }, {
          value: 'wholesalePrice',
          tip: '成衣散批价'
        }, {
          value: 'retailPrice',
          tip: '零售价'
        }]
        for (let i = 0, len = childProductArray.length; i < len; i++) {
          for (let j = 0, len = arr.length; j < len; j++) {
            if (childProductArray[i][arr[j].value] === '' || !Number(childProductArray[i][arr[j].value]) || childProductArray[i][arr[j].value] < 0) return this.$msgTip(`sku${arr[j].tip}不能为空，请填写大于0的数字`, 'warning')
          }
        }
      }
      const { videoList, goodsImageList, intro } = this.$refs.paramsRef.formModel
      const goodsStaticFiles = goodsImageList.map((item, index) => ({ imageUrl: item.url, isDefault: index === 0 ? 1 : 0 }))
      if (videoList.length) goodsStaticFiles.push({ videoUrl: videoList[0].url })
      const skus = childProductArray && childProductArray.length ? childProductArray.map((item, index) => {
        let imgIndex = specification[0].value.length && specification[0].value.findIndex((colorItem) => colorItem === item.childProductSpec['颜色'])
        return {
          imageUrl: imgIndex !== -1 ? specification[0].posterUrl[imgIndex] : '', // 图片
          goodsSkuSn: item.goodsSkuSn, // 商品SKU码
          memberPrice: item.memberPrice, // 会员价
          retailPrice: item.retailPrice, // 零售价
          costPrice: item.costPrice, // 成本价
          supplyPrice: item.supplyPrice, // 供货价
          wholesalePrice: item.wholesalePrice, // 散批价
          largeBatchPrice: item.largeBatchPrice, // 大批发价
          isDefalut: item.isDefalut ? 1 : 0 // 是否默认
        }
      }) : []
      if (skus.some((item) => !item.imageUrl)) return this.$msgTip('sku图片不能为空', 'warning') // 判断sku是否都有图片
      // if (type === 'confirmFinish') { // 确认完成需要信息填写完整
      //   if (!operationName) return this.$msgTip('请填写运营名称', 'warning')
      //   if (videoList.length === 0) return this.$msgTip('请填写商品视频', 'warning')
      //   if (!intro) return this.$msgTip('请填写商品详情', 'warning')
      // }
      requestFun[type]({
        id, // 商品Id
        operationName, // 运营名称
        marketable, // 是否可售
        mustQuantity, // 起订量
        goodsStaticFiles, // 商品资源文件集合 【视频、商品图片】
        intro, // 富文本
        skus // sku列表
      }).then(() => {
        this.$msgTip('编辑成功')
        this.closeCurrentTag()
        this.goBack()
      })
    },
    submitHandle(type = '') {
      // 确认完成按钮，需要做必填项校验
      const salesForm = this.$refs.salesRef.$refs.salesFormRef
      const paramsForm = this.$refs.paramsRef.$refs.paramsFormRef
      Promise.all([salesForm, paramsForm].map(this.getFormPromise)).then(res => {
        // 所有子表单是否校验通过
        const validateResult = res.every(item => !!item)
        if (validateResult) {
          this.handleData(type)
        } else {
          console.log('未校验通过')
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
  margin: 20px 0 15px 140px;
}
.video {
  max-height: 500px;
}
</style>
