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
      label-width="100px"
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
import SShop from './detail/shop'
import SPeople from './detail/people'

export default {
  components: {
    SShop,
    SPeople
  },
  data () {
    return {
      formModel: {},
      isView: false,
      isDisabled: true,
      btnLoading: false
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData() {

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
    },
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang='less' scope>
.form {
  background-color: @white;
  padding: 15px 15px;
  .form-btn {
    margin-left: 20px;
    margin-top: 20px;
  }
}
</style>
