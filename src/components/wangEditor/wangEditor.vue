
<template>
  <div :class="bem()" :ref="editorRef"></div>
</template>

<script>
import create from 'utils/create/basic'
import E from 'wangeditor'

export default create({
  name: 'wangEditor',
  props: {
    editorRef: {
      type: String,
      default: 'wangeditor'
    },
    isView: {
      type: Boolean,
      default: false
    },
    content: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      editor: null
    }
  },
  mounted() {
    // 初始化编辑器
    this.editor = new E(this.$refs[this.editorRef])
    // 编辑富文本内容时
    // this.editor.customConfig.uploadImgShowBase64 = true // 使用 base64 保存图片
    this.editor.customConfig = {
      uploadImgShowBase64: true,
      // uploadImgServer: 'http://pillar-admin.yosar.develop/api/upload/file', // 配置服务器端地址
      uploadImgMaxSize: 2 * 1024 * 1024, // 将图片大小限制为 2M
      // uploadImgParams: {
      //   token
      // }
      onchange: html => {
        console.log('editor=', html)
        this.$emit('update:content', html)
      }
    }
    // 创建富文本实例
    this.editor.create()
    // 是否禁用编辑内容
    this.editor.$textElem.attr('contenteditable', !this.isView)
    // 初始化富文本内容
    this.editor.txt.html(this.content)
  }
})
</script>

<style lang='less'>
.w-e-text-container {
  height: 500px !important;
}
</style>
