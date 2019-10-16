<template>
  <el-image :class="bem()" :src="url" v-bind="$attrs" v-on="$listeners">
    <div slot="placeholder" class="image-slot">
      加载中
      <span class="dot">...</span>
    </div>
    <div slot="error" class="image-slot">
      <i class="el-icon-picture-outline icon-size"></i>
    </div>
  </el-image>
</template>

<script>
import create from 'utils/create'
// import { Image } from 'element-ui'

export default create({
  name: 'image',
  inheritAttrs: false,
  components: {
    // Image
  },
  props: {
    url: {
      type: String,
      default: ''
    }
  }
})
</script>

<style lang="less">
.c-image {
  display: flex;
  width: 80px;
  height: 80px;
  img {
    justify-items: center;
    align-items: center;
  }
  .image-slot {
    text-align: center;
    width: 100%;
    line-height: 80px;
    .icon-size {
      font-size: @f28;
    }
  }
}
</style>
