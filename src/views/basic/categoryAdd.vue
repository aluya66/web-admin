<template>
  <el-form
    ref="formRef"
    :model="formModel"
    :rules="rules"
    label-width="120px"
    class="form"
    label-position="right"
    status-icon
  >
    <el-form-item label="类目名称:" prop="categoryName">
      <el-input
        v-model.trim="formModel.categoryName"
        class="form-item"
        clearable
      ></el-input>
    </el-form-item>

    <!-- <el-form-item label="图片:">
      <c-upload
        ref="curUpload"
        class="pic"
        :fileList="formModel.imageUrl"
        is-auto
        :size="20"
        :limit="5"
        action-path="/auth/uploadFile"
        upload-style="picture-card"
        @upload-success="uploadSuccess"
        @upload-remove="uploadRemove"
        @upload-review="uploadReview"
      >
        <i class="el-icon-plus"></i>
        <div class="info">上传图片/视频应小于20M</div>
      </c-upload>
    </el-form-item> -->

    <el-form-item label="父级分类编码:" prop="parentCode" v-if="categoryEdit === false">
      <el-input
        v-model.trim="formModel.parentCode"
        class="form-item"
        clearable
      ></el-input>
    </el-form-item>
    <el-row>
      <el-col :span="12">
        <el-form-item label="安全级别:" prop="safeLevel">
          <el-select
            v-model="formModel.safeLevel"
            class="select-item"
            clearable
          >
            <el-option
              v-for="item in safeLevelSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="排序" prop="sortNumber">
          <el-input-number
            v-model.trim="formModel.sortNumber"
            class="select-item"
            controls-position="right"
            :min="1"
            :max="10000"
          ></el-input-number>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="执行标准:" prop="standard">
      <el-input
      v-model.trim="formModel.standard"
      class="form-item"
      clearable
      ></el-input>
    </el-form-item>

  </el-form>
</template>

<script>

export default {
  props: {
    initData: {
      type: Object,
      default() {
        return {
          categoryName: '',
          imageUrl: '',
          parentCode: '',
          safeLevel: '',
          standard: '',
          sortNumber: 100
        }
      }
    },
    isCategory: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      categoryEdit: '',
      rules: {
        categoryName: [
          { required: true, message: '请填写类目名称', trigger: 'blur' }
        ],
        // imageUrl: [
        //   { required: true, message: "请填写图片地址", trigger: "blur" }
        // ],
        parentCode: [
          { required: true, message: '请填写父级分类编码', trigger: 'blur' }
        ],
        safeLevel: [
          { required: true, message: '请选择安全级别', trigger: 'change' }
        ],
        sortNumber: [
          { required: true, message: '请填写排序值', trigger: 'blur' }
        ],
        standard: [
          { required: true, message: '请填写执行标准', trigger: 'blur' }
        ]
      },
      safeLevelSelect: [
        {
          value: '',
          label: '全部'
        },
        {
          value: 1,
          label: '一级'
        },
        {
          value: 12,
          label: '二级'
        },
        {
          value: 3,
          label: '三级'
        }
      ]
    }
  },
  computed: {
    formModel() {
      // const { categoryName, imageUrl, parentCode, sortNumber, goodsStaticFiles, safeLevel, standard } = this.initData
      // const fileList = goodsStaticFiles && goodsStaticFiles.map(res => ({
      //   name: res.imageId,
      //   url: res.imageUrl,
      //   videoUrl: res.videoUrl,
      //   fileType: res.fileType
      // }))
      // return { fileList, categoryName, imageUrl, parentCode, sortNumber, safeLevel, standard, sortNumber }
      return this.initData
    }
  },
  created() {
    this.categoryEdit = this.isCategory
  },
  methods: {
    uploadSuccess(response, file, fileList) {
      this.fileList = fileList
    },
    uploadRemove(file, fileList) {
      this.fileList = fileList
    },
    uploadReview(file) {
      this.$emit('show-image', file)
    }
  }
}
</script>

<style lang="less">
.form {
  width: 90%;
  .form-item {
    width: 100%;
  }
  .select-item{
    width: 100%
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
}
</style>
