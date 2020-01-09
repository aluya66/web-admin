<template>
  <c-card :name="title" class="form-card" id="form-params">
    <el-form
      ref="paramsFormRef"
      :model="formModel"
      label-width="120px"
      class="form"
      :rules="rules"
      label-position="right"
    >
      <el-form-item label="识别图:">
        <c-image
          class="coverImg"
          :url="formModel.coverImg"
          fit="contain"
          :preview-src-list="[formModel.coverImg]"
        ></c-image>
      </el-form-item>
      <el-form-item class="img-form-item" label="商品图片:" prop="goodsImageList">
        <el-button type="primary" @click="showDialog('image')" :disabled="isDisabled">上传图片</el-button>
        <div
          class="resource-wrapper"
          v-if="formModel.goodsImageList && formModel.goodsImageList.length"
        >
          <div class="image-item" v-for="(item, index) in formModel.goodsImageList" :key="index">
            <c-image class="image" :url="item.url" fit="contain" :preview-src-list="[item.url]"></c-image>
            <div class="btn-item">
              <el-button
                size="small"
                class="btn"
                @click="deleteImg('goodsImageList', index)"
                :disabled="isDisabled"
              >删除</el-button>
              <el-button size="small" class="btn" @click="setMainImage(index)">设为主图</el-button>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="商品视频:" prop="videoList">
        <el-button type="primary" :size="size" @click="showDialog('video')" :disabled="isDisabled">上传视频</el-button>
        <el-button type="primary" v-if="formModel.videoList && formModel.videoList.length" :size="size" @click="deleteImg('videoList', 0)" :disabled="isDisabled">删除</el-button>
        <div class="resource-wrapper" v-if="formModel.videoList && formModel.videoList.length">
          <c-image
            class="coverImg"
            url="/static/images/default-video.png"
            fit="contain"
            @click="uploadReview"
          ></c-image>
        </div>
      </el-form-item>
      <el-form-item label="商品详情:">
        <c-wangEditor :is-view="isView || isDisabled" :content.sync="formModel.intro"></c-wangEditor>
      </el-form-item>
      <div v-if="dialogObj.isShow">
        <c-dialog
          :is-show="dialogObj.isShow"
          close-btn
          @before-close="dialogObj.isShow = false"
          @on-submit="dialogConfirm"
        >
          <template v-slot:header>
            <c-multi-upload
              ref="multiUpload"
              @upload="getFileList"
              :tip="uploadType === 'image' ? '只能上传jpg/png文件，且不超过5M' : '只能上传MP4文件，且不超过5M'"
              :limit="uploadLimit"
              :file-type="uploadType"
            ></c-multi-upload>
          </template>
        </c-dialog>
      </div>
    </el-form>
  </c-card>
</template>
<script>
import CCard from 'components/card'
// import CUpload from 'components/upload'
import CImage from 'components/image'
import CWangEditor from 'components/wangEditor'
import CMultiUpload from 'components/multiUpload'
import CDialog from 'components/dialog'

export default {
  data() {
    return {
      uploadLimit: 9, // 上传数量
      uploadType: 'image', // 上传图片的类型  商品图片、视频
      dialogObj: false,
      curAttrs: [], // 全部商品参数
      curIndex: 0, // 一类商品参数下标
      checkAttrs: [], // 选中商品参数值[{1010:[212,3133]}]
      formModel: {
        goodsImageList: []
      },
      rules: {
        goodsImageList: [
          { required: true, message: '请选择商品图片', trigger: 'change' }
        ]
      }
    }
  },
  props: {
    title: String,
    dataObj: {
      type: Object,
      required: true
    },
    type: {
      type: Number,
      default: 1
    },
    isView: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'medium'
    },
    isDisabled: {
      type: Boolean,
      default: false
    }
  },
  created() {
    this.getAttrs()
    this.formModel = this.dataObj
  },
  methods: {
    setMainImage(index) {
      this.formModel.goodsImageList.unshift(...this.formModel.goodsImageList.splice(index, 1))
    },
    deleteImg(target, index) {
      this.formModel[target].splice(index, 1)
    },
    showDialog(type) {
      this.dialogObj = {
        isShow: true,
        title: type === 'image' ? '上传图片' : '上传视频'
      }
      this.uploadLimit = type === 'image' ? 9 : 1
      this.uploadType = type
    },
    getAttrs() {
      this.$api.basic.getGoodsattrval({
        pageNo: 1,
        type: this.type, // 1:参数，2:属性
        pageSize: 20
      }).then(res => {
        const { totalCount, data } = res
        if (totalCount) {
          const { goodsAttrs } = this.dataObj
          data.forEach((val, index) => {
            const checkedAttr = []
            const attrs = val.bmsGoodsAttrVals.map(item => {
              if (goodsAttrs && goodsAttrs.length) {
                goodsAttrs.forEach(eidtAttr => {
                  if (eidtAttr.attrId === val.id && eidtAttr.attributeId === item.id) {
                    checkedAttr.push(eidtAttr.attributeId)
                  }
                })
              }
              return {
                value: item.id,
                label: item.value
              }
            })
            this.curAttrs.push({ attrs, paramType: val.paramType || '', id: val.id, label: `${val.name}:`, checkedAttr })
          })
        }
      })
    },
    handleCheckedChange(value) {
      this.checkAttrs[this.curIndex] = { [this.curAttrs[this.curIndex].id]: value }
    },
    uploadReview() {
      this.$emit('show-image', { videoUrl: this.formModel.videoList[0].url, fileType: 2 })
    },
    getFileList(list) {
      if (this.uploadType === 'image') this.formModel.goodsImageList = this.formModel.goodsImageList.concat(list)
      if (this.uploadType === 'video') this.formModel.videoList = this.formModel.videoList = list
    },
    dialogConfirm() {
      this.dialogObj.isShow = false
    }
  },
  components: {
    CCard,
    CWangEditor,
    CImage,
    CMultiUpload,
    CDialog
  }
}
</script>
<style lang="less" scoped>
.form-card {
  .el-form-item {
    width: 98%;
    margin-bottom: 30px;
  }
  .select-item {
    width: 30%;
  }
  .el-radio {
    width: 100px;
    margin: 10px 0px;
  }
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
  .resource-wrapper {
    display: flex;
    margin-top: 30px;
    .image-item {
      display: flex;
      justify-content: center;
      flex-direction: column;
      width: 200px;
      height: 200px;
      .image {
        width: 200px;
        height: 200px;
        display: inline-block;
        margin-right: 5px;
      }
      .btn-item {
        display: flex;
        flex-direction: row;
        .btn {
          margin: 5px;
        }
      }
    }
  }
  .coverImg {
    width: 200px;
    height: 200px;
    display: inline-block;
    margin-right: 5px;
  }
}
</style>
