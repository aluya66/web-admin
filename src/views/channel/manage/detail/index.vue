<template>
  <c-view>
    <template v-slot:header>
      <el-page-header
        @back="goBack"
        :content="$route.meta.name || $t(`route.${$route.meta.title}`)"
      ></el-page-header>
    </template>
    <div class="main__box">
      
    </div>
  </c-view>
</template>

<script>
import MixinForm from 'mixins/form'
export default {
  name: 'channelDetail',
  mixins: [MixinForm],
  data(vm) {
    return {
      searchObj: {

      },
      dialogObj: {} // 对话框数据
    }
  },
  created() {
    
  },

  methods: {
    
  }
}
</script>

<style lang='less' scoped>
.main__box {
  .search {
    margin-bottom: 10px;
    width: 100%;
    .search-item {
      width: 250px;
    }
  }
}
</style>
