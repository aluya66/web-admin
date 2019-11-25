<template>
	<el-upload
		class="upload"
		:ref="uploadRef"
    :http-request="customUpload"
    :disabled="disabled"
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
  name: 'CUpload',
  inheritAttrs: false,
  props: {
    uploadRef: {
      type: String,
      default: 'upload'
    },
    listType: {
      type: String,
      default: 'text'
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
    uploadList() {
      return this.fileList
    }
  },
  mounted () {
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
      let params = new FormData()
      params.append('files', [fileObj.file]) // 将数据转换成Form Data 文件上传模式
      this.$api.common.uploadFile(params).then(res => {
        console.log(res)
      })
    },
    handleExceed (files, fileList) {
      this.$message.warning(
        `当前限制选择 ${this.limit} 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      )
      this.$emit('on-exceed', files, fileList)
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
      this.$emit('on-success', response, file, curFileList)
      this.uploadList = curFileList
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
