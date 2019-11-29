<template>
  <div :class="bem()">
    <el-tabs type="card" v-model="activeName">
      <el-tab-pane
        v-for="(item, index) in tabTitle"
        :key="index"
        :label="item.label"
        :name="item.value"
      ></el-tab-pane>
    </el-tabs>
    <keep-alive>
      <component ref="childList" v-bind:is="activeName"></component>
    </keep-alive>
  </div>
</template>

<script>
import create from 'utils/create'

export default create({
  name: 'multiUpload',
  data() {
    return {
      tabTitle: [
        {
          value: 'online',
          label: '本地图片'
        },
        {
          value: 'offline',
          label: '在线图库'
        }
      ],
      activeName: 'online'
    }
  },

  methods: {

  },

  components: {

  }
})
</script>

<style lang='less'>
</style>
