<template>
  <c-view>
    <template v-slot:headerTab>
      <el-tabs type="card" v-model="activeName">
        <el-tab-pane
          v-for="(item, index) in tabTitle"
          :key="index"
          :label="index === 1 ? item.label + '(' + noperfectCount + ')' : item.label"
          :name="item.value"
        ></el-tab-pane>
      </el-tabs>
      <el-button
        v-show="activeName === 'perfect'"
        :size="size"
        type="primary"
        icon="el-icon-download"
        @click="handleGoods"
      >导出</el-button>
      <!-- <div class="header-btn">
        <el-button
          type="primary"
          size="medium"
          icon="el-icon-plus"
          @click="routerLink(`/marketing/rule/ruleInfo/${activeName}`)"
        >新增</el-button>
      </div>-->
    </template>
    <div class="main__box">
      <keep-alive>
        <component ref="childList" v-bind:is="activeName" @update-count="updateCount"></component>
      </keep-alive>
    </div>
    <div v-if="dialogShow">
      <c-dialog
        :is-show="dialogShow"
        title="提示"
        close-btn
        noBtn
        @before-close="dialogShow = false"
      >
        <p>您导出的商品数据量较大，请等待5分钟后，在 <em class="router-link" @click="toExportList">基础服务-导出列表</em> 查看下载！</p>
      </c-dialog>
    </div>
  </c-view>
</template>
<script>
import mixinTable from 'mixins/table'
import noperfect from './noperfect'
import perfect from './perfect'
// import utils from 'utils'
import CDialog from 'components/dialog'
export default {
  name: 'goodsManage',
  components: {
    noperfect,
    perfect,
    CDialog
  },
  mixins: [mixinTable],
  data(vm) {
    return {
      dialogShow: false,
      noperfectCount: 0, // 未完善商品数量
      activeName: 'perfect',
      tagTypeList: [], // 标签类型数据
      tabTitle: [
        {
          value: 'perfect',
          label: '已完善'
        },
        {
          value: 'noperfect',
          label: '未完善'
        }
      ]
    }
  },
  methods: {
    toExportList() {
      this.dialogShow = false
      this.routerLink('/basic/exportList')
    },
    handleGoods() {
      this.$api.goods.exportGoods().then(res => {
        if (res) this.dialogShow = true
      })
    },
    updateCount(val) {
      this.noperfectCount = val
    }
  }
}
</script>

<style lang="less">
  .router-link {
    color: @menuActive;
    cursor: pointer;
  }
</style>
