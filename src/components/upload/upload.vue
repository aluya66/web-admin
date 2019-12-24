<template>
  <el-upload
    class="upload"
    :ref="uploadRef"
    :action="actionPath"
    :headers="headersObj"
    :auto-upload="autoUpload"
    :disabled="disabled"
    :on-change="handleChange"
    :list-type="listType"
    :file-list="uploadList"
    :on-exceed="handleExceed"
    :on-success="handleSuccess"
    :before-upload="beforeUpload"
    :before-remove="beforeRemove"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot></slot>
    <template v-if="!autoUpload && !$slots.default">
      <i slot="trigger" class="el-icon-plus"></i>
      <div slot="tip" class="el-upload__tip">{{tip}}</div>
    </template>
    <template v-if="autoUpload && !$slots.default">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        将文件拖到此处，或
        <em>点击上传</em>
      </div>
      <div class="el-upload__tip" slot="tip">{{tip}}</div>
    </template>
  </el-upload>
</template>

<script>

export default {
  name: 'CUpload',
  // inheritAttrs: false,
  props: {
    uploadRef: {
      type: String,
      default: 'upload'
    },
    listType: {
      type: String,
      default: 'text'
    },
    action: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      default: 1
    },
    limit: {
      type: Number,
      default: 1
    },
    fileList: {
      type: Array,
      default() {
        return []
      }
    },
    headers: {
      type: Object,
      default() {
        return {}
      }
    },
    autoUpload: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    drag: {
      type: Boolean,
      default: false
    },
    tip: {
      type: String,
      default: '* 只能上传jpg/png文件，且不超过5M'
    }
  },
  data() {
    return {
      mutiFiles: [],
      isUpload: false
    }
  },
  computed: {
    actionPath() {
      return `${process.env.VUE_APP_CONSOLE_COMMON}${this.action}`
    },
    uploadList: {
      get() {
        return this.fileList
      },
      set(val) {
        this.$emit('update:upload-list', val)
      }
    },
    headersObj() {
      const { token } = this.$store.getters.userInfo
      return {
        token,
        ...this.headers
      }
    }
  },
  mounted() {
    if (this.disabled) {
      const curUplist = document.getElementsByClassName('el-upload')
      console.log(curUplist)
      for (let i = 0; i < curUplist.length; i++) {
        curUplist[i].style.display = 'none'
      }
    }
  },
  methods: {
    customUpload(fileObj) {
      if (this.isUpload) { // 只调用一次上传
        return
      }
      const { uid } = fileObj.file
      const hasFile = this.limit > 1 ? this.mutiFiles.getAll('files').find(res => res.uid === uid) : true
      if (hasFile) {
        this.isUpload = true
        this.limit === 1 && this.$refs[this.uploadRef].clearFiles() // 清空未上传的文件列表
        this.$api.common.uploadFile(this.mutiFiles).then(res => {
          if (res) {
            let fileList = res ? res.map(res => ({
              name: fileObj.file.name,
              id: res.id,
              url: res.url
            })) : []
            if (this.fileList.length) {
              fileList = this.fileList.concat(fileList)
            }
            this.$emit('update:file-list', fileList)
            this.$emit('on-success', '', fileObj.file, fileList)
          }
        })
      }
    },
    handleChange(file, fileList) {
      this.isUpload = false
      let formData = new FormData()
      if (!this.autoUpload) {
        fileList.forEach(res => {
          if (res.raw) {
            formData.append('files', res.raw)
          }
        })
      } else {
        formData.append('files', file.raw)
      }
      this.mutiFiles = formData
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 ${this.limit} 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      )
      this.$emit('on-exceed', files, fileList)
    },
    handleSuccess(response, file, fileList) {
      if (response.code === 0) {
        let curFileList = fileList
        if (this.fileType !== 'excel') {
          curFileList = fileList.map(res => ({
            url: /.mp4$/g.test(res.name) || /.mp4$/g.test(res.mediaPath) ? `${this.$staticFile}/images/default-video.png` : res.response ? `${this.$filePath}${res.response.data}` : res.url,
            uid: res.uid,
            status: res.status,
            mediaPath: /.mp4$/g.test(res.name)
              ? `${this.$filePath}${res.response.data}`
              : /.mp4$/g.test(res.mediaPath)
                ? res.mediaPath
                : ''
          }))
        }
        this.$emit('update:file-list', curFileList)
        this.$emit('on-success', response, file, curFileList)
        this.uploadList = curFileList
      } else {
        fileList.splice(fileList.length - 1, 1)
        this.$emit('update:file-list', fileList)
        this.$emit('on-success', response, file, fileList)
        this.$msgTip(`${response.code}【${response.message}】`, 'warning')
      }
    },
    beforeRemove(file, fileList) {
      if (this.fileType !== 'excel') {
        if (/\.(png|jpeg|jpg|gif)$/.test(file.url)) {
          return this.$confirm(
            `确定移除 ${file.name} 文件`,
            '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              center: true
            }
          ).then(() => {
            this.$emit('before-remove')
            this.$emit('update:file-list', fileList)
          })
        }
        this.$emit('update:file-list', fileList)
        this.$emit('before-remove', file, fileList)
      }
    },
    beforeUpload(file) {
      if (this.limit <= this.fileList.length) {
        this.$message.warning(`当前限制只能上传 ${this.limit} 个文件`)
        return false
      }
      if (this.fileType === 'excel') {
        const isXlxs = /\.(xlsx|xls)$/.test(file.name)
        if (isXlxs) {
          return this.showTip(file)
        } else {
          this.$message.error('请上传后缀为.xlsx,.xls格式文件!')
        }
      } else if (this.fileType === 'video') {
        const isJPG = /\.(mp4)$/.test(file.name)
        if (isJPG) {
          return this.showTip(file)
        } else {
          this.$message.error('请上传后缀为mp4格式的文件!')
        }
      } else {
        const isJPG = /\.(png|jpeg|jpg|gif)$/.test(file.name)
        if (isJPG) {
          return this.showTip(file)
        } else {
          this.$message.error('请上传后缀为png,jpg,jpeg,gif格式的文件!')
        }
      }
      this.$emit('before-upload')
      return false
    },
    // 上传提醒
    showTip(file) {
      const isLimit = file.size / 1024 / 1024 < this.size
      if (!isLimit) {
        this.$message.error(`上传文件大小不能超过 ${this.size}MB!`)
        return false
      }
      return isLimit
    },
    // 手动上传事件
    submitUpload() {
      this.$refs[this.uploadRef].submit()
    }
  }
}
</script>
