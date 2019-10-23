<template>
  <c-card :name="title" class="form-card">
    <el-form-item label="店铺类型:">
      <el-select
        v-if="!isView"
        class="select-item"
        :disabled="isDisabled"
        v-model="formModel.shopType"
        placeholder="请选择店铺类型"
      >
        <el-option
          v-for="item in shopSelect"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <span v-else>{{ formModel.shopType }}</span>
    </el-form-item>
    <el-form-item label="是否推荐:">
      <el-select
        v-if="!isView"
        class="select-item"
        :disabled="isDisabled"
        v-model="formModel.isRecommend"
        placeholder="请选择"
      >
        <el-option
          v-for="item in recommendSelect"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <span v-else>{{ formModel.isRecommend }}</span>
    </el-form-item>
    <el-form-item label="店铺风格:">
      <el-select
        v-if="!isView"
        class="select-item"
        :disabled="isDisabled"
        v-model="formModel.style"
        placeholder="请选择店铺风格"
      >
        <el-option
          v-for="item in shopStyleSelect"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <span v-else>{{ formModel.style }}</span>
    </el-form-item>
    <el-form-item label="门店名称:">
      <el-cascader
        v-if="!isView"
        class="select-item"
        :disabled="isDisabled"
        placeholder="请输入门店名称"
        v-model="formModel.shopName"
      ></el-cascader>
      <span v-else>{{ formModel.shopName }}</span>
    </el-form-item>
    <el-form-item label="LOGO:">
      <c-image
        class="coverImg"
        :url="formModel.shopLogo"
        fit="contain"
        :preview-src-list="[formModel.shopLogo]"
      ></c-image>
    </el-form-item>
    <el-form-item label="店招:">
      <c-image
        class="coverImg"
        :url="formModel.shopImage"
        fit="contain"
        :preview-src-list="[formModel.shopImage]"
      ></c-image>
    </el-form-item>
    <el-form-item label="展览馆:">
      <c-image
        class="coverImg"
        :url="formModel.exhibitionImage"
        fit="contain"
        :preview-src-list="[formModel.exhibitionImage]"
      ></c-image>
    </el-form-item>
    <el-form-item label="店铺视频:">
      <c-upload
        ref="curUpload"
        class="pic"
        :fileList="formModel.fileList"
        is-auto
        :size="20"
        :limit="5"
        :disabled="isView || isDisabled"
        action-path="/auth/uploadFile"
        upload-style="picture-card"
        @upload-success="uploadSuccess"
        @upload-remove="uploadRemove"
        @upload-review="uploadReview"
      >
        <i class="el-icon-plus"></i>
        <div class="info">上传图片/视频应小于20M</div>
      </c-upload>
    </el-form-item>
  </c-card>
</template>

<script>
export default {
  props: {
    title: String,
    dataObj: {
      type: Object,
      required: true
    },
    isView: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'medium'
    },
    isDisabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      shopSelect: [{
        label: '自营',
        value: '1'
      }, {
        label: '加盟',
        value: '2'
      }],
      recommendSelect: [{
        label: '推荐',
        value: '1'
      }, {
        label: '非推荐',
        value: '2'
      }],
      shopStyleSelect: []

    }
  },
  computed: {
    formModel() {
      const { shopType, isRecommend, style, shopName, shopLogo, shopImage, exhibitionImage, videoUrl } = this.dataObj
      // const fileList = goodsStaticFiles && goodsStaticFiles.length ? goodsStaticFiles.map(res => ({
      //   name: res.imageId,
      //   url: res.imageUrl,
      //   videoUrl: res.videoUrl,
      //   fileType: res.fileType
      // })) : []

      return { shopType, isRecommend, style, shopName, shopLogo, shopImage, exhibitionImage, videoUrl }
    }
  },
  mounted: {

  },
  methods: {

    uploadSuccess(response, file, fileList) {
      this.fileList = fileList
    },
    uploadRemove(file, fileList) {
      this.fileList = fileList
    },
    uploadReview(file) {
      this.$emit('show-image', file)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
