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
      :rules="rules"
      label-width="120px"
      class="form"
      label-position="right"
    >
      <g-basic
        :is-view="isView"
        :is-disabled="isDisabled"
        :data-obj="formModel"
        ref="basicRef"
        title="基础信息"
        @show-image="reviewImage"
      ></g-basic>
      <g-params
        :is-view="isView"
        :is-disabled="isDisabled"
        v-if="formModel.id"
        :data-obj="formModel"
        ref="paramsRef"
        title="商品信息"
      ></g-params>
      <g-sales
        :is-view="isView"
        :is-disabled="isDisabled"
        v-if="formModel.id"
        :data-obj="formModel"
        ref="salesRef"
        title="销售信息"
      ></g-sales>
      <g-other
        :is-view="isView"
        :is-disabled="isDisabled"
        v-if="formModel.id"
        :data-obj="formModel"
        ref="otherRef"
        title="其他信息"
      ></g-other>
      <el-form-item class="form-btn" v-if="!isView">
        <el-button :loading="btnLoading" v-permission="$route.meta.roles" type="primary" @click.native.prevent="submitHandle">保存</el-button>
      </el-form-item>
    </el-form>
    <div v-if="dialogObj.isShow">
      <el-dialog :visible.sync="dialogObj.isShow" v-if="dialogObj.imageUrl || dialogObj.videoUrl">
        <img
          width="100%"
          :src="dialogObj.imageUrl"
          v-if="dialogObj.fileType === 1"
          style="object-fit: contain;"
          alt=""
        >
        <video
          controls
          :src="dialogObj.mediaPath"
          width="100%"
          v-if="dialogObj.fileType === 3"
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
import GOther from './other'

export default {
  name: 'goodsDetail',
  mixins: [MixinForm],
  data() {
    return {
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
        this.isDisabled = true
        this.$api.goods.getDetail({ id: params.id }).then(res => {
          this.setTagsViewTitle()
          if (res) {
            this.formModel = res
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
    GParams,
    GOther
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
