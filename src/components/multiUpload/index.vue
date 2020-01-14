<template>
  <div :class="bem()">
    <div class="header">
      <el-tabs type="card" v-model="activeName">
        <el-tab-pane
          v-for="(item, index) in tabTitle"
          :key="index"
          :label="item.label"
          :name="item.value"
        ></el-tab-pane>
      </el-tabs>
       <el-button v-if="activeName === 'multiSelect'" :disabled="disabled" type="primary" size="small" @click="uploadImage">上传</el-button>
    </div>
    <keep-alive>
      <component ref="childRef"  v-on="$listeners" v-bind="$props" v-bind:is="activeName" :files="initFileList" @get-files="getFiles"></component>
    </keep-alive>
  </div>
</template>

<script>
import create from 'utils/create'
import MultiSelect from './multiSelect'
import OnLineImage from './onLineImage'

export default create({
  name: 'multiUpload',
  props: {
    tip: {
      type: String,
      default: ''
    },
    fileType: {
      type: String,
      default: 'image'
    },
    limit: {
      type: Number,
      default: 9
    }
  },
  data() {
    return {
      tabTitle: [
        {
          value: 'multiSelect',
          label: '本地图片'
        }
        // {
        //   value: 'onLineImage',
        //   label: '在线图库'
        // }
      ],
      activeName: 'multiSelect',
      initFileList: [],
      disabled: false
    }
  },

  methods: {
    getFiles(fileList, status) {
      this.initFileList = fileList
      this.disabled = status
      this.$emit('upload', fileList)
    },
    uploadImage() {
      this.$refs.childRef.submitUpload()
    },
    submitHandle() {
      if (this.activeName === 'multiSelect') {
        return this.$refs.childRef.fileList
      } else {

      }
    }
  },

  components: {
    MultiSelect,
    OnLineImage
  }
})
</script>

<style lang="less" scoped>
.c-multiUpload {
  .header {
    position: relative;
    .el-tabs {
      width: 100%;
    }
    .el-button {
      position: absolute;
      top: 0px;
      right: 40px;
    }
  }
}
</style>
