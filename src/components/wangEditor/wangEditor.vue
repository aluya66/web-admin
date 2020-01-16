
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
    this.editor.customConfig = {
      uploadImgMaxSize: 10 * 1024 * 1024, // 默认为5M
      customUploadImg: (files, insert) => {
        let formData = new FormData()
        files.forEach(res => {
          formData.append('files', res)
        })
        this.$api.common.uploadFile(formData).then(res => {
          res && res.map(val => {
            insert(val.url)
          })
        })
      },
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
