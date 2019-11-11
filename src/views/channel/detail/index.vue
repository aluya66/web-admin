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
        :data-obj="formModel"
        ref="basicRef"
        title="商铺信息"
        @show-image="reviewImage"
      ></s-shop>
      <s-people
        :is-view="isView"
        :is-disabled="isDisabled"
        v-if="formModel"
        :data-obj="formModel"
        ref="paramsRef"
        title="其他信息"
      ></s-people>
      <el-form-item class="form-btn" v-if="!isView">
        <el-button :loading="btnLoading" type="primary" @click.native.prevent="submitHandle">保存</el-button>
      </el-form-item>
    </el-form>
  </c-view>
</template>

<script>
import SShop from './shop'
import SPeople from './people'

export default {
  name: 'shopDetail',
  components: {
    SShop,
    SPeople
  },
  data () {
    return {
      formModel: {},
      isView: true,
      isDisabled: true,
      btnLoading: false
    }
  },
  created () {
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
    },
    goBack() {
      this.$router.go(-1)
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
