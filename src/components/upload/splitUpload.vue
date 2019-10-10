<template>
	<el-upload
		drag
		:disabled="disabled"
		:file-list="uploadList"
		:auto-upload="true"
		:http-request="checkedFile"
		:before-remove="removeFile"
		:on-exceed="handleExceed"
		:on-success="onSuccess"
		:limit="limit"
		action="/"
	>
		<i class="el-icon-upload"></i>
		<div class="el-upload__text">
			将文件拖到此处，或<em>点击上传</em>，文件大小不能超过5G
		</div>
	</el-upload>
</template>
<script>
import axios from 'axios'
import utils from 'utils'

export default {
  name: 'c-splitUpload',
  props: {
    fileList: {
      type: Array,
      default () {
        return []
      }
    },
    limit: {
      type: Number,
      default: 1
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      maxSize: 5 * 1024 * 1024 * 1024, // 上传最大文件限制
      multiUploadSize: 3 * 1024 * 1024, // 大于这个大小的文件使用分块上传(后端可以支持断点续传)
      eachSize: 3 * 1024 * 1024, // 每块文件大小
      requestCancelQueue: [], // 请求方法队列（调用取消上传
      uploadIndex: 0,
      uploadList: [],
      fileSize: 0,
      fileName: ''
    }
  },
  mounted () {
    if (this.disabled) {
      const curUplist = document.getElementsByClassName('el-upload')
      for (let i = 0; i < curUplist.length; i++) {
        curUplist[i].style.display = 'none'
      }
    }
    console.log(this.fileList)
    this.uploadList = this.fileList
  },
  watch: {
    fileList (newVal) {
      this.uploadList = newVal
    }
  },
  methods: {
    async checkedFile (options) {
      const { maxSize, multiUploadSize, splitUpload, singleUpload } = this
      const { file, onProgress, onSuccess, onError } = options
      this.fileSize = file.size
      this.fileName = file.name
      if (file.size > maxSize) {
        return this.$message.error(`您选择的文件大于${utils.getSize(maxSize)}`)
      }
      const uploadFunc =
				file.size > multiUploadSize ? splitUpload : singleUpload
      try {
        let currentChunk = 0
        const checkData = await this.checkFile(file, onProgress)
        if (checkData.status === '200') {
          if (checkData.data.viewPath) {
            onSuccess(checkData)
            return this.$message.warning(
              '此文件已存在，若要上传请修改文件名后再上传！'
            )
          } else {
            currentChunk = checkData.data.chunkCurr
          }
          const resData = await uploadFunc(file, onProgress, currentChunk)
          if (resData && resData.status === '200') {
            console.log('resData =====', resData)
            this.$msgTip('上传成功')
            onSuccess(resData)
          } else {
            this.$message.error((resData && resData.msg) || '上传文件异常！')
            onError()
          }
        } else {
          this.$message.error((checkData && checkData.msg) || '检查文件异常！')
        }
      } catch (e) {
        console.error(e)
        this.$message.error(e.message)
        onError()
      }
      const prom = new Promise(() => {})
      prom.abort = () => {}
      return prom
    },
    // 单文件直接上传
    async singleUpload (file, onProgress) {
      const singleFile = await this.postFile({
        file,
        uid: file.uid,
        name: file.name,
        chunkStr: 0,
        chunksStr: 1,
        chunkSizeStr: file.size,
        sizeStr: file.size,
        fileMd5: utils.cryptoMd5(file.name)
      },
      onProgress
      )
      return singleFile
    },
    // 大文件分块上传
    async splitUpload (file, onProgress, chunkIndex) {
      return new Promise(async (resolve, reject) => {
        try {
          let currentChunk = chunkIndex
          const { eachSize } = this
          const chunks = Math.ceil(file.size / eachSize)
          const fileChunks = await this.splitFile(file, eachSize, chunks)
          for (let i = 0; i < fileChunks.length; i++) {
            // 服务端检测已经上传到第currentChunk块了，那就直接跳到第currentChunk块，实现断点续传
            if (Number(currentChunk) === i) {
              // 每块上传完后则返回需要提交的下一块的index
              console.log(currentChunk, i, fileChunks[i])
              const resFileData = await this.postFile(
                {
                  uid: file.uid,
                  chunked: true,
                  chunkStr: i,
                  chunksStr: chunks,
                  chunkSizeStr: eachSize,
                  name: file.name,
                  sizeStr: file.size,
                  fileMd5: utils.cryptoMd5(file.name),
                  file: fileChunks[i]
                },
                onProgress
              )
              if (resFileData.status === '200') {
                if (currentChunk < fileChunks.length - 1) {
                  const resData = await this.checkFile(file, onProgress)
                  if (resData.status === '200') {
                    console.log('checkfile', resData.data)
                    currentChunk = resData.data.chunkCurr
                  }
                } else {
                  resolve(resFileData)
                }
              }
              console.log('resFileData', currentChunk, resFileData)
            }
          }
          resolve()
        } catch (e) {
          reject(e)
        }
      })
    },
    // 文件分块,利用Array.prototype.slice方法
    splitFile (file, eachSize, chunks) {
      return new Promise((resolve, reject) => {
        try {
          const blobSlice =
						File.prototype.slice ||
						File.prototype.webkitSlice ||
						File.prototype.mozSlice
          setTimeout(() => {
            const fileChunk = []
            for (let chunk = 0; chunks > 0; chunks--) {
              fileChunk.push(blobSlice.apply(file, [chunk, chunk + eachSize]))
              chunk += eachSize
            }
            console.log('fileChunk', fileChunk)
            resolve(fileChunk)
          }, 0)
        } catch (e) {
          console.error(e)
          reject(new Error('文件切块发生错误！'))
        }
      })
    },
    async checkFile (file, onProgress) {
      const { eachSize } = this
      const chunks = Math.ceil(file.size / eachSize)
      const fileData = await this.validateFile({
        uid: file.uid,
        type: 0,
        chunksStr: chunks,
        fileMd5: utils.cryptoMd5(file.name),
        fileName: file.name,
        chunkSizeStr: file.size,
        sizeStr: file.size,
        userName: 'admin'
      },
      onProgress
      )
      return fileData
    },
    handleExceed () {
      this.$message.warning(`温馨提醒，目前只能上传${this.limit} 个文件！`)
    },
    removeFile (file) {
      if (this.requestCancelQueue.length) {
        this.requestCancelQueue[file.uid]()
        delete this.requestCancelQueue[file.uid]
      }
      this.$emit('upload-remove')
      return true
    },
    onSuccess (response) {
      if (response.data) {
        let filePathUrl = process.env.VUE_APP_serverUrl
        // if (utils.getStore('_CONFIG')) {
        //   const { url } = utils.getStore('_CONFIG')
        //   filePathUrl = `http://${url}/`
        // }
        this.$emit('upload-success', [
          {
            url: `${filePathUrl}${response.data.viewPath || response.data}`,
            size: this.fileSize,
            name: this.fileName
          }
        ])
      }
    },
    getRequestParam (param, onProgress) {
      const { requestCancelQueue } = this
      return {
        cancelToken: new axios.CancelToken(function executor (cancel) {
          if (requestCancelQueue[param.uid]) {
            requestCancelQueue[param.uid]()
            delete requestCancelQueue[param.uid]
          }
          requestCancelQueue[param.uid] = cancel
        }),
        timeout: 100000,
        onUploadProgress: e => {
          if (param.chunked) {
            e.percent = Number(
              (
                ((param.chunkStr * (param.chunkSizeStr - 1) + e.loaded) /
									param.sizeStr) *
								100
              ).toFixed(2)
            )
          } else {
            e.percent = Number(((e.loaded / e.total) * 100).toFixed(2))
          }
          onProgress(e)
        }
      }
    },
    // 提交文件方法,将参数转换为FormData, 然后通过axios发起请求
    postFile (param, onProgress) {
      const formData = new FormData()
      for (let p in param) {
        formData.append(p, param[p])
      }
      const config = this.getRequestParam(param, onProgress)
      console.log(formData)
      return axios
        .post(
          `${
            process.env.VUE_APP_serverUrl
          }/ziguang/upload/chunkUpload/upload_do`,
          formData,
          config
        )
        .then(rs => rs.data)
        .catch(function (error) {
          console.log(error)
        })
    },
    // 文件校验方法
    validateFile (param, onProgress) {
      const config = this.getRequestParam(param, onProgress)
      return axios
        .post(
          `${
            process.env.VUE_APP_serverUrl
          }/ziguang/upload/chunkUpload/checkFile`,
          param,
          config
        )
        .then(rs => rs.data)
    }
  }
}
</script>
