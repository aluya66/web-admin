<template>
	<el-upload
		class="upload"
		:drag="isDrag"
		ref="upload"
		:list-type="uploadStyle"
		:file-list="uploadList"
		:headers="headers"
		:data="uploadData"
		:limit="limit"
		:disabled="disabled"
		:on-exceed="handleExceed"
		:action="actionApi"
		:on-preview="handleReview"
		:on-remove="handleRemove"
		:on-success="handleSuccess"
		:on-change="handleChange"
		:auto-upload="isAuto"
		:before-upload="beforeUpload"
		:before-remove="beforeRemove"
		multiple
	>
		<slot></slot>
		<template v-if="!$slots.default">
			<i class="el-icon-upload"></i>
			<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
			<div class="el-upload__tip" slot="tip">
				只能上传excel格式文件，且不超过2M
			</div>
		</template>
	</el-upload>
</template>

<script>
export default {
  name: 'c-upload',
  props: {
    actionPath: {
      type: String,
      default: '/auth/importRegion'
    },
    isDrag: {
      type: Boolean,
      default: false
    },
    uploadStyle: {
      type: String,
      default: 'text'
    },
    size: {
      type: Number,
      default: 2
    },
    isAuto: {
      type: Boolean,
      default: false
    },
    limit: {
      type: Number,
      default: 1
    },
    uploadData: {
      type: Object,
      default () {
        return {}
      }
    },
    fileType: {
      type: String,
      default: ''
    },
    fileList: {
      type: Array,
      default () {
        return []
      }
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    actionApi () {
      return `${process.env.VUE_APP_serverUrl}${
        process.env.VUE_APP_serverPath
      }${this.actionPath}`
    },
    headers () {
      const token = this.$store.getters.token
      return {
        Authorization: token
      }
    }
  },
  data () {
    return {
      uploadList: []
    }
  },
  mounted () {
    if (this.disabled) {
      const curUplist = document.getElementsByClassName('el-upload')
      for (let i = 0; i < curUplist.length; i++) {
        curUplist[i].style.display = 'none'
      }
    }
    this.uploadList = this.fileList
  },
  methods: {
    handleExceed (files, fileList) {
      this.$message.warning(
        `当前限制选择 ${this.limit} 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      )
      this.$emit('handle-exceed', files, fileList)
    },
    handleSuccess (response, file, fileList) {
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
      this.$emit('update:fileList', curFileList)
      this.$emit('upload-success', response, file, curFileList)
      this.uploadList = curFileList
    },
    handleChange (file, fileList) {
      this.$emit('upload-change', file, fileList)
    },
    handleReview (file) {
      this.$emit('upload-review', file)
    },
    handleRemove (file, fileList) {
      this.$emit('update:fileList', fileList)
      this.$emit('upload-remove', file, fileList)
    },
    beforeRemove (file, fileList) {
      if (this.fileType !== 'excel') {
        if (/\.(png|jpeg|jpg|mp4)$/.test(file.name)) {
          return this.$emit('before-remove', file, fileList)
        } else if (/\.(png|jpeg|jpg|mp4)$/.test(file.url)) {
          return this.$confirm(
            `此图片/视频保存任务后，将无法恢复，是否确定删除`,
            '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              center: true
            }
          ).then(() => {
            this.$emit('before-remove')
          })
        }
        this.$emit('before-remove', file, fileList)
      }
    },
    beforeUpload (file) {
      if (this.fileType === 'image') {
        const isJPG = /\.(png|jpeg|jpg)$/.test(file.name)
        if (isJPG) {
          return this.showTip(file)
        } else {
          this.$message.error('上传图片只能是 png,jpg,jpeg 格式!')
        }
      } else if (this.fileType === 'excel') {
        const isXlxs = /\.(xlsx|xls)$/.test(file.name)
        if (isXlxs) {
          return this.showTip(file)
        } else {
          this.$message.error('只能上传.xlsx,.xls格式文件!')
        }
      } else if (this.fileType === 'video') {
        const isJPG = /\.(mp4)$/.test(file.name)
        if (isJPG) {
          return this.showTip(file)
        } else {
          this.$message.error('上传视频只能是 mp4 格式!')
        }
      } else {
        const isFile = /\.(png|jpeg|jpg|mp4)$/.test(file.name)
        if (isFile) {
          return this.showTip(file)
        } else {
          this.$message.error('上传图片/视频只能是 png,jpg,jpeg,mp4 格式!')
        }
      }
      this.$emit('before-upload')
      return false
    },
    showTip (file) {
      const isLimit = file.size / 1024 / 1024 < this.size
      if (!isLimit) {
        this.$message.error(`上传文件大小不能超过 ${this.size}MB!`)
        return false
      }
      return isLimit
    },
    submitUpload () {
      this.$refs.upload.submit()
    }
  }
}
</script>
