<template>
  <c-upload
    class="multi-upload"
    ref="upload"
    multiple
    :tip="tip"
    :size="size"
    :limit="limit"
    :file-type="fileType"
    :auto-upload="false"
    action="/api/upload/file"
    list-type="picture-card"
    :http-request="uploadHandle"
    :file-list.sync="fileList"
    :on-remove="handleRemove"
    @on-success="handleSuccess"
  ></c-upload>
</template>

<script>
import create from 'utils/create'
import CUpload from '../upload'

export default create({
  name: 'multiUpload',
  props: {
    fileType: {
      type: String,
      default: 'image'
    },
    tip: {
      type: String,
      default: ''
    },
    size: {
      type: Number,
      default: 5
    },
    limit: {
      type: Number,
      default: 9
    },
    files: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      fileList: []
    }
  },

  methods: {
    handleSuccess(res, file, fileList) {
      this.$emit('get-files', fileList, true)
    },
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    uploadHandle(file) {
      this.$refs.upload.customUpload(file)
    },
    submitUpload() {
      this.$refs.upload.submitUpload()
    }
  },

  components: {
    CUpload
  }
})
</script>

<style lang="less">
.multi-upload {
  margin: 10px 40px;
}
</style>
