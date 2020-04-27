<template>
<c-card :name="title" class="form-card" id="form-img">
    <el-form
      ref="formRef"
      :model="formModel"
      label-width="120px"
      class="form"
      label-position="right"
    >
       <el-form-item label="设计图:" prop="imgList">
            <c-upload
                ref="imgList"
                class="pic"
                auto-upload
                action="/api/upload/file"
                :http-request="uploadHandle"
                list-type="picture-card"
                :size="20"
                :limit="9"
                :fileList="formModel.productImages"
                @on-success="uploadSuccess"
                :on-remove="uploadRemove.bind(this,'imgList')"
            >
            <i class="el-icon-plus"></i>
            <div class="info">350px*350px</div>
        </c-upload>
    </el-form-item>
    </el-form>
</c-card>
</template>

<script>
import CCard from 'components/card'
import CUpload from 'components/upload'

export default {
  components: {
    CCard,
    CUpload
  },
  computed: {
    formModel() {
      return this.dataObj
    }
  },
  data() {
    return {

    }
  },
  props: {
    title: String,
    dataObj: {
      type: Object,
      required: true
    },
    size: {
      type: String,
      default: 'medium'
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {

    },
    uploadSuccess(response, file, fileList) {
      console.info(response,file,fileList,"=====")
      this.formModel.productImages = fileList.map((item) => {
        return {
          ...item,
          fileType: 'image'
        }
      })
    },
    uploadRemove(type, file, fileList) {
      this.formModel.productImages = fileList || []
    },
    uploadHandle(file) {
      this.$refs.imgList.customUpload(file)
    },
    uploadReview(file) {
      this.$emit('show-image', file)
    }
  }

}
</script>

<style lang="less" scoped>
.pic {
    padding-bottom: 25px;
    span {
      display: inline-block;
      margin-bottom: 10px;
    }
    .info {
      line-height: 20px;
      height: 20px;
      margin-top: 5px;
      font-size: @f12;
    }
  }
.form-card {
  .el-form-item {
    width: 98%;
    margin-bottom: 15px;
  }
  .select-item {
    width: 30%;
  }

  .tempimg {
    width: 200px;
    height: 200px;
    display: inline-block;
    margin-right: 5px;
  }
}
</style>
