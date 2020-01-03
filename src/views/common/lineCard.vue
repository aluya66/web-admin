<template>
  <div v-if="!hidden" v-bind="$attrs" v-on="$listeners">
    <el-divider content-position="left">{{title}}</el-divider>
    <div class="line-card">
      <slot></slot>
    </div>
  </div>
</template>

<script>

export default {
  name: 'lineCard',
  inheritAttrs: false,
  props: {
    hidden: Boolean,
    title: String
  }
}
</script>

<style lang='less' scoped>
.line-card {
  padding: 10px 80px;
  .row {
    display: flex;
    flex-wrap: wrap;
    span {
      display: inline-block;
      margin: 10px 20px 10px 0;
      min-width: 220px;
    }
  }
}
</style>
