<template>
  <p class="dialog-text">
    您导出的数据量较大，请等待5分钟后，在
    <em class="router-link" @click="toExportList">基础服务-导出列表</em> 查看下载！
  </p>
</template>
<script>
export default {
  name: 'exportTip',
  date() {
    return {
      isShow: false
    }
  },
  methods: {
    toExportList() {
      this.dialogShow = false
      this.routerLink('/basic/exportList')
      this.$emit('handle')
    }
  }
}
</script>
<style lang="less">
.dialog-text {
  padding-bottom: 10px;
  text-align: center;
  .router-link {
    color: @menuActive;
    cursor: pointer;
  }
}
</style>
