<template>
  <c-view>
    <template v-slot:headerTab>
      <el-tabs type="card" v-model="activeName">
        <el-tab-pane
          v-for="(item, index) in tabTitle"
          :key="index"
          :label="item.label"
          :name="item.value"
        ></el-tab-pane>
      </el-tabs>
      <!-- <div class="header-btn">
        <el-button
          type="primary"
          size="medium"
          icon="el-icon-plus"
          @click="routerLink(`/marketing/rule/ruleInfo/${activeName}`)"
        >新增</el-button>
      </div> -->
    </template>
    <div class="main__box">
      <keep-alive>
        <component ref="childList" v-bind:is="activeName"></component>
      </keep-alive>
    </div>
  </c-view>
</template>
<script>
import noperfect from './noperfect'
import perfect from './perfect'

export default {
  name: 'goodsManage',
  components: {
    noperfect,
    perfect
  },
  data(vm) {
    return {
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
  }
}
</script>
