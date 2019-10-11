<template>
  <c-view>
    <template v-slot:header>
      <div class="title">{{setTitleLang($route.meta.title, 'route') }}</div>
    </template>
    <div class="box">欢迎登录使用{{ title }}！</div>
  </c-view>
</template>

<script>

export default {
  name: 'Dashboard',
  data() {
    return {
      title: process.env.VUE_APP_COMPANY
    }
  },
  components: {
  }
}
</script>

<style lang="less" scoped>
.title {
  font-size: @f18;
  margin-right: 10px;
}
</style>
