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
      <div class="header-btn">
        <el-button
          type="primary"
          size="medium"
          icon="el-icon-plus"
          @click="routerLink(`/marketing/rule/ruleInfo/${activeName}`)"
        >新增</el-button>
      </div>
    </template>
    <div class="main__box">
      <keep-alive>
        <component ref="childList" v-bind:is="activeName + 'List'"></component>
      </keep-alive>
    </div>
  </c-view>
</template>
<script>
import CDialog from 'components/dialog'
import YsgoList from './ysgoList'
import YsspList from './ysspList'

export default {
  name: 'ruleList',
  components: {
    CDialog,
    YsgoList,
    YsspList
  },
  data(vm) {
    return {
      activeName: 'yssp',
      tagTypeList: [], // 标签类型数据
      tabTitle: [
        {
          value: 'yssp',
          label: 'YOSHOP'
        },
        {
          value: 'ysgo',
          label: '星GO'
        }
      ]
    }
  }
}
</script>
